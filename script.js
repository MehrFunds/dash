// =============================================================================
// Mehr Funds — client
//
// Identity:   BIP39 mnemonic (24 words) → SLIP10/Ed25519 keypair.
//             Private key never leaves the browser.
//             Address = base58(ed25519_public_key), no prefix.
//
// Auth:       Challenge-response Ed25519 signature + Proof of Work.
// Derivation: m/44'/118'/0'/0'/0'  (all hardened — required for SLIP10+Ed25519)
//
// External deps (loaded as plain <script> tags, no module system):
//   tweetnacl — Ed25519 public key derivation from seed  → window.nacl
//   BIP39 wordlist — fetched as JSON from jsdelivr at boot
// =============================================================================

// ── BIP39 wordlist (inlined — no network request needed) ─────────────────────

var BIP39_WORDLIST = ["abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","already","also","alter","always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger","angle","angry","animal","ankle","announce","annual","another","answer","antenna","antique","anxiety","any","apart","apology","appear","apple","approve","april","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrest","arrive","arrow","art","artefact","artist","artwork","ask","aspect","assault","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake","aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","bag","balance","balcony","ball","bamboo","banana","banner","bar","barely","bargain","barrel","base","basic","basket","battle","beach","bean","beauty","because","become","beef","before","begin","behave","behind","believe","below","belt","bench","benefit","best","betray","better","between","beyond","bicycle","bid","bike","bind","biology","bird","birth","bitter","black","blade","blame","blanket","blast","bleak","bless","blind","blood","blossom","blouse","blue","blur","blush","board","boat","body","boil","bomb","bone","bonus","book","boost","border","boring","borrow","boss","bottom","bounce","box","boy","bracket","brain","brand","brass","brave","bread","breeze","brick","bridge","brief","bright","bring","brisk","broccoli","broken","bronze","broom","brother","brown","brush","bubble","buddy","budget","buffalo","build","bulb","bulk","bullet","bundle","bunker","burden","burger","burst","bus","business","busy","butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cake","call","calm","camera","camp","can","canal","cancel","candy","cannon","canoe","canvas","canyon","capable","capital","captain","car","carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle","casual","cat","catalog","catch","category","cattle","caught","cause","caution","cave","ceiling","celery","cement","census","century","cereal","certain","chair","chalk","champion","change","chaos","chapter","charge","chase","chat","cheap","check","cheese","chef","cherry","chest","chicken","chief","child","chimney","choice","choose","chronic","chuckle","chunk","churn","cigar","cinnamon","circle","citizen","city","civil","claim","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","clock","clog","close","cloth","cloud","clown","club","clump","cluster","clutch","coach","coast","coconut","code","coffee","coil","coin","collect","color","column","combine","come","comfort","comic","common","company","concert","conduct","confirm","congress","connect","consider","control","convince","cook","cool","copper","copy","coral","core","corn","correct","cost","cotton","couch","country","couple","course","cousin","cover","coyote","crack","cradle","craft","cram","crane","crash","crater","crawl","crazy","cream","credit","creek","crew","cricket","crime","crisp","critic","crop","cross","crouch","crowd","crucial","cruel","cruise","crumble","crunch","crush","cry","crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cute","cycle","dad","damage","damp","dance","danger","daring","dash","daughter","dawn","day","deal","debate","debris","decade","december","decide","decline","decorate","decrease","deer","defense","define","defy","degree","delay","deliver","demand","demise","denial","dentist","deny","depart","depend","deposit","depth","deputy","derive","describe","desert","design","desk","despair","destroy","detail","detect","develop","device","devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","disease","dish","dismiss","disorder","display","distance","divert","divide","divorce","dizzy","doctor","document","dog","doll","dolphin","domain","donate","donkey","donor","door","dose","double","dove","draft","dragon","drama","drastic","draw","dream","dress","drift","drill","drink","drip","drive","drop","drum","dry","duck","dumb","dune","during","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth","easily","east","easy","echo","ecology","economy","edge","edit","educate","effort","egg","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","else","embark","embody","embrace","emerge","emotion","employ","empower","empty","enable","enact","end","endless","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensure","enter","entire","entry","envelope","episode","equal","equip","era","erase","erode","erosion","error","erupt","escape","essay","essence","estate","eternal","ethics","evidence","evil","evoke","evolve","exact","example","excess","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exile","exist","exit","exotic","expand","expect","expire","explain","expose","express","extend","extra","eye","eyebrow","fabric","face","faculty","fade","faint","faith","fall","false","fame","family","famous","fan","fancy","fantasy","farm","fashion","fat","fatal","father","fatigue","fault","favorite","feature","february","federal","fee","feed","feel","female","fence","festival","fetch","fever","few","fiber","fiction","field","figure","file","film","filter","final","find","fine","finger","finish","fire","firm","first","fiscal","fish","fit","fitness","fix","flag","flame","flash","flat","flavor","flee","flight","flip","float","flock","floor","flower","fluid","flush","fly","foam","focus","fog","foil","fold","follow","food","foot","force","forest","forget","fork","fortune","forum","forward","fossil","foster","found","fox","fragile","frame","frequent","fresh","friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun","funny","furnace","fury","future","gadget","gain","galaxy","gallery","game","gap","garage","garbage","garden","garlic","garment","gas","gasp","gate","gather","gauge","gaze","general","genius","genre","gentle","genuine","gesture","ghost","giant","gift","giggle","ginger","giraffe","girl","give","glad","glance","glare","glass","glide","glimpse","globe","gloom","glory","glove","glow","glue","goat","goddess","gold","good","goose","gorilla","gospel","gossip","govern","gown","grab","grace","grain","grant","grape","grass","gravity","great","green","grid","grief","grit","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","gun","gym","habit","hair","half","hammer","hamster","hand","happy","harbor","hard","harsh","harvest","hat","have","hawk","hazard","head","health","heart","heavy","hedgehog","height","hello","helmet","help","hen","hero","hidden","high","hill","hint","hip","hire","history","hobby","hockey","hold","hole","holiday","hollow","home","honey","hood","hope","horn","horror","horse","hospital","host","hotel","hour","hover","hub","huge","human","humble","humor","hundred","hungry","hunt","hurdle","hurry","hurt","husband","hybrid","ice","icon","idea","identify","idle","ignore","ill","illegal","illness","image","imitate","immense","immune","impact","impose","improve","impulse","inch","include","income","increase","index","indicate","indoor","industry","infant","inflict","inform","inhale","inherit","initial","inject","injury","inmate","inner","innocent","input","inquiry","insane","insect","inside","inspire","install","intact","interest","into","invest","invite","involve","iron","island","isolate","issue","item","ivory","jacket","jaguar","jar","jazz","jealous","jeans","jelly","jewel","job","join","joke","journey","joy","judge","juice","jump","jungle","junior","junk","just","kangaroo","keen","keep","ketchup","key","kick","kid","kidney","kind","kingdom","kiss","kit","kitchen","kite","kitten","kiwi","knee","knife","knock","know","lab","label","labor","ladder","lady","lake","lamp","language","laptop","large","later","latin","laugh","laundry","lava","law","lawn","lawsuit","layer","lazy","leader","leaf","learn","leave","lecture","left","leg","legal","legend","leisure","lemon","lend","length","lens","leopard","lesson","letter","level","liar","liberty","library","license","life","lift","light","like","limb","limit","link","lion","liquid","list","little","live","lizard","load","loan","lobster","local","lock","logic","lonely","long","loop","lottery","loud","lounge","love","loyal","lucky","luggage","lumber","lunar","lunch","luxury","lyrics","machine","mad","magic","magnet","maid","mail","main","major","make","mammal","man","manage","mandate","mango","mansion","manual","maple","marble","march","margin","marine","market","marriage","mask","mass","master","match","material","math","matrix","matter","maximum","maze","meadow","mean","measure","meat","mechanic","medal","media","melody","melt","member","memory","mention","menu","mercy","merge","merit","merry","mesh","message","metal","method","middle","midnight","milk","million","mimic","mind","minimum","minor","minute","miracle","mirror","misery","miss","mistake","mix","mixed","mixture","mobile","model","modify","mom","moment","monitor","monkey","monster","month","moon","moral","more","morning","mosquito","mother","motion","motor","mountain","mouse","move","movie","much","muffin","mule","multiply","muscle","museum","mushroom","music","must","mutual","myself","mystery","myth","naive","name","napkin","narrow","nasty","nation","nature","near","neck","need","negative","neglect","neither","nephew","nerve","nest","net","network","neutral","never","news","next","nice","night","noble","noise","nominee","noodle","normal","north","nose","notable","note","nothing","notice","novel","now","nuclear","number","nurse","nut","oak","obey","object","oblige","obscure","observe","obtain","obvious","occur","ocean","october","odor","off","offer","office","often","oil","okay","old","olive","olympic","omit","once","one","onion","online","only","open","opera","opinion","oppose","option","orange","orbit","orchard","order","ordinary","organ","orient","original","orphan","ostrich","other","outdoor","outer","output","outside","oval","oven","over","own","owner","oxygen","oyster","ozone","pact","paddle","page","pair","palace","palm","panda","panel","panic","panther","paper","parade","parent","park","parrot","party","pass","patch","path","patient","patrol","pattern","pause","pave","payment","peace","peanut","pear","peasant","pelican","pen","penalty","pencil","people","pepper","perfect","permit","person","pet","phone","photo","phrase","physical","piano","picnic","picture","piece","pig","pigeon","pill","pilot","pink","pioneer","pipe","pistol","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","plunge","poem","poet","point","polar","pole","police","pond","pony","pool","popular","portion","position","possible","post","potato","pottery","poverty","powder","power","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","prison","private","prize","problem","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pull","pulp","pulse","pumpkin","punch","pupil","puppy","purchase","purity","purpose","purse","push","put","puzzle","pyramid","quality","quantum","quarter","question","quick","quit","quiz","quote","rabbit","raccoon","race","rack","radar","radio","rail","rain","raise","rally","ramp","ranch","random","range","rapid","rare","rate","rather","raven","raw","razor","ready","real","reason","rebel","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","refuse","region","regret","regular","reject","relax","release","relief","rely","remain","remember","remind","remove","render","renew","rent","reopen","repair","repeat","replace","report","require","rescue","resemble","resist","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","rib","ribbon","rice","rich","ride","ridge","rifle","right","rigid","ring","riot","ripple","risk","ritual","rival","river","road","roast","robot","robust","rocket","romance","roof","rookie","room","rose","rotate","rough","round","route","royal","rubber","rude","rug","rule","run","runway","rural","sad","saddle","sadness","safe","sail","salad","salmon","salon","salt","salute","same","sample","sand","satisfy","satoshi","sauce","sausage","save","say","scale","scan","scare","scatter","scene","scheme","school","science","scissors","scorpion","scout","scrap","screen","script","scrub","sea","search","season","seat","second","secret","section","security","seed","seek","segment","select","sell","seminar","senior","sense","sentence","series","service","session","settle","setup","seven","shadow","shaft","shallow","share","shed","shell","sheriff","shield","shift","shine","ship","shiver","shock","shoe","shoot","shop","short","shoulder","shove","shrimp","shrug","shuffle","shy","sibling","sick","side","siege","sight","sign","silent","silk","silly","silver","similar","simple","since","sing","siren","sister","situate","six","size","skate","sketch","ski","skill","skin","skirt","skull","slab","slam","sleep","slender","slice","slide","slight","slim","slogan","slot","slow","slush","small","smart","smile","smoke","smooth","snack","snake","snap","sniff","snow","soap","soccer","social","sock","soda","soft","solar","soldier","solid","solution","solve","someone","song","soon","sorry","sort","soul","sound","soup","source","south","space","spare","spatial","spawn","speak","special","speed","spell","spend","sphere","spice","spider","spike","spin","spirit","split","spoil","sponsor","spoon","sport","spot","spray","spread","spring","spy","square","squeeze","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","steel","stem","step","stereo","stick","still","sting","stock","stomach","stone","stool","story","stove","strategy","street","strike","strong","struggle","student","stuff","stumble","style","subject","submit","subway","success","such","sudden","suffer","sugar","suggest","suit","summer","sun","sunny","sunset","super","supply","supreme","sure","surface","surge","surprise","surround","survey","suspect","sustain","swallow","swamp","swap","swarm","swear","sweet","swift","swim","swing","switch","sword","symbol","symptom","syrup","system","table","tackle","tag","tail","talent","talk","tank","tape","target","task","taste","tattoo","taxi","teach","team","tell","ten","tenant","tennis","tent","term","test","text","thank","that","theme","then","theory","there","they","thing","this","thought","three","thrive","throw","thumb","thunder","ticket","tide","tiger","tilt","timber","time","tiny","tip","tired","tissue","title","toast","tobacco","today","toddler","toe","together","toilet","token","tomato","tomorrow","tone","tongue","tonight","tool","tooth","top","topic","topple","torch","tornado","tortoise","toss","total","tourist","toward","tower","town","toy","track","trade","traffic","tragic","train","transfer","trap","trash","travel","tray","treat","tree","trend","trial","tribe","trick","trigger","trim","trip","trophy","trouble","truck","true","truly","trumpet","trust","truth","try","tube","tuition","tumble","tuna","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","two","type","typical","ugly","umbrella","unable","unaware","uncle","uncover","under","undo","unfair","unfold","unhappy","uniform","unique","unit","universe","unknown","unlock","until","unusual","unveil","update","upgrade","uphold","upon","upper","upset","urban","urge","usage","use","used","useful","useless","usual","utility","vacant","vacuum","vague","valid","valley","valve","van","vanish","vapor","various","vast","vault","vehicle","velvet","vendor","venture","venue","verb","verify","version","very","vessel","veteran","viable","vibrant","vicious","victory","video","view","village","vintage","violin","virtual","virus","visa","visit","visual","vital","vivid","vocal","voice","void","volcano","volume","vote","voyage","wage","wagon","wait","walk","wall","walnut","want","warfare","warm","warrior","wash","wasp","waste","water","wave","way","wealth","weapon","wear","weasel","weather","web","wedding","weekend","weird","welcome","west","wet","whale","what","wheat","wheel","when","where","whip","whisper","wide","width","wife","wild","will","win","window","wine","wing","wink","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wood","wool","word","work","world","worry","worth","wrap","wreck","wrestle","wrist","write","wrong","yard","year","yellow","you","young","youth","zebra","zero","zone","zoo"];

