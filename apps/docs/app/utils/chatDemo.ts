// Demo data for the KunChat* pages: the wire shapes of `/v2/chat`, filled
// with the kind of conversation the forum actually has. Images and reaction
// art are the real ones kungal.com serves.
//
// Times are fixed clock times, and every demo passes the same zone. The site
// is prerendered, so the server's "now" and the reader's differ: today and
// yesterday are counted back from now, because "今天 14:05" renders the same
// text on both; anything older is a fixed date in 2025, which renders with its
// year and so reads the same whenever it is viewed. A relative older date
// would turn into a different weekday or date and mismatch on hydration.
import {
  kunChatDayKey,
  parseKunChatMarkdown,
  type KunChatMessage,
  type KunChatReactionOption,
  type KunChatUser,
} from '@kungal/ui-core'
import { KUN_AVATAR_POOL } from './avatarPool'

export const DEMO_TZ = 'Asia/Shanghai'
export const ME = '1001'

export const demoUsers: KunChatUser[] = [
  { id: ME, name: '鲲', avatar: KUN_AVATAR_POOL[0]! },
  { id: '1002', name: '雪之下小春', avatar: KUN_AVATAR_POOL[5]! },
  { id: '1003', name: 'Ayase', avatar: KUN_AVATAR_POOL[9]! },
  { id: '1004', name: '樱小路露娜', avatar: KUN_AVATAR_POOL[14]! },
  { id: '1005', name: '', avatar: '', deleted: true },
]

// The forum's reaction vocabulary — `GET /v2/chat/reactions` serves the same
// keys and art.
const REACTIONS: [string, string, string][] = [
  ['heart', '❤️', '爱心'],
  ['fire', '🔥', '火'],
  ['party', '🎉', '庆祝'],
  ['love', '🥰', '喜欢'],
  ['clap', '👏', '鼓掌'],
  ['thinking', '🤔', '思考'],
  ['mindblown', '🤯', '震惊'],
  ['scream', '😱', '尖叫'],
  ['cry', '😢', '哭'],
  ['pray', '🙏', '感谢'],
  ['eyes', '👀', '关注'],
  ['hundred', '💯', '满分'],
  ['partyface', '🥳', '派对'],
  ['starstruck', '🤩', '星星眼'],
  ['angry', '😠', '生气'],
  ['anxious', '😰', '紧张'],
  ['banana', '🍌', '香蕉'],
  ['eyebrow', '🤨', '挑眉'],
  ['voltage', '⚡', '闪电'],
  ['hotdog', '🌭', '热狗'],
  ['hot', '🥵', '热'],
  ['sob', '😭', '大哭'],
  ['moai', '🗿', '摩艾'],
  ['newmoon', '🌚', '黑月亮'],
  ['police', '🚓', '警车'],
  ['pouting', '😡', '怒'],
  ['salute', '🫡', '敬礼'],
  ['shrimp', '🦐', '虾'],
  ['halo', '😇', '天使'],
  ['sunglasses', '😎', '酷'],
  ['whale', '🐳', '鲸鱼'],
]
export const demoReactions: KunChatReactionOption[] = REACTIONS.map(([key, emoji, label]) => ({
  key,
  emoji,
  label,
  image_url: `https://www.kungal.com/emoji/${key}.webp`,
}))

export const demoPhoto = (path: string, width: number, height: number) => ({
  type: 'photo' as const,
  image_hash: path,
  width,
  height,
  thumbhash: DEMO_THUMBHASH[path] ?? null,
  url: `https://www.kungal.com/${path}.webp`,
})

// Computed from the images themselves with thumbhash's rgbaToThumbHash, as
// the image service does on upload.
export const DEMO_THUMBHASH: Record<string, string> = {
  'bg/bg12': 'qPgFJIhQhKZHq4fKmJrXgIpkBQ==',
  'ren/2339': 'NCiCAwA1SJY59IhKQFeEBQqFiWaDipg=',
  'bg/bg25': 'b9eFK4YPvJfAW5yZgHkIZzc3h4dwiAg=',
  'bg/bg36': 'KBkGHIRS1Jtfm1SKaIqsq6BARw==',
  'bg/bg1': 'NdcFDISQspq+e3M3pptAbESQJg==',
  'bg/bg4': 'JpoKHIYOc2tmd3iUaIdmToBveA==',
  'ren/2337': '9BeCAgA2RqcJp5kbib+S9QiIenWUeYg=',
  'bg/bg45': 'bfcFJYg5rHbwiYqXVpaYigeSaGCJ',
}

/** An instant `daysAgo` days back at `hhmm`: today and yesterday relative to
 *  now, older days fixed in December 2025 (see the note on top). */
