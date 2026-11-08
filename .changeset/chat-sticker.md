---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

Chat messages can carry a sticker (NextMoe chat spec 1.2.0). `KunChatMedia` is now `KunChatPhoto | KunChatSticker`, where `KunChatSticker` is `{ type: 'sticker', image_hash, width, height, thumbhash?, url? }`, the same fields as a photo under a different `type`. The server sends `url` as a 320 px variant, and `width` / `height` as the original image's size, so KunUI uses them only for the ratio. A sticker message never carries text, a `media_group_id`, a context card or an edit, because the server rejects all four. A legacy sticker imported with text or as part of an album arrives typed `photo` and renders as a photo. `KunChatSticker` and `KunChatMediaType` are exported from both packages.

How each component handles a sticker:

- **KunChatBubble** draws a sticker the way Telegram does. There is no bubble and no tail. The sticker's long side is 160 px, the other side follows its `width` / `height` ratio, and the image is never cropped. Its `thumbhash` shows while it loads. The time and delivery status sit on a small pill on the sticker's corner. Reactions go below the sticker. The sender name and the reply preview go on a small card of their own above it, and a context card goes on a card below it. Clicking a sticker does nothing: it does not open the lightbox and does not emit `photo-click`.
- **KunChatMessageList** never groups a sticker into an album, even if it shares a `media_group_id` with other messages. Only photos form albums now. The list's lightbox skips stickers. The message menu never offers `edit`, `quote` or `copy` for a sticker, even when your `actions` callback returns them.
- **Reply previews, KunChatComposer's reply bar, KunChatPinnedBar and KunChatConversationItem** label a sticker "贴纸" / "Sticker", using the new `chat.sticker` locale key. Reply previews and the conversation preview show the new bundled `lucide:sticker` icon in place of `lucide:image`. The pinned bar shows a sticker thumbnail uncropped.

What this costs you: if your code narrows `message.media` by assuming it is a photo, it now has to check `media.type === 'photo'` first. A `resolveMediaUrl` you pass now receives stickers too. A sticker only ever asks for the `'preview'` variant.