// ── BIP39 ─────────────────────────────────────────────────────────────────────

async function generateMnemonic() {
  var entropy = crypto.getRandomValues(new Uint8Array(32))  // 256 bits → 24 words

  var hash = new Uint8Array(await crypto.subtle.digest('SHA-256', entropy))

  // Build bit string: 256 entropy bits + 8 checksum bits
  var bits = []
  for (var i = 0; i < 32; i++) for (var b = 7; b >= 0; b--) bits.push((entropy[i] >> b) & 1)
  for (var b = 7; b >= 0; b--) bits.push((hash[0] >> b) & 1)

  // Map every 11 bits to a word
  var words = []
  for (var i = 0; i < 264; i += 11) {
    var idx = 0
    for (var j = 0; j < 11; j++) idx = (idx << 1) | bits[i + j]
    words.push(BIP39_WORDLIST[idx])
  }
  return words.join(' ')
}

async function validateMnemonic(mnemonic) {
  var words = mnemonic.trim().split(/\s+/)
  if (words.length !== 24) return false

  var indices = []
  for (var i = 0; i < words.length; i++) {
    var idx = BIP39_WORDLIST.indexOf(words[i])
    if (idx === -1) return false
    indices.push(idx)
  }

  // Reconstruct 264 bits
  var bits = []
  for (var i = 0; i < indices.length; i++)
    for (var b = 10; b >= 0; b--) bits.push((indices[i] >> b) & 1)

  // Reconstruct entropy bytes from first 256 bits
  var entropy = new Uint8Array(32)
  for (var i = 0; i < 32; i++) {
    var byte = 0
    for (var j = 0; j < 8; j++) byte = (byte << 1) | bits[i * 8 + j]
    entropy[i] = byte
  }

  // Verify checksum (last 8 bits must match first 8 bits of SHA-256(entropy))
  var hash = new Uint8Array(await crypto.subtle.digest('SHA-256', entropy))
  for (var i = 0; i < 8; i++) {
    if (bits[256 + i] !== ((hash[0] >> (7 - i)) & 1)) return false
  }
  return true
}