export const demoTime = (daysAgo: number, hhmm: string) => {
  const day =
    daysAgo < 2
      ? kunChatDayKey(new Date(Date.now() - daysAgo * 86_400_000), DEMO_TZ)
      : `2025-12-${String(Math.max(1, 31 - daysAgo)).padStart(2, '0')}`
  return `${day}T${hhmm}:00+08:00`
}

let seq = 0
/**
 * A message written in the composer syntax, parsed exactly as a send would
 * be, plus the `url` entities the server adds. `seq` and `id` count up.
 */
export const demoMessage = (
  sender: string,
  when: string,
  source: string,
  extra: Partial<KunChatMessage> = {}
): KunChatMessage => {
  seq += 1
  const { text, entities } = parseKunChatMarkdown(source)
  for (const match of text.matchAll(/https?:\/\/[^\s,，。]+/g)) {
    entities.push({ type: 'url', offset: match.index, length: match[0].length })
  }
  return {
    object: 'message',
    id: String(90000 + seq),
    conversation_id: '77',
    seq,
    sender_id: sender,
    kind: 'message',
    text,
    entities,
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
    created_at: when,
    client_message_id: sender === ME ? `demo-${seq}` : null,
    ...extra,
  }
}

/** What the server embeds as `reply_to` for a reply to `m`. */
export const demoReplyTo = (m: KunChatMessage) => ({
  seq: m.seq,
  sender_id: m.sender_id,
  text: m.text.slice(0, 120),
  entities: m.entities.filter((e) => e.offset + e.length <= 120),
  media_type: m.media?.type ?? null,
  deleted: false,
})

/** A direct conversation between 鲲 and 雪之下小春 over three days. */
export const makeDirectConversation = () => {
  seq = 0
  const her = '1002'
  const m: KunChatMessage[] = []
  const push = (msg: KunChatMessage) => (m.push(msg), msg)

  push(demoMessage(her, demoTime(2, '21:03'), '在吗在吗'))
  push(demoMessage(her, demoTime(2, '21:03'), '你之前说的那个补丁我装上了,但是一进游戏就乱码'))
  const tip = push(
    demoMessage(ME, demoTime(2, '21:07'), '十有八九是区域设置的问题。用 Locale Emulator 转区再开试试,或者直接这样启动:')
  )
  push(demoMessage(ME, demoTime(2, '21:08'), '```shell\nLANG=ja_JP.UTF-8 wine "Game.exe"\n```'))
  push(
    demoMessage(her, demoTime(2, '21:15'), '好了!!转区之后正常了', {
      reply_to: demoReplyTo(tip),
      reactions: [{ reaction: 'party', count: 1, reacted: true }],
    })
  )
  push(
    demoMessage(her, demoTime(2, '21:16'), '顺便问一下,这个补丁的汉化是完整的吗?moyu 上写的是 0.9 版', {
      context: {
        site: 'moyu',
        kind: 'patch',
        id: '3021',
        title: '《星空鉄道とシロの旅》汉化补丁 v0.9',
        url: 'https://www.moyu.moe/patch/3021/introduction',
      },
    })
  )
  push(demoMessage(ME, demoTime(2, '21:20'), '**主线是完整的**,只有两个番外还没翻。作者说下个月会补上'))

  push(demoMessage(her, demoTime(1, '10:32'), '通关了!!!给你看我最喜欢的几张 CG'))
  const album = '5001'
  push(demoMessage(her, demoTime(1, '10:33'), '', { media: demoPhoto('bg/bg12', 1920, 1080), media_group_id: album }))
  push(demoMessage(her, demoTime(1, '10:33'), '', { media: demoPhoto('ren/2339', 367, 602), media_group_id: album }))
  push(
    demoMessage(her, demoTime(1, '10:33'), '海边那段真的哭死我了', {
      media: demoPhoto('bg/bg25', 1920, 1239),
      media_group_id: album,
      reactions: [
        { reaction: 'cry', count: 1, reacted: true },
        { reaction: 'heart', count: 1, reacted: false },
      ],
    })
  )
  const spoiler = push(demoMessage(her, demoTime(1, '10:35'), '最后那个反转你猜到了吗?原来||列车长就是白本人||'))
  push(
    demoMessage(ME, demoTime(1, '10:41'), '猜到一半,第三章那封信就有暗示了', {
      reply_to: demoReplyTo(spoiler),
      reply_quote: { text: '列车长就是白本人', entities: [], offset: 14 },
    })
  )
  push(
    demoMessage(
      ME,
      demoTime(1, '10:42'),
      '推荐你接着玩同社的前作,世界观是连着的。论坛有人写过详细的考据:https://www.kungal.com/topic/1024',
      { edited_at: demoTime(1, '10:44') }
    )
  )
  push(demoMessage(ME, demoTime(1, '10:42'), '不过前作的__系统__有点老,存档记得~~一个位~~多开几个位'))

  push(demoMessage(her, demoTime(0, '09:12'), '早上好~'))
  push(
    demoMessage(her, demoTime(0, '09:13'), '昨天你说的前作我下好了,片头曲好好听', {
      media: demoPhoto('bg/bg36', 1920, 1080),
    })
  )
  push(demoMessage(her, demoTime(0, '09:14'), `对了,[@鲲](mention:${ME}) 周末的线下聚会你去吗?`))
  return m
}

