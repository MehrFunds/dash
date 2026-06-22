import { Bip39, EnglishMnemonic, Random } from '@cosmjs/crypto'
import { NODE_URL } from './chain.js'
import { walletFromMnemonic, getWalletAddress, broadcastMsg } from './chain.js'

// ── Session ───────────────────────────────────────────────────────────────────

const SESSION_KEY = 'mf_s'

function sessionSave(data) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)) } catch {}
}
function session(key) {
  try {
    var obj = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}')
    return key !== undefined ? obj[key] : obj
  } catch { return key !== undefined ? null : {} }
}
function sessionClear() { sessionStorage.removeItem(SESSION_KEY) }

function saveSession() {
  sessionSave({
    wallets: _wallets.map(function(w) { return w.address }),
    activeIndex: _activeIndex,
  })
}

// ── Wallet state ──────────────────────────────────────────────────────────────

var _wallets     = []   // [{ wallet: DirectSecp256k1HdWallet, address: string }]
var _activeIndex = 0

function activeAddress() {
  if (_wallets.length > 0 && _wallets[_activeIndex]) return _wallets[_activeIndex].address
  // readonly fallback after page reload (no private key, but address known)
  var saved = session('wallets')
  if (saved && saved.length > 0) return saved[session('activeIndex') || 0] || saved[0]
  return session('bech32_address') || null   // backward-compat with old single-wallet session
}

function requireWallet() {
  var w = _wallets[_activeIndex]
  if (!w) throw new Error('Session expired — sign in again to make changes.')
  return w.wallet
}

async function addWallet(wallet) {
  var address = await getWalletAddress(wallet)
  var existing = _wallets.findIndex(function(w) { return w.address === address })
  if (existing >= 0) {
    _activeIndex = existing
  } else {
    _wallets.push({ wallet: wallet, address: address })
    _activeIndex = _wallets.length - 1
  }
  saveSession()
}

function switchToWallet(index) {
  if (!_wallets[index]) return
  _activeIndex = index
  saveSession()
  updateSidebarWallet()
  renderAccounts()
  // refresh whichever view is active
  var active = document.querySelector('.snav-item.active')
  var view   = active ? active.dataset.view : 'overview'
  if (view === 'overview')  loadOverview()
  if (view === 'watches')   loadWatches()
  if (view === 'webhooks')  loadWebhooks()
}

function updateSidebarWallet() {
  var addr = activeAddress()
  setText('kpi-address', addr || '—')
  var short = addr ? (addr.slice(0, 10) + '…' + addr.slice(-6)) : '—'
  setText('sidebar-wallet-addr', short)
}

// ── Views ─────────────────────────────────────────────────────────────────────

function showLanding() {
  el('view-auth').style.display = ''
  el('view-dash').style.display = 'none'
  resetGenFlow()
}

async function loadOverview() {
  var bech32 = activeAddress()
  if (!bech32) return
  try {
    var [balRes, nodeRes] = await Promise.all([
      fetch(NODE_URL + '/cosmos/bank/v1beta1/balances/' + bech32, { signal: AbortSignal.timeout(5000) }),
      fetch(NODE_URL + '/cosmos/base/tendermint/v1beta1/node_info', { signal: AbortSignal.timeout(5000) }),
    ])
    if (balRes.ok) {
      var balData = await balRes.json()
      var umehr   = (balData.balances || []).find(function(b) { return b.denom === 'umehr' })
      var amount  = umehr ? (parseInt(umehr.amount) / 1e6).toLocaleString(undefined, { maximumFractionDigits: 6 }) : '0'
      setText('kpi-balance', amount + ' MEHR')
    }
    if (nodeRes.ok) {
      var nodeData = await nodeRes.json()
      setText('kpi-chain', nodeData.default_node_info.network)
    }
  } catch {}

  try {
    var blkRes = await fetch(NODE_URL + '/cosmos/base/tendermint/v1beta1/blocks/latest', { signal: AbortSignal.timeout(5000) })
    if (blkRes.ok) {
      var blkData = await blkRes.json()
      setText('kpi-height', '#' + blkData.block.header.height)
    }
  } catch {}
}

function showDashboard() {
  el('view-auth').style.display = 'none'
  el('view-dash').style.display = ''
  updateSidebarWallet()
  switchDashView('overview')
}