// ── BIP39 seed ────────────────────────────────────────────────────────────────

async function bip39Seed(mnemonic) {
  var enc = new TextEncoder()
  var keyMat = await crypto.subtle.importKey(
    'raw', enc.encode(mnemonic.normalize('NFKD')),
    'PBKDF2', false, ['deriveBits']
  )
  var bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode('mnemonic'), iterations: 2048, hash: 'SHA-512' },
    keyMat, 512
  )
  return new Uint8Array(bits)
}

// ── SLIP10 Ed25519 derivation ─────────────────────────────────────────────────

var HARDENED = 0x80000000

async function slip10Master(seed) {
  var keyMat = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode('ed25519 seed'),
    { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']
  )
  var I = new Uint8Array(await crypto.subtle.sign('HMAC', keyMat, seed))
  return { key: I.slice(0, 32), chain: I.slice(32) }
}

async function slip10Child(key, chain, index) {
  var data = new Uint8Array(37)
  data[0] = 0x00
  data.set(key, 1)
  new DataView(data.buffer).setUint32(33, index >>> 0, false)
  var keyMat = await crypto.subtle.importKey(
    'raw', chain,
    { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']
  )
  var I = new Uint8Array(await crypto.subtle.sign('HMAC', keyMat, data))
  return { key: I.slice(0, 32), chain: I.slice(32) }
}

async function slip10Derive(seed, path) {
  var node = await slip10Master(seed)
  for (var i = 0; i < path.length; i++)
    node = await slip10Child(node.key, node.chain, (path[i] | HARDENED) >>> 0)
  return node.key
}

// ── Base58 ────────────────────────────────────────────────────────────────────

var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function base58Encode(bytes) {
  var num = 0n
  for (var i = 0; i < bytes.length; i++) num = (num << 8n) | BigInt(bytes[i])
  var str = ''
  while (num > 0n) { str = BASE58[Number(num % 58n)] + str; num /= 58n }
  for (var i = 0; i < bytes.length && bytes[i] === 0; i++) str = '1' + str
  return str
}

// ── Keypair derivation ────────────────────────────────────────────────────────

async function deriveKeypair(mnemonic) {
  var seed    = await bip39Seed(mnemonic.trim())
  var privKey = await slip10Derive(seed, [44, 118, 0, 0, 0])

  // nacl (tweetnacl) computes the Ed25519 public key from the 32-byte seed
  var pair    = nacl.sign.keyPair.fromSeed(privKey)
  var pubKey  = pair.publicKey
  var address = base58Encode(pubKey)

  var signingKey = await crypto.subtle.importKey(
    'jwk',
    { kty: 'OKP', crv: 'Ed25519', d: b64urlEncode(privKey), x: b64urlEncode(pubKey), key_ops: ['sign'], ext: false },
    'Ed25519', false, ['sign']
  )

  var bech32Address = await toBech32(pubKey)
  return { mnemonic: mnemonic.trim(), privKey: privKey, pubKey: pubKey, address: address, bech32Address: bech32Address, signingKey: signingKey }
}

// ── Crypto helpers ────────────────────────────────────────────────────────────

function toHex(buf) {
  return Array.from(new Uint8Array(buf)).map(function(b) { return b.toString(16).padStart(2, '0') }).join('')
}

function b64urlEncode(bytes) {
  return btoa(String.fromCharCode.apply(null, bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function signNonce(signingKey, nonce) {
  var sig = await crypto.subtle.sign('Ed25519', signingKey, new TextEncoder().encode(nonce))
  return toHex(sig)
}

// ── Chain node config ─────────────────────────────────────────────────────────
// REST/gRPC-gateway endpoint of the running mehrd node.
// Override by setting window.MEHR_NODE_URL before loading this script.
var NODE_URL = (window.MEHR_NODE_URL || 'https://edge-3.mehrfunds.com:2083').replace(/\/$/, '')
var CHAIN_ID = window.MEHR_CHAIN_ID || 'mehr-1'

// ── Bech32 (inline) ───────────────────────────────────────────────────────────

var _B32 = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

function _b32Polymod(v) {
  var G = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]
  var c = 1
  for (var i = 0; i < v.length; i++) {
    var b = c >> 25
    c = ((c & 0x1ffffff) << 5) ^ v[i]
    for (var j = 0; j < 5; j++) if ((b >> j) & 1) c ^= G[j]
  }
  return c
}

function _b32HrpExpand(hrp) {
  var r = []
  for (var i = 0; i < hrp.length; i++) r.push(hrp.charCodeAt(i) >> 5)
  r.push(0)
  for (var i = 0; i < hrp.length; i++) r.push(hrp.charCodeAt(i) & 31)
  return r
}

function _b32Checksum(hrp, data) {
  var pm = _b32Polymod(_b32HrpExpand(hrp).concat(data).concat([0,0,0,0,0,0])) ^ 1
  var r = []
  for (var i = 0; i < 6; i++) r.push((pm >> 5 * (5 - i)) & 31)
  return r
}

function bech32Encode(hrp, data5) {
  var out = data5.concat(_b32Checksum(hrp, data5))
  return hrp + '1' + out.map(function(d) { return _B32[d] }).join('')
}

function convertBits(data, from, to, pad) {
  var acc = 0, bits = 0, ret = [], maxv = (1 << to) - 1
  for (var i = 0; i < data.length; i++) {
    acc = (acc << from) | data[i]; bits += from
    while (bits >= to) { bits -= to; ret.push((acc >> bits) & maxv) }
  }
  if (pad && bits > 0) ret.push((acc << (to - bits)) & maxv)
  return ret
}

// Cosmos SDK Ed25519 address = bech32("mehr", SHA-256(pubKey)[:20] as 5-bit groups)
async function toBech32(pubKey) {
  var hash = new Uint8Array(await crypto.subtle.digest('SHA-256', pubKey))
  return bech32Encode('mehr', convertBits(Array.from(hash.slice(0, 20)), 8, 5, true))
}

// ── Protobuf encoding (minimal, inline) ───────────────────────────────────────

function _pbVarint(n) {
  var out = [], v = BigInt(Math.round(Number(n)))
  while (v > 127n) { out.push(Number((v & 0x7fn) | 0x80n)); v >>= 7n }
  out.push(Number(v)); return out
}
function _pbTag(num, wt) { return _pbVarint((num << 3) | wt) }
function _pbLenDelim(num, bytes) {
  return _pbTag(num, 2).concat(_pbVarint(bytes.length)).concat(Array.from(bytes))
}
function _pbStr(num, s) { return _pbLenDelim(num, Array.from(new TextEncoder().encode(s))) }
function _pbU64(num, n)  { return _pbTag(num, 0).concat(_pbVarint(n)) }
function _pb(parts)       { return new Uint8Array([].concat.apply([], parts)) }

function _pbAny(typeUrl, value) {
  return _pb([_pbStr(1, typeUrl), _pbLenDelim(2, value)])
}

// MsgCreateWatch / MsgDeleteWatch / MsgCreateWebhook / MsgDeleteWebhook
function pbMsgCreateWatch(creator, network, address, label) {
  return _pb([_pbStr(1, creator), _pbStr(2, network), _pbStr(3, address), label ? _pbStr(4, label) : []])
}
function pbMsgDeleteWatch(creator, watchId) {
  return _pb([_pbStr(1, creator), _pbU64(2, watchId)])
}
function pbMsgCreateWebhook(creator, url, secretHash) {
  return _pb([_pbStr(1, creator), _pbStr(2, url), _pbStr(3, secretHash)])
}
function pbMsgDeleteWebhook(creator, webhookId) {
  return _pb([_pbStr(1, creator), _pbU64(2, webhookId)])
}

// Transaction building
function _pbTxBody(typeUrl, msgBytes) {
  return _pb([_pbLenDelim(1, _pbAny(typeUrl, msgBytes))])
}
function _pbPubKey(pubKeyBytes) {
  return _pbAny('/cosmos.crypto.ed25519.PubKey', _pb([_pbLenDelim(1, pubKeyBytes)]))
}
function _pbAuthInfo(pubKeyBytes, sequence, gasLimit, feeAmount) {
  var signerInfo = _pb([
    _pbLenDelim(1, _pbPubKey(pubKeyBytes)),   // public_key
    _pbLenDelim(2, _pb([_pbLenDelim(1, _pb([_pbU64(1, 1)]))])), // mode_info.single.SIGN_MODE_DIRECT
    _pbU64(3, sequence),                       // sequence
  ])
  var coin = _pb([_pbStr(1, 'umehr'), _pbStr(2, feeAmount.toString())])
  var fee  = _pb([_pbLenDelim(1, coin), _pbU64(2, gasLimit)])
  return _pb([_pbLenDelim(1, signerInfo), _pbLenDelim(2, fee)])
}
function _pbSignDoc(bodyBytes, authInfoBytes, chainId, accountNumber, sequence) {
  return _pb([
    _pbLenDelim(1, bodyBytes), _pbLenDelim(2, authInfoBytes),
    _pbStr(3, chainId), _pbU64(4, accountNumber), _pbU64(5, sequence),
  ])
}
function _pbTxRaw(bodyBytes, authInfoBytes, sig) {
  return _pb([_pbLenDelim(1, bodyBytes), _pbLenDelim(2, authInfoBytes), _pbLenDelim(3, sig)])
}

// ── Chain API helpers ─────────────────────────────────────────────────────────

async function nodeReachable() {
  try {
    var r = await fetch(NODE_URL + '/cosmos/base/tendermint/v1beta1/syncing', { signal: AbortSignal.timeout(2000) })
    return r.ok
  } catch { return false }
}

async function getAccountInfo(bech32) {
  var r = await fetch(NODE_URL + '/cosmos/auth/v1beta1/accounts/' + bech32, { signal: AbortSignal.timeout(5000) })
  if (!r.ok) throw new Error('Account not found on chain. Send some MEHR to this address first.')
  var d = await r.json()
  var a = d.account
  return { accountNumber: parseInt(a.account_number || '0'), sequence: parseInt(a.sequence || '0') }
}

async function broadcastTx(kp, typeUrl, msgBytes) {
  var info        = await getAccountInfo(kp.bech32Address)
  var bodyBytes   = _pbTxBody(typeUrl, msgBytes)
  var authBytes   = _pbAuthInfo(kp.pubKey, info.sequence, 200000, 2000)
  var signDoc     = _pbSignDoc(bodyBytes, authBytes, CHAIN_ID, info.accountNumber, info.sequence)
  var sig         = new Uint8Array(await crypto.subtle.sign('Ed25519', kp.signingKey, signDoc))
  var txRaw       = _pbTxRaw(bodyBytes, authBytes, sig)
  var b64         = btoa(String.fromCharCode.apply(null, txRaw))

  var r = await fetch(NODE_URL + '/cosmos/tx/v1beta1/txs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tx_bytes: b64, mode: 'BROADCAST_MODE_SYNC' }),
    signal: AbortSignal.timeout(15000),
  })
  var d = await r.json()
  if (d.tx_response && d.tx_response.code !== 0) throw new Error(d.tx_response.raw_log || 'Transaction failed')
  return d
}

// ── Zone directory ────────────────────────────────────────────────────────────

var ZONE_DIRECTORY = {
  account: [
    { id: 0, name: 'accounts-0 · eu-west',  url: 'https://accounts-0.mehrfunds.com' },
    { id: 1, name: 'accounts-1 · us-east',  url: 'https://accounts-1.mehrfunds.com' },
    { id: 2, name: 'accounts-2 · ap-south', url: 'https://accounts-2.mehrfunds.com' },
  ],
  watch: [
    { id: 0, name: 'watch-0 · eu-west', url: 'https://watch-0.mehrfunds.com' },
    { id: 1, name: 'watch-1 · us-east', url: 'https://watch-1.mehrfunds.com' },
  ],
  webhook: [
    { id: 0, name: 'hooks-0 · eu-west', url: 'https://hooks-0.mehrfunds.com' },
  ],
}

var ALL_ZONES = Object.entries(ZONE_DIRECTORY).flatMap(function(_ref) {
  var type = _ref[0], zones = _ref[1]
  return zones.map(function(z) { return Object.assign({}, z, { type: type }) })
})

// ── Zone health ───────────────────────────────────────────────────────────────

var zoneHealth = new Map(
  ALL_ZONES.map(function(z) { return [`${z.type}:${z.id}`, { status: 'pending', ms: null, meta: null }] })
)

async function pingZone(zone) {
  var key = `${zone.type}:${zone.id}`
  var t   = performance.now()
  try {
    var res  = await fetch(`${zone.url}/health`, { signal: AbortSignal.timeout(3000), cache: 'no-store' })
    var ms   = Math.round(performance.now() - t)
    var meta = await res.json().catch(function() { return null })
    zoneHealth.set(key, { status: !res.ok ? 'offline' : ms > 1500 ? 'slow' : 'online', ms: ms, meta: meta })
  } catch {
    zoneHealth.set(key, { status: 'offline', ms: null, meta: null })
  }
}

// ── Zone selection ────────────────────────────────────────────────────────────

function rankedZones(type) {
  var rank = function(s) { return s === 'online' ? 0 : s === 'slow' ? 1 : 9 }
  return ZONE_DIRECTORY[type]
    .map(function(z) { return Object.assign({}, z, zoneHealth.get(`${type}:${z.id}`)) })
    .sort(function(a, b) {
      var dr = rank(a.status) - rank(b.status)
      return dr !== 0 ? dr : (a.ms != null ? a.ms : Infinity) - (b.ms != null ? b.ms : Infinity)
    })
}

async function tryZoneType(type, path, opts, preferZoneId) {
  opts = opts || {}
  var ordered = rankedZones(type).filter(function(z) { return z.status !== 'offline' })
  if (!ordered.length) ordered = rankedZones(type)

  if (preferZoneId != null) {
    var idx = ordered.findIndex(function(z) { return z.id === preferZoneId })
    if (idx > 0) ordered = [ordered[idx]].concat(ordered.filter(function(_, i) { return i !== idx }))
  }

  var errors = []
  for (var i = 0; i < ordered.length; i++) {
    var zone = ordered[i]
    try {
      var res = await fetch(`${zone.url}${path}`, Object.assign(
        { signal: AbortSignal.timeout(8000) },
        opts,
        { headers: Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {}) }
      ))
      return { zone: zone, res: res }
    } catch (e) {
      errors.push(`${zone.name}: ${e.message}`)
    }
  }
  throw new Error(`All ${type} zones unreachable.\n${errors.join('\n')}`)
}

// ── Zone affinity cache ───────────────────────────────────────────────────────

var AFFINITY_KEY = 'mf_affinity'

function affinityGet(type, id) {
  try {
    var store = JSON.parse(localStorage.getItem(AFFINITY_KEY) || '{}')
    if (id != null && store[`${type}:${id}`] != null) return store[`${type}:${id}`]
    return store[`${type}:*`] != null ? store[`${type}:*`] : null
  } catch { return null }
}

function affinitySet(type, id, zoneId) {
  try {
    var store = JSON.parse(localStorage.getItem(AFFINITY_KEY) || '{}')
    if (id != null) store[`${type}:${id}`] = zoneId
    store[`${type}:*`] = zoneId
    localStorage.setItem(AFFINITY_KEY, JSON.stringify(store))
  } catch {}
}

function affinityClearSession() {
  try {
    var store = JSON.parse(localStorage.getItem(AFFINITY_KEY) || '{}')
    Object.keys(store).filter(function(k) { return k.endsWith(':*') }).forEach(function(k) { delete store[k] })
    localStorage.setItem(AFFINITY_KEY, JSON.stringify(store))
  } catch {}
}

// ── Session ───────────────────────────────────────────────────────────────────

var SESSION_KEY = 'mf_s'

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

var _activeKey = null

// ── Proof of Work ─────────────────────────────────────────────────────────────

var POW_WORKER_SRC = `
  function hasLeadingZeroBits(hash, bits) {
    var fullBytes = Math.floor(bits / 8)
    for (var i = 0; i < fullBytes; i++) { if (hash[i] !== 0) return false }
    var rem = bits % 8
    if (rem > 0) { var mask = (0xff << (8 - rem)) & 0xff; if ((hash[fullBytes] & mask) !== 0) return false }
    return true
  }
  var enc = new TextEncoder()
  self.onmessage = async function(e) {
    var prefix = e.data.prefix, difficulty = e.data.difficulty
    var nonce = 0
    while (true) {
      var buf  = enc.encode(prefix + ':' + nonce)
      var hash = new Uint8Array(await crypto.subtle.digest('SHA-256', buf))
      if (hasLeadingZeroBits(hash, difficulty)) {
        var hex = Array.from(hash).map(function(b) { return b.toString(16).padStart(2, '0') }).join('')
        self.postMessage({ nonce: nonce, hash: hex }); return
      }
      nonce++
    }
  }
`

function solvePoW(prefix, difficulty) {
  return new Promise(function(resolve, reject) {
    var blob   = new Blob([POW_WORKER_SRC], { type: 'application/javascript' })
    var url    = URL.createObjectURL(blob)
    var worker = new Worker(url)
    worker.onmessage = function(e) { worker.terminate(); URL.revokeObjectURL(url); resolve(e.data) }
    worker.onerror   = function(e) { worker.terminate(); URL.revokeObjectURL(url); reject(new Error('PoW failed: ' + e.message)) }
    worker.postMessage({ prefix: prefix, difficulty: difficulty })
  })
}

// ── Account API ───────────────────────────────────────────────────────────────

async function createAccount(kp, pow) {
  var pubKeyHex = toHex(kp.pubKey)
  var result = await tryZoneType('account', '/v1/accounts', {
    method: 'POST',
    body: JSON.stringify({ public_key: pubKeyHex, account_id: kp.address, pow_prefix: pow.prefix, pow_nonce: pow.nonce }),
  })
  if (!result.res.ok) {
    var err = await result.res.json().catch(function() { return {} })
    throw new Error(err.message || `Registration failed (${result.res.status})`)
  }
  var data = await result.res.json()
  affinitySet('account', kp.address, result.zone.id)
  _activeKey = kp
  sessionSave({ token: data.token, address: kp.address, bech32_address: kp.bech32Address, pub_key: pubKeyHex, account_zone_id: result.zone.id, account_zone_name: result.zone.name })
}

async function authenticateWithKey(kp) {
  var pubKeyHex = toHex(kp.pubKey)
  var preferred = affinityGet('account', kp.address)

  var chalResult = await tryZoneType('account', '/v1/auth/challenge', {
    method: 'POST',
    body: JSON.stringify({ public_key: pubKeyHex }),
  }, preferred)
  if (!chalResult.res.ok) {
    var err = await chalResult.res.json().catch(function() { return {} })
    throw new Error(err.message || `Account not found (${chalResult.res.status})`)
  }
  var chal = await chalResult.res.json()

  var results = await Promise.all([
    signNonce(kp.signingKey, chal.nonce),
    solvePoW(chal.pow_prefix, chal.difficulty),
  ])
  var signature = results[0], pow = results[1]

  var verifyResult = await tryZoneType('account', '/v1/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ public_key: pubKeyHex, nonce: chal.nonce, signature: signature, pow_prefix: chal.pow_prefix, pow_nonce: pow.nonce }),
  }, chalResult.zone.id)
  if (!verifyResult.res.ok) {
    var err = await verifyResult.res.json().catch(function() { return {} })
    throw new Error(err.message || `Authentication failed (${verifyResult.res.status})`)
  }
  var data = await verifyResult.res.json()
  affinitySet('account', kp.address, chalResult.zone.id)
  _activeKey = kp
  sessionSave({ token: data.token, address: kp.address, bech32_address: kp.bech32Address, pub_key: pubKeyHex, account_zone_id: chalResult.zone.id, account_zone_name: chalResult.zone.name })
}

