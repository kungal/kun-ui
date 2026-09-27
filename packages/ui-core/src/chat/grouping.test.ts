import { test } from 'node:test'
import assert from 'node:assert/strict'
import { groupKunChatMessages, kunChatDayKey, kunChatMessageKey } from './grouping.ts'
import type { KunChatMessage } from './types.ts'

let nextId = 1
const msg = (
  sender: string,
  created_at: string,
  extra: Partial<KunChatMessage> = {}
): KunChatMessage => {
  const id = nextId++
  return {
    id: String(id),
    conversation_id: '1',
    seq: id,
    sender_id: sender,
    kind: 'message',
    text: 'hi',
    entities: [],
    media: null,
    media_group_id: null,
    reply_to: null,
    reply_quote: null,
    service_action: null,
    context: null,
    reactions: [],
    silent: false,
    pinned_at: null,
    edited_at: null,
    created_at,
    ...extra,
  }
}

// One row per line: type + flags, so a failing test reads like the UI.
const outline = (messages: KunChatMessage[], options = {}) =>
  groupKunChatMessages(messages, { currentUserId: '1', timeZone: 'Asia/Shanghai', ...options }).map(
    (day) => [
      day.key,
      ...day.rows.map((r) =>
        r.type === 'message'
          ? `${r.own ? 'me' : r.message.sender_id}${r.groupStart ? ' start' : ''}${r.groupEnd ? ' end' : ''}${r.messages.length > 1 ? ` album×${r.messages.length}` : ''}`
          : r.type
      ),
    ]
  )

test('consecutive messages from one sender form one group', () => {
  assert.deepEqual(
    outline([
      msg('2', '2026-09-27T10:00:00+08:00'),
      msg('2', '2026-09-27T10:01:00+08:00'),
      msg('2', '2026-09-27T10:02:00+08:00'),
      msg('1', '2026-09-27T10:03:00+08:00'),
    ]),
    [['2026-09-27', '2 start', '2', '2 end', 'me start end']]
  )
})

test('a gap over the window, a service message and a new day break a group', () => {
  assert.deepEqual(
    outline([
      msg('2', '2026-09-27T10:00:00+08:00'),
      msg('2', '2026-09-27T10:11:00+08:00'),
      msg('2', '2026-09-27T10:12:00+08:00', {
        kind: 'service',
        service_action: { type: 'member_left' },
      }),
      msg('2', '2026-09-27T10:13:00+08:00'),
      msg('2', '2026-09-28T00:00:01+08:00'),
    ]),
    [
      ['2026-09-27', '2 start end', '2 start end', 'service', '2 start end'],
      ['2026-09-28', '2 start end'],
    ]
  )
})

test('the unread divider goes above the first later message from someone else', () => {
  assert.deepEqual(
    outline(
      [
        msg('2', '2026-09-27T10:00:00+08:00', { seq: 10 }),
        msg('1', '2026-09-27T10:01:00+08:00', { seq: 11 }),
        msg('2', '2026-09-27T10:02:00+08:00', { seq: 12 }),
        msg('2', '2026-09-27T10:03:00+08:00', { seq: 13 }),
      ],
      { lastReadSeq: 11 }
    ),
    [['2026-09-27', '2 start end', 'me start end', 'unread', '2 start', '2 end']]
  )
})

test('photos sharing a media_group_id become one album row', () => {
  const photo = { type: 'photo' as const, image_hash: 'h', width: 1, height: 1 }
  const rows = groupKunChatMessages(
    [
      msg('2', '2026-09-27T10:00:00+08:00', { media: photo, media_group_id: '7', text: '' }),
      msg('2', '2026-09-27T10:00:00+08:00', { media: photo, media_group_id: '7', text: 'caption' }),
      msg('2', '2026-09-27T10:00:00+08:00', { media: photo, media_group_id: '7', text: '' }),
      msg('2', '2026-09-27T10:00:01+08:00'),
    ],
    { currentUserId: '1' }
  )[0]!.rows
  assert.equal(rows.length, 2)
  const album = rows[0]!
  assert.ok(album.type === 'message')
  assert.equal(album.messages.length, 3)
  // the caption's message is the one the row acts as (reactions, replies)
  assert.equal(album.message.text, 'caption')
  assert.equal(album.groupStart, true)
})

test('a pending message keeps its key when the server confirms it', () => {
  const pending = msg('1', '2026-09-27T10:00:00+08:00', { client_message_id: 'u-1', status: 'sending' })
  const confirmed = { ...pending, id: '999', status: undefined }
  assert.equal(kunChatMessageKey(pending), kunChatMessageKey(confirmed))
  assert.notEqual(kunChatMessageKey(msg('2', 'x')), kunChatMessageKey(msg('2', 'x')))
})

test('days never go backwards', () => {
  assert.deepEqual(
    outline([
      msg('2', '2026-09-28T09:00:00+08:00'),
      msg('1', '2026-09-27T23:59:00+08:00', { status: 'sending' }),
    ]).map((d) => d[0]),
    ['2026-09-28']
  )
})

test('day keys follow the requested time zone', () => {
  const instant = new Date('2026-09-27T17:30:00Z')
  assert.equal(kunChatDayKey(instant, 'Asia/Shanghai'), '2026-09-28')
  assert.equal(kunChatDayKey(instant, 'America/Los_Angeles'), '2026-09-27')
})

test('an album holds at most KUN_CHAT_ALBUM_LIMIT photos', () => {
  const photo = { type: 'photo' as const, image_hash: 'h', width: 1, height: 1 }
  const rows = groupKunChatMessages(
    Array.from({ length: 12 }, () =>
      msg('2', '2026-09-27T10:00:00+08:00', { media: photo, media_group_id: '9', text: '' })
    ),
    { currentUserId: '1' }
  )[0]!.rows
  assert.deepEqual(
    rows.map((r) => (r.type === 'message' ? r.messages.length : 0)),
    [10, 2]
  )
})
