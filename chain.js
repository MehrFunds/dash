import { DirectSecp256k1HdWallet, Registry, SigningStargateClient, defaultRegistryTypes, TxRaw } from '/cosmjs-bundle.js'
import { MsgCreateWatch, MsgDeleteWatch, MsgCreateWebhook, MsgDeleteWebhook } from '/messages.js'

export const NODE_URL = (window.MEHR_NODE_URL || 'https://edge-3.mehrfunds.com:2083').replace(/\/$/, '')
export const CHAIN_ID = window.MEHR_CHAIN_ID || 'mehr-1'

const _registry = new Registry([
  ...defaultRegistryTypes,
  ['/mehr.v1.MsgCreateWatch',   MsgCreateWatch],
  ['/mehr.v1.MsgDeleteWatch',   MsgDeleteWatch],
  ['/mehr.v1.MsgCreateWebhook', MsgCreateWebhook],
  ['/mehr.v1.MsgDeleteWebhook', MsgDeleteWebhook],
])

// Derive a secp256k1 wallet from a BIP39 mnemonic.
// Uses the standard Cosmos HD path m/44'/118'/0'/0/0 — same as mehrd, Keplr, Leap.
export function walletFromMnemonic(mnemonic) {
  return DirectSecp256k1HdWallet.fromMnemonic(mnemonic.trim(), { prefix: 'mehr' })
}

export async function getWalletAddress(wallet) {
  const [account] = await wallet.getAccounts()
  return account.address
}

async function getAccountInfo(address) {
  const r = await fetch(`${NODE_URL}/cosmos/auth/v1beta1/accounts/${address}`, {
    signal: AbortSignal.timeout(5000),
  })
  if (!r.ok) throw new Error('Account not found on chain. Send some MEHR to this address first.')
  const { account } = await r.json()
  return {
    accountNumber: parseInt(account.account_number || '0'),
    sequence:      parseInt(account.sequence      || '0'),
  }
}

function bytesToBase64(bytes) {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

// Sign a single custom message offline (no RPC needed) and broadcast via REST.
export async function broadcastMsg(wallet, signerAddress, typeUrl, value) {
  const info   = await getAccountInfo(signerAddress)
  const client = await SigningStargateClient.offline(wallet, { registry: _registry })
  const fee    = { amount: [{ amount: '2000', denom: 'umehr' }], gas: '200000' }
  const signed = await client.sign(
    signerAddress,
    [{ typeUrl, value }],
    fee,
    '',
    { accountNumber: info.accountNumber, sequence: info.sequence, chainId: CHAIN_ID },
  )
  const txBytes = TxRaw.encode(signed).finish()
  const r = await fetch(`${NODE_URL}/cosmos/tx/v1beta1/txs`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ tx_bytes: bytesToBase64(txBytes), mode: 'BROADCAST_MODE_SYNC' }),
    signal:  AbortSignal.timeout(15000),
  })
  const d = await r.json()
  if (d.tx_response?.code !== 0) throw new Error(d.tx_response?.raw_log || 'Transaction failed')
  return d
}