// ── Views ─────────────────────────────────────────────────────────────────────

function showLanding() {
  el('view-auth').style.display = ''
  el('view-dash').style.display = 'none'
  resetGenFlow()
}

function showDashboard() {
  el('view-auth').style.display = 'none'
  el('view-dash').style.display = ''
  var s = session()
  setText('kpi-address',     s.address || '—')
  setText('kpi-zone',        s.account_zone_name || '—')
  setText('dash-zone-badge', s.account_zone_name || '—')
  switchDashView('overview')
}

function switchDashView(name) {
  ['overview', 'accounts', 'watches', 'webhooks', 'keys'].forEach(function(v) {
    el(`dash-view-${v}`).classList.toggle('hidden', v !== name)
  })
  qsa('.snav-item').forEach(function(a) { a.classList.toggle('active', a.dataset.view === name) })
  if (name === 'watches')  { closeWatchForm();   loadWatches() }
  if (name === 'webhooks') { closeWebhookForm(); loadWebhooks() }
}

// ── Tab switching ─────────────────────────────────────────────────────────────

function switchTab(tab) {
  qsa('.tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tab) })
  el('tab-generate').classList.toggle('hidden', tab !== 'generate')
  el('tab-import').classList.toggle('hidden',   tab !== 'import')
  clearErrors()
}

function clearErrors() {
  ['gen-err', 'import-err'].forEach(function(id) {
    var e = el(id); if (e) { e.classList.add('hidden'); e.textContent = '' }
  })
}

function showError(id, msg) {
  var e = el(id); if (!e) return
  e.textContent = msg
  e.classList.remove('hidden')
}

function setPowStatus(id, msg) {
  var e = el(id); if (!e) return
  if (msg) { e.textContent = msg; e.classList.remove('hidden') }
  else      { e.classList.add('hidden'); e.textContent = '' }
}

// ── Generate flow ─────────────────────────────────────────────────────────────

var _pendingKeypair = null
var _pendingPow     = null

function resetGenFlow() {
  _pendingKeypair = null
  _pendingPow     = null
  el('gen-intro').classList.remove('hidden')
  el('gen-show').classList.add('hidden')
  el('key-saved').checked           = false
  el('btn-create-account').disabled = true
  el('mnemonic-grid').innerHTML     = ''
  el('address-box').textContent     = ''
  setPowStatus('gen-pow-status', null)
  clearErrors()
}

function renderMnemonicGrid(words) {
  el('mnemonic-grid').innerHTML = words.map(function(word, i) {
    return `<div class="mnemonic-word"><span class="word-num">${i + 1}.</span><span class="word-text">${word}</span></div>`
  }).join('')
}

async function onGenerateKey() {
  var btn = el('btn-gen-key')
  btn.disabled    = true
  btn.textContent = 'Generating…'
  try {
    var mnemonic    = await generateMnemonic()
    _pendingKeypair = await deriveKeypair(mnemonic)

    renderMnemonicGrid(mnemonic.split(' '))
    el('address-box').textContent = _pendingKeypair.address
    el('gen-intro').classList.add('hidden')
    el('gen-show').classList.remove('hidden')

    _pendingPow = (async function() {
      setPowStatus('gen-pow-status', 'Preparing proof of work…')
      var result = await tryZoneType('account', '/v1/auth/pow-challenge', { method: 'POST' })
      if (!result.res.ok) throw new Error('Could not get PoW challenge')
      var data = await result.res.json()
      setPowStatus('gen-pow-status', 'Solving proof of work…')
      var pow = await solvePoW(data.prefix, data.difficulty)
      pow.prefix = data.prefix
      setPowStatus('gen-pow-status', null)
      return pow
    })()
    _pendingPow.catch(function() {})
  } catch (err) {
    btn.disabled    = false
    btn.textContent = 'Generate account'
    showError('gen-err', err.message)
  }
}

async function onCreateAccount() {
  if (!_pendingKeypair || !_pendingPow) return
  var btn = el('btn-create-account')
  btn.disabled    = true
  btn.textContent = 'Working…'
  try {
    setPowStatus('gen-pow-status', 'Finishing proof of work…')
    var pow = await _pendingPow
    setPowStatus('gen-pow-status', null)
    btn.textContent = 'Creating account…'
    await createAccount(_pendingKeypair, pow)
    showDashboard()
  } catch (err) {
    btn.disabled    = false
    btn.textContent = 'Create account →'
    setPowStatus('gen-pow-status', null)
    showError('gen-err', err.message)
  }
}

function downloadPhrase(mnemonic) {
  var blob = new Blob([mnemonic], { type: 'text/plain' })
  var url  = URL.createObjectURL(blob)
  var a    = document.createElement('a')
  a.href = url; a.download = 'recovery-phrase.txt'; a.click()
  URL.revokeObjectURL(url)
}

// ── Import flow ───────────────────────────────────────────────────────────────

async function onImportKeys() {
  clearErrors()
  var btn = el('btn-sign-in')
  btn.disabled = true
  try {
    var phrase = el('import-phrase').value.trim()
    if (!phrase) { showError('import-err', 'Recovery phrase is required.'); return }

    var words = phrase.split(/\s+/).filter(Boolean)
    if (words.length !== 24) {
      showError('import-err', `Expected 24 words, got ${words.length}.`)
      return
    }
    var valid = await validateMnemonic(words.join(' '))
    if (!valid) {
      showError('import-err', 'Invalid recovery phrase — unrecognized words.')
      return
    }

    var kp = await deriveKeypair(words.join(' '))
    setPowStatus('import-pow-status', 'Solving proof of work…')
    await authenticateWithKey(kp)
    setPowStatus('import-pow-status', null)
    showDashboard()
  } catch (err) {
    setPowStatus('import-pow-status', null)
    showError('import-err', err.message)
  } finally {
    btn.disabled    = false
    btn.textContent = 'Sign in'
  }
}

// apiRequest wraps tryZoneType with the session bearer token attached.
async function apiRequest(type, path, opts) {
  opts = opts || {}
  var tok = session('token')
  var headers = Object.assign({}, opts.headers || {})
  if (tok) headers['Authorization'] = 'Bearer ' + tok
  return tryZoneType(type, path, Object.assign({}, opts, { headers: headers }), affinityGet(type, null))
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
      '<button class="btn ghost small" onclick="deleteWatch(\'' + w.id + '\')">Remove</button>' +
    '</div>'
  }).join('') + '</div>'
}