/** A group with service messages and a pinned message. */
export const makeGroupConversation = () => {
  seq = 200
  const m: KunChatMessage[] = []
  const push = (msg: KunChatMessage) => (m.push(msg), msg)
  push(
    demoMessage(ME, demoTime(1, '19:00'), '', {
      kind: 'service',
      service_action: { type: 'group_created', title: 'Galgame 汉化交流' },
    })
  )
  push(
    demoMessage(ME, demoTime(1, '19:01'), '', {
      kind: 'service',
      service_action: { type: 'members_added', user_ids: ['1002', '1003', '1004'] },
    })
  )
  const rules = push(
    demoMessage(
      ME,
      demoTime(1, '19:02'),
      '欢迎各位!群规就两条:聊剧情请把关键内容用剧透遮起来,比如||凶手是管家||;求资源去论坛发帖。',
      { pinned_at: demoTime(1, '19:03') }
    )
  )
  push(
    demoMessage(ME, demoTime(1, '19:03'), '', {
      kind: 'service',
      service_action: { type: 'message_pinned', seq: rules.seq },
    })
  )
  push(demoMessage('1003', demoTime(1, '19:10'), '来了来了', { reactions: [{ reaction: 'salute', count: 2, reacted: true }] }))
  push(demoMessage('1003', demoTime(1, '19:10'), '先问个问题:这周的机翻组进度怎么样了'))
  push(demoMessage('1004', demoTime(1, '19:12'), '第二章校对完了,第三章还在润色'))
  const ask = push(demoMessage('1004', demoTime(1, '19:12'), '有兴趣帮忙校对的私聊我'))
  push(demoMessage('1002', demoTime(0, '08:40'), '我可以帮忙!日语 N2 水平够吗', { reply_to: demoReplyTo(ask) }))
  push(
    demoMessage('1004', demoTime(0, '08:45'), '够的,欢迎~', {
      reactions: [
        { reaction: 'heart', count: 3, reacted: false },
        { reaction: 'clap', count: 1, reacted: true },
      ],
    })
  )
  push(
    demoMessage('1004', demoTime(0, '08:47'), '', {
      kind: 'service',
      service_action: { type: 'title_changed', title: 'Galgame 汉化交流 · 校对组' },
    })
  )
  return m
}

const SMALL_TALK = [
  '今天的活动你抽到了吗',
  '还没,十连全是重复的 **五星**',
  '下周末有空一起去漫展吗?',
  '可以啊,几点集合',
  '上午十点地铁站 B 口',
  '好,我带上那本设定集',
  '昨天那集动画作画崩得有点厉害 ||最后一幕还是很感人||',
  '论坛那篇攻略写得太细了,连隐藏选项都标出来了',
  '`Ctrl` 键按住可以快进已读文本,记得在设置里打开',
  '这个补丁我试过了,Win11 下要装一下日文字体',
  '哈哈哈哈哈',
  '收到',
  '你先玩,我晚上回来继续',
  '存档记得多开几个位,这作的分支很多',
]
const PHOTOS: [string, number, number][] = [
  ['bg/bg1', 1920, 1080],
  ['bg/bg4', 1920, 1200],
  ['ren/2337', 290, 599],
  ['bg/bg45', 1920, 1268],
]

/** `count` messages of back-and-forth, oldest first, ending now. For the
 *  paging and the thousands-of-messages demos. */
export const makeHistory = (count: number, peer = '1002') => {
  seq = 0
  const out: KunChatMessage[] = []
  const minutes = (i: number) => (count - i) * 23
  for (let i = 0; i < count; i++) {
    const at = new Date(Date.now() - minutes(i) * 60_000).toISOString()
    const sender = i % 7 < 3 ? ME : peer
    const photo = i % 37 === 11 ? PHOTOS[i % PHOTOS.length]! : null
    out.push(
      demoMessage(sender, at, photo ? '' : SMALL_TALK[i % SMALL_TALK.length]!, {
        media: photo ? demoPhoto(...photo) : null,
        reactions: i % 13 === 5 ? [{ reaction: 'heart', count: 1 + (i % 3), reacted: i % 2 === 0 }] : [],
      })
    )
  }
  return out
}
