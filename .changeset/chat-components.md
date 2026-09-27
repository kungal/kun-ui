---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

Chat components for the NextMoe private-chat service (`/v2/chat`), modelled on Telegram. Twelve new components take the API's JSON as it comes — snake_case fields and string ids included — so a site writes no conversion layer:

- `KunChatMessageList` — the scrollback. Consecutive messages from one sender run together (avatar and tail on the last), day pills stick to the top, and the list opens at the "unread messages" divider. Older pages load above you without moving the view, new messages stick to the bottom when you are there and count on the scroll-down button when you are not, and `scrollToSeq(seq)` jumps to a message and flashes it. Right-click or long-press opens the message menu, and swiping left on a touch screen replies. Thousands of messages scroll smoothly with no virtualisation library: rows off screen skip layout and paint (`content-visibility`). The scroller is `column-reverse`, so the server-rendered HTML already sits at the newest message, and history growing above the viewport never writes `scrollTop` — an iOS momentum fling through it is not cut short.
- `KunChatBubble` — one message: own (right, primary tint) or theirs; reply and partial-quote previews; a photo, or an album laid out with Telegram's mosaic (ported from Telegram Desktop via tweb); a cross-site context card; reactions; time, "edited" and delivery status (a failed message emits `retry`). A service message renders as a centred pill.
- `KunChatText` — text + entities: bold, italic, underline, strikethrough, spoiler (one click reveals them all), inline code, a code block with its language and a copy button, quotes, links and mentions. There is no `v-html`: every run of text is a text node, and a link only renders for `http`, `https` and `mailto`.
- `KunChatComposer` — the input. It grows with its content; Enter sends on a desktop and breaks the line on a touch screen. The composer shortcuts (`**bold**`, `||spoiler||`, ```` ``` ````…) are sent as entities. Reply, quote and edit bars are v-models, and editing puts the message back in the input and keeps the draft aside. Pasted or dropped photos are passed on as `attach(files)`, a counter shows near the 4096-character limit, and a throttled `typing` event fires while the user types.
- `KunChatConversationItem`, `KunChatHeader`, `KunChatPinnedBar`, `KunChatRequestBar`, `KunChatMessageMenu`, `KunChatReactionPicker`, `KunChatTyping` and `KunChatLayout` (two panes from `md` up, one at a time on a phone), plus the `useKunChatTyping` composable. Typing notifications expire on their own after 6 s, so a site only forwards what it receives.

`@kungal/ui-core` gains the wire types (`KunChatMessage`, `KunChatEntity`, `KunChatUser`, …) and the pure functions behind the components, for the Flutter port to reproduce: `normalizeKunChatEntities` / `buildKunChatEntityTree`, `parseKunChatMarkdown` / `formatKunChatMarkdown`, `layoutKunChatAlbum` and `groupKunChatMessages`. The two markdown functions are exact inverses — a message survives `parse(format(message))` — for everything the syntax can spell. The exceptions are listed on `formatKunChatMarkdown`: `url` entities, which the server detects again, and quotes that do not cover whole lines. Store a draft as the parsed `{ text, entities }` and restore it with `formatKunChatMarkdown`. These algorithms have the repository's first unit tests (`pnpm test`, `node:test` on the sources).

What it costs you:
- **Custom locales.** New locale namespaces (`chat`, `chatComposer`, `chatMenu`, `chatPinned`, `chatRequest`, `chatService`, `chatStatus`, `chatTyping`) ship in zh-CN and en. A locale you wrote yourself with `defineKunLocale` now fails to type-check until it has them.
- **Icons.** 21 more lucide icons are bundled (message status, actions, the composer).
- **Bundle size.** The components add about 23 kB gzip to `dist/index.js`, and they tree-shake away if you do not import them.
- **Server rendering.** When you render chat on the server, pass `time-zone`: dates are formatted in the runtime's zone otherwise, and the server's and the reader's disagree.

Photos need `resolve-media-url`: KunUI never builds an image URL from a hash. A chat avatar does not link to a profile — the chat ids are strings, while `KunUser.id` stays a number — so clicks come out as `user-click` for the site to route.