async function loadWatches() {
  var bech32 = _activeKey && _activeKey.bech32Address
  if (bech32 && await nodeReachable()) {
    try {
      var r = await fetch(NODE_URL + '/mehr/v1/watches/' + bech32, { signal: AbortSignal.timeout(5000) })
      if (r.ok) { var d = await r.json(); _watches = d.watches || []; renderWatches(); return }
    } catch {}
  }
  // Fallback: REST API zone
  try {
    var result = await apiRequest('account', '/v1/watches')
    if (result.res.ok) { var data = await result.res.json(); _watches = data.watches || [] }
  } catch {}
  renderWatches()
}

async function saveWatch() {
  var address = el('watch-address').value.trim()
  var network = el('watch-network').value
  var label   = el('watch-label').value.trim()

  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    showFormErr('watch-err', 'Invalid EVM address — must be 0x followed by 40 hex characters.')
    return
  }

  var btn = el('btn-save-watch')
  btn.disabled = true; btn.textContent = 'Adding…'
  try {
    if (_activeKey && await nodeReachable()) {
      var msg = pbMsgCreateWatch(_activeKey.bech32Address, network, address, label)
      await broadcastTx(_activeKey, '/mehr.v1.MsgCreateWatch', msg)
      closeWatchForm()
      await loadWatches()
      return
    }
    // Fallback: REST API
    var result = await apiRequest('account', '/v1/watches', {
      method: 'POST',
      body: JSON.stringify({ address: address, network: network, label: label }),
    })
    if (!result.res.ok) {
      var err = await result.res.json().catch(function() { return {} })
      showFormErr('watch-err', err.message || 'Failed to add watch.')
      return
    }
    var data = await result.res.json()
    _watches.push(data)
    closeWatchForm()
    renderWatches()
  } catch (e) {
    showFormErr('watch-err', e.message || 'Could not reach server.')
  } finally {
    btn.disabled = false; btn.textContent = 'Add watch →'
  }
}

