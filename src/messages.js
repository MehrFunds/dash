import _m0 from 'https://esm.sh/protobufjs@6.11.6/minimal'

// Minimal protobuf type definitions for mehr chain custom messages.
// Implements the GeneratedType interface expected by CosmJS Registry.
//
// Field tags = (field_number << 3) | wire_type
//   string → wire type 2 → 0x0a (1), 0x12 (2), 0x1a (3), 0x22 (4)
//   uint64 → wire type 0 → 0x10 (2)

export const MsgCreateWatch = {
  encode({ creator = '', network = '', address = '', label = '' }, writer = _m0.Writer.create()) {
    if (creator) writer.uint32(0x0a).string(creator)
    if (network) writer.uint32(0x12).string(network)
    if (address) writer.uint32(0x1a).string(address)
    if (label)   writer.uint32(0x22).string(label)
    return writer
  },
  decode() { return {} },
  fromPartial(o) { return { creator: o.creator ?? '', network: o.network ?? '', address: o.address ?? '', label: o.label ?? '' } },
}

export const MsgDeleteWatch = {
  encode({ creator = '', watchId = 0 }, writer = _m0.Writer.create()) {
    if (creator) writer.uint32(0x0a).string(creator)
    if (watchId) writer.uint32(0x10).uint64(watchId)
    return writer
  },
  decode() { return {} },
  fromPartial(o) { return { creator: o.creator ?? '', watchId: o.watchId ?? 0 } },
}

export const MsgCreateWebhook = {
  encode({ creator = '', url = '', secretHash = '' }, writer = _m0.Writer.create()) {
    if (creator)    writer.uint32(0x0a).string(creator)
    if (url)        writer.uint32(0x12).string(url)
    if (secretHash) writer.uint32(0x1a).string(secretHash)
    return writer
  },
  decode() { return {} },
  fromPartial(o) { return { creator: o.creator ?? '', url: o.url ?? '', secretHash: o.secretHash ?? '' } },
}

export const MsgDeleteWebhook = {
  encode({ creator = '', webhookId = 0 }, writer = _m0.Writer.create()) {
    if (creator)   writer.uint32(0x0a).string(creator)
    if (webhookId) writer.uint32(0x10).uint64(webhookId)
    return writer
  },
  decode() { return {} },
  fromPartial(o) { return { creator: o.creator ?? '', webhookId: o.webhookId ?? 0 } },
}