function switchDashView(name) {
  ;['overview', 'accounts', 'watches', 'webhooks', 'keys'].forEach(function(v) {
    el('dash-view-' + v).classList.toggle('hidden', v !== name)
  })
  qsa('.snav-item').forEach(function(a) { a.classList.toggle('active', a.dataset.view === name) })
  var titles = { overview: 'Overview', accounts: 'Accounts', watches: 'Watches', webhooks: 'Webhooks', keys: 'API Keys' }
  setText('dash-header-title', titles[name] || name)
  if (name === 'overview')  loadOverview()
  if (name === 'accounts')  loadAccounts()
  if (name === 'watches')   { closeWatchForm();   loadWatches() }
  if (name === 'webhooks')  { closeWebhookForm(); loadWebhooks() }
}

// ── Tab switching ─────────────────────────────────────────────────────────────

function switchTab(tab) {
  qsa('.tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tab) })
  el('tab-generate').classList.toggle('hidden', tab !== 'generate')
  el('tab-import').classList.toggle('hidden',   tab !== 'import')
  clearErrors()
}

function clearErrors() {
  ;['gen-err', 'import-err'].forEach(function(id) {
    var e = el(id); if (e) { e.classList.add('hidden'); e.textContent = '' }
  })
}
function showError(id, msg) {
  var e = el(id); if (!e) return
  e.textContent = msg; e.classList.remove('hidden')
}

// ── Generate flow ─────────────────────────────────────────────────────────────

var _pendingMnemonic = null
var _pendingWallet   = null

function resetGenFlow() {
  _pendingMnemonic = null
  _pendingWallet   = null
  el('gen-intro').classList.remove('hidden')
  el('gen-show').classList.add('hidden')
  el('key-saved').checked           = false
  el('btn-create-account').disabled = true
  el('mnemonic-grid').innerHTML     = ''
  el('address-box').textContent     = ''
  clearErrors()
}

function renderMnemonicGrid(words) {
  el('mnemonic-grid').innerHTML = words.map(function(word, i) {
    return '<div class="mnemonic-word"><span class="word-num">' + (i + 1) + '.</span><span class="word-text">' + word + '</span></div>'
  }).join('')
}

async function onGenerateKey() {
  var btn = el('btn-gen-key')
  btn.disabled    = true
  btn.textContent = 'Generating…'
  try {
    _pendingMnemonic = Bip39.encode(Random.getBytes(32)).toString()
    _pendingWallet   = await walletFromMnemonic(_pendingMnemonic)
    var address      = await getWalletAddress(_pendingWallet)
    renderMnemonicGrid(_pendingMnemonic.split(' '))
    el('address-box').textContent = address
    el('gen-intro').classList.add('hidden')
    el('gen-show').classList.remove('hidden')
  } catch (err) {
    btn.disabled    = false
    btn.textContent = 'Generate account'
    showError('gen-err', err.message)
  }
}

async function onCreateAccount() {
  if (!_pendingWallet) return
  await addWallet(_pendingWallet)
  showDashboard()
}

function downloadPhrase(mnemonic) {
  var blob = new Blob([mnemonic], { type: 'text/plain' })
  var url  = URL.createObjectURL(blob)
  var a    = document.createElement('a')
  a.href = url; a.download = 'recovery-phrase.txt'; a.click()
  URL.revokeObjectURL(url)
}

// ── Import flow (sign-in) ─────────────────────────────────────────────────────

async function onImportKeys() {
  clearErrors()
  var btn = el('btn-sign-in')
  btn.disabled = true
  try {
    var phrase = el('import-phrase').value.trim()
    if (!phrase) { showError('import-err', 'Recovery phrase is required.'); return }
    try { new EnglishMnemonic(phrase) }
    catch { showError('import-err', 'Invalid recovery phrase — check for typos or wrong word count.'); return }
    var wallet = await walletFromMnemonic(phrase)
    await addWallet(wallet)
    showDashboard()
  } catch (err) {
    showError('import-err', err.message)
  } finally {
    btn.disabled    = false
    btn.textContent = 'Sign in'
  }
}

// ── Accounts view (wallet management) ────────────────────────────────────────

function renderAccounts() {
  var list = el('account-list')
  if (!list) return

  // Merge in-memory wallets with session addresses for display after reload
  var savedAddrs  = session('wallets') || (session('bech32_address') ? [session('bech32_address')] : [])
  var memAddrs    = _wallets.map(function(w) { return w.address })
  // Show all known addresses; prefer in-memory list if available
  var displayList = memAddrs.length ? memAddrs : savedAddrs

  if (!displayList.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">◎</div><h3>No wallets added</h3><p>Sign in with a recovery phrase to add one.</p></div>'
    return
  }

  list.innerHTML = '<div class="item-list">' + displayList.map(function(addr, i) {
    var isActive  = (i === _activeIndex)
    var canSwitch = (i !== _activeIndex) && (_wallets.length > 0)
    return '<div class="item-card">' +
      '<div class="item-dot' + (isActive ? '' : ' item-dot-muted') + '"></div>' +
      '<div class="item-info">' +
        '<div class="item-primary">' + addr + '</div>' +
        '<div class="item-secondary">' + (isActive ? 'Active' : '') + '</div>' +
      '</div>' +
      (canSwitch ? '<button class="btn ghost small btn-switch-wallet" data-index="' + i + '">Switch</button>' : '') +
    '</div>'
  }).join('') + '</div>'
}

function loadAccounts() {
  renderAccounts()
}

// Add-wallet form inside the accounts view
function openAddAccountForm() {
  el('form-add-account').classList.remove('hidden')
  el('btn-add-account').classList.add('hidden')
  el('add-account-phrase').value = ''
  hideFormErr('add-account-err')
  el('add-account-phrase').focus()
}
function closeAddAccountForm() {
  el('form-add-account').classList.add('hidden')
  el('btn-add-account').classList.remove('hidden')
  el('add-account-phrase').value = ''
  hideFormErr('add-account-err')
}

async function onAddAccount() {
  var phrase = el('add-account-phrase').value.trim()
  if (!phrase) { showFormErr('add-account-err', 'Recovery phrase is required.'); return }
  try { new EnglishMnemonic(phrase) }
  catch { showFormErr('add-account-err', 'Invalid recovery phrase.'); return }

  var btn = el('btn-confirm-add-account')
  btn.disabled = true; btn.textContent = 'Adding…'
  try {
    var wallet = await walletFromMnemonic(phrase)
    await addWallet(wallet)
    closeAddAccountForm()
    updateSidebarWallet()
    renderAccounts()
    loadOverview()
  } catch (err) {
    showFormErr('add-account-err', err.message)
  } finally {
    btn.disabled = false; btn.textContent = 'Add wallet →'
  }
}

// ── Networks ──────────────────────────────────────────────────────────────────

var NETWORKS = {
  ethereum: 'Ethereum',
  base:     'Base',
  polygon:  'Polygon',
  arbitrum: 'Arbitrum',
  optimism: 'Optimism',
  bnb:      'BNB Chain',
}

// ── Watches ───────────────────────────────────────────────────────────────────

var _watches = []

function renderWatches() {
  var list = el('watch-list')
  if (!list) return
  if (!_watches.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">⬡</div><h3>No watches yet</h3><p>Monitor any EVM address for deposits and events.</p></div>'
    return
  }
  list.innerHTML = '<div class="item-list">' + _watches.map(function(w) {
    return '<div class="item-card" data-id="' + w.id + '">' +
      '<div class="item-dot"></div>' +
      '<div class="item-info">' +
        '<div class="item-primary">' + w.address + '</div>' +
        '<div class="item-secondary">' + (w.label || '') + '</div>' +
      '</div>' +
      '<span class="item-tag">' + (NETWORKS[w.network] || w.network) + '</span>' +
      '<button class="btn ghost small btn-delete-watch" data-id="' + w.id + '">Remove</button>' +
    '</div>'
  }).join('') + '</div>'
}

async function loadWatches() {
  var bech32 = activeAddress()
  if (!bech32) { renderWatches(); return }
  try {
    var r = await fetch(NODE_URL + '/mehr/v1/watches/' + bech32, { signal: AbortSignal.timeout(5000) })
    if (r.ok) { var d = await r.json(); _watches = d.watches || [] }
  } catch {}
  renderWatches()
}

async function saveWatch() {
  var evmAddr = el('watch-address').value.trim()
  var network = el('watch-network').value
  var label   = el('watch-label').value.trim()

  if (!/^0x[0-9a-fA-F]{40}$/.test(evmAddr)) {
    showFormErr('watch-err', 'Invalid EVM address — must be 0x followed by 40 hex characters.')
    return
  }

  var wallet
  try { wallet = requireWallet() } catch (e) { showFormErr('watch-err', e.message); return }

  var creator = activeAddress()
  var btn = el('btn-save-watch')
  btn.disabled = true; btn.textContent = 'Adding…'
  try {
    await broadcastMsg(wallet, creator, '/mehr.v1.MsgCreateWatch', { creator, network, address: evmAddr, label })
    closeWatchForm()
    await loadWatches()
  } catch (e) {
    showFormErr('watch-err', e.message || 'Could not reach node.')
  } finally {
    btn.disabled = false; btn.textContent = 'Add watch →'
  }
}

async function deleteWatch(id) {
  var wallet; try { wallet = requireWallet() } catch { return }
  var creator = activeAddress()
  try {
    await broadcastMsg(wallet, creator, '/mehr.v1.MsgDeleteWatch', { creator, watchId: parseInt(id) })
  } catch {}
  _watches = _watches.filter(function(w) { return String(w.id) !== String(id) })
  renderWatches()
}

function openWatchForm() {
  el('form-watch').classList.remove('hidden')
  el('btn-add-watch').classList.add('hidden')
  el('watch-address').focus()
}
function closeWatchForm() {
  el('form-watch').classList.add('hidden')
  el('btn-add-watch').classList.remove('hidden')
  el('watch-address').value = ''
  el('watch-label').value   = ''
  el('watch-network').value = 'ethereum'
  hideFormErr('watch-err')
}

// ── Webhooks ──────────────────────────────────────────────────────────────────

var _webhooks = []

function b64urlEncode(bytes) {
  return btoa(String.fromCharCode.apply(null, bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function generateWebhookSecret() { return 'whsec_' + b64urlEncode(crypto.getRandomValues(new Uint8Array(24))) }
function toHex(buf) {
  return Array.from(new Uint8Array(buf)).map(function(b) { return b.toString(16).padStart(2, '0') }).join('')
}

function renderWebhooks() {
  var list = el('webhook-list')
  if (!list) return
  if (!_webhooks.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">⬘</div><h3>No endpoints yet</h3><p>Add an endpoint to receive signed event payloads.</p></div>'
    return
  }
  list.innerHTML = '<div class="item-list">' + _webhooks.map(function(w) {
    return '<div class="item-card" data-id="' + w.id + '">' +
      '<div class="item-dot"></div>' +
      '<div class="item-info">' +
        '<div class="item-primary">' + w.url + '</div>' +
        '<div class="item-secondary">Added ' + new Date(w.created_at).toLocaleDateString() + '</div>' +
      '</div>' +
      '<button class="btn ghost small btn-delete-webhook" data-id="' + w.id + '">Remove</button>' +
    '</div>'
  }).join('') + '</div>'
}

async function loadWebhooks() {
  var bech32 = activeAddress()
  if (!bech32) { renderWebhooks(); return }
  try {
    var r = await fetch(NODE_URL + '/mehr/v1/webhooks/' + bech32, { signal: AbortSignal.timeout(5000) })
    if (r.ok) { var d = await r.json(); _webhooks = d.webhooks || [] }
  } catch {}
  renderWebhooks()
}

async function saveWebhook() {
  var url    = el('webhook-url').value.trim()
  var secret = el('webhook-secret').value

  if (!url || !/^https?:\/\/.+/.test(url)) {
    showFormErr('webhook-err', 'Enter a valid URL starting with https://')
    return
  }

  var wallet; try { wallet = requireWallet() } catch (e) { showFormErr('webhook-err', e.message); return }

  var creator = activeAddress()
  var btn = el('btn-save-webhook')
  btn.disabled = true; btn.textContent = 'Adding…'
  try {
    var secretHash = toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret)))
    await broadcastMsg(wallet, creator, '/mehr.v1.MsgCreateWebhook', { creator, url, secretHash })
    closeWebhookForm()
    await loadWebhooks()
  } catch (e) {
    showFormErr('webhook-err', e.message || 'Could not reach node.')
  } finally {
    btn.disabled = false; btn.textContent = 'Add endpoint →'
  }
}

async function deleteWebhook(id) {
  var wallet; try { wallet = requireWallet() } catch { return }
  var creator = activeAddress()
  try {
    await broadcastMsg(wallet, creator, '/mehr.v1.MsgDeleteWebhook', { creator, webhookId: parseInt(id) })
  } catch {}
  _webhooks = _webhooks.filter(function(w) { return String(w.id) !== String(id) })
  renderWebhooks()
}

function openWebhookForm() {
  el('webhook-secret').value = generateWebhookSecret()
  el('form-webhook').classList.remove('hidden')
  el('btn-add-webhook').classList.add('hidden')
  el('webhook-url').focus()
}
function closeWebhookForm() {
  el('form-webhook').classList.add('hidden')
  el('btn-add-webhook').classList.remove('hidden')
  el('webhook-url').value    = ''
  el('webhook-secret').value = ''
  hideFormErr('webhook-err')
}

function showFormErr(id, msg) { var e = el(id); if (!e) return; e.textContent = msg; e.classList.remove('hidden') }
function hideFormErr(id)      { var e = el(id); if (!e) return; e.textContent = ''; e.classList.add('hidden') }

// ── Template mounting ─────────────────────────────────────────────────────────

function mount(id) {
  var tpl = document.getElementById(id)
  if (!tpl) return
  document.body.appendChild(tpl.content.cloneNode(true))
}

// ── Boot ──────────────────────────────────────────────────────────────────────

function boot() {
  mount('tpl-auth')
  mount('tpl-dashboard')
  wireEvents()
  var hasSavedSession = session('wallets') || session('bech32_address')
  if (hasSavedSession) showDashboard()
  else showLanding()
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function el(id)   { return document.getElementById(id) }
function qsa(sel) { return document.querySelectorAll(sel) }
function setText(id, val) { var e = el(id); if (e) e.textContent = val }

// ── Events ────────────────────────────────────────────────────────────────────

function wireEvents() {
  qsa('.tab').forEach(function(t) {
    t.addEventListener('click', function() { switchTab(t.dataset.tab) })
  })

  el('btn-logout').addEventListener('click', function() {
    _wallets     = []
    _activeIndex = 0
    sessionClear()
    showLanding()
  })

  qsa('.snav-item').forEach(function(item) {
    item.addEventListener('click', function(e) { e.preventDefault(); switchDashView(item.dataset.view) })
  })

  el('btn-gen-key').addEventListener('click', onGenerateKey)

  el('btn-dl-phrase').addEventListener('click', function() {
    if (_pendingMnemonic) downloadPhrase(_pendingMnemonic)
  })

  el('btn-copy-addr').addEventListener('click', function() {
    var addr = el('address-box').textContent; if (!addr) return
    navigator.clipboard.writeText(addr).then(function() {
      var btn = el('btn-copy-addr'), orig = btn.textContent
      btn.textContent = 'Copied!'
      setTimeout(function() { btn.textContent = orig }, 1500)
    })
  })

  el('key-saved').addEventListener('change', function(e) {
    el('btn-create-account').disabled = !e.target.checked
  })

  el('btn-create-account').addEventListener('click', onCreateAccount)
  el('btn-sign-in').addEventListener('click', onImportKeys)

  // Accounts view
  el('btn-add-account').addEventListener('click', openAddAccountForm)
  el('btn-cancel-add-account').addEventListener('click', closeAddAccountForm)
  el('btn-confirm-add-account').addEventListener('click', onAddAccount)
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn-switch-wallet')
    if (btn) switchToWallet(parseInt(btn.dataset.index))
  })

  // Watches
  el('btn-add-watch').addEventListener('click', openWatchForm)
  el('btn-cancel-watch').addEventListener('click', closeWatchForm)
  el('btn-save-watch').addEventListener('click', saveWatch)
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn-delete-watch')
    if (btn) deleteWatch(btn.dataset.id)
  })

  // Webhooks
  el('btn-add-webhook').addEventListener('click', openWebhookForm)
  el('btn-cancel-webhook').addEventListener('click', closeWebhookForm)
  el('btn-save-webhook').addEventListener('click', saveWebhook)
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn-delete-webhook')
    if (btn) deleteWebhook(btn.dataset.id)
  })

  el('btn-copy-secret').addEventListener('click', function() {
    var val = el('webhook-secret').value; if (!val) return
    navigator.clipboard.writeText(val).then(function() {
      var btn = el('btn-copy-secret'), orig = btn.textContent
      btn.textContent = 'Copied!'
      setTimeout(function() { btn.textContent = orig }, 1500)
    })
  })

  el('import-phrase-file').addEventListener('change', async function(e) {
    var file = e.target.files && e.target.files[0]; if (!file) return
    el('import-phrase').value = (await file.text()).trim()
  })
}

document.addEventListener('DOMContentLoaded', boot)