async function deleteWatch(id) {
  try {
    if (_activeKey && await nodeReachable()) {
      var msg = pbMsgDeleteWatch(_activeKey.bech32Address, id)
      await broadcastTx(_activeKey, '/mehr.v1.MsgDeleteWatch', msg)
    } else {
      await apiRequest('account', '/v1/watches/' + id, { method: 'DELETE' })
    }
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

function generateWebhookSecret() {
  var bytes = crypto.getRandomValues(new Uint8Array(24))
  return 'whsec_' + b64urlEncode(bytes)
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
      '<button class="btn ghost small" onclick="deleteWebhook(\'' + w.id + '\')">Remove</button>' +
    '</div>'
  }).join('') + '</div>'
}

async function loadWebhooks() {
  var bech32 = _activeKey && _activeKey.bech32Address
  if (bech32 && await nodeReachable()) {
    try {
      var r = await fetch(NODE_URL + '/mehr/v1/webhooks/' + bech32, { signal: AbortSignal.timeout(5000) })
      if (r.ok) { var d = await r.json(); _webhooks = d.webhooks || []; renderWebhooks(); return }
    } catch {}
  }
  // Fallback: REST API zone
  try {
    var result = await apiRequest('account', '/v1/webhooks')
    if (result.res.ok) { var data = await result.res.json(); _webhooks = data.webhooks || [] }
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

  var btn = el('btn-save-webhook')
  btn.disabled = true; btn.textContent = 'Adding…'
  try {
    if (_activeKey && await nodeReachable()) {
      // Store a sha256 hash of the secret on-chain (secret itself stays in browser)
      var secretBytes  = new TextEncoder().encode(secret)
      var secretHashBuf = await crypto.subtle.digest('SHA-256', secretBytes)
      var secretHash   = toHex(secretHashBuf)
      var msg = pbMsgCreateWebhook(_activeKey.bech32Address, url, secretHash)
      await broadcastTx(_activeKey, '/mehr.v1.MsgCreateWebhook', msg)
      closeWebhookForm()
      await loadWebhooks()
      return
    }
    // Fallback: REST API
    var result = await apiRequest('account', '/v1/webhooks', {
      method: 'POST',
      body: JSON.stringify({ url: url, secret: secret }),
    })
    if (!result.res.ok) {
      var err = await result.res.json().catch(function() { return {} })
      showFormErr('webhook-err', err.message || 'Failed to add endpoint.')
      return
    }
    var data = await result.res.json()
    _webhooks.push(data)
    closeWebhookForm()
    renderWebhooks()
  } catch (e) {
    showFormErr('webhook-err', e.message || 'Could not reach server.')
  } finally {
    btn.disabled = false; btn.textContent = 'Add endpoint →'
  }
}

async function deleteWebhook(id) {
  try {
    if (_activeKey && await nodeReachable()) {
      var msg = pbMsgDeleteWebhook(_activeKey.bech32Address, id)
      await broadcastTx(_activeKey, '/mehr.v1.MsgDeleteWebhook', msg)
    } else {
      await apiRequest('account', '/v1/webhooks/' + id, { method: 'DELETE' })
    }
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
  el('webhook-url').value = ''
  el('webhook-secret').value = ''
  hideFormErr('webhook-err')
}

function showFormErr(id, msg) {
  var e = el(id); if (!e) return
  e.textContent = msg; e.classList.remove('hidden')
}
function hideFormErr(id) {
  var e = el(id); if (!e) return
  e.textContent = ''; e.classList.add('hidden')
}

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
  if (session('token')) showDashboard()
  else showLanding()
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function el(id)    { return document.getElementById(id) }
function qs(sel)   { return document.querySelector(sel) }
function qsa(sel)  { return document.querySelectorAll(sel) }
function setText(id, val) { var e = el(id); if (e) e.textContent = val }

// ── Events ────────────────────────────────────────────────────────────────────

function wireEvents() {
  qsa('.tab').forEach(function(t) { t.addEventListener('click', function() { switchTab(t.dataset.tab) }) })

  el('btn-logout').addEventListener('click', function() {
    _activeKey = null
    affinityClearSession()
    sessionClear()
    showLanding()
  })

  qsa('.snav-item').forEach(function(item) {
    item.addEventListener('click', function(e) { e.preventDefault(); switchDashView(item.dataset.view) })
  })

  el('btn-gen-key').addEventListener('click', onGenerateKey)

  el('btn-dl-phrase').addEventListener('click', function() {
    if (_pendingKeypair) downloadPhrase(_pendingKeypair.mnemonic)
  })

  el('btn-copy-addr').addEventListener('click', function() {
    if (!_pendingKeypair) return
    navigator.clipboard.writeText(_pendingKeypair.address).then(function() {
      var btn = el('btn-copy-addr')
      var orig = btn.textContent
      btn.textContent = 'Copied!'
      setTimeout(function() { btn.textContent = orig }, 1500)
    })
  })

  el('key-saved').addEventListener('change', function(e) {
    el('btn-create-account').disabled = !e.target.checked
  })

  el('btn-create-account').addEventListener('click', onCreateAccount)

  el('btn-sign-in').addEventListener('click', onImportKeys)

  // Watches
  el('btn-add-watch').addEventListener('click', openWatchForm)
  el('btn-cancel-watch').addEventListener('click', closeWatchForm)
  el('btn-save-watch').addEventListener('click', saveWatch)

  // Webhooks
  el('btn-add-webhook').addEventListener('click', openWebhookForm)
  el('btn-cancel-webhook').addEventListener('click', closeWebhookForm)
  el('btn-save-webhook').addEventListener('click', saveWebhook)
  el('btn-copy-secret').addEventListener('click', function() {
    var val = el('webhook-secret').value; if (!val) return
    navigator.clipboard.writeText(val).then(function() {
      var btn = el('btn-copy-secret')
      var orig = btn.textContent
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
