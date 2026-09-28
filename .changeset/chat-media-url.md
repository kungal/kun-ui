---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

Chat photos show the URL the server sends. NextMoe chat spec 1.1.0 (nextmoe-infra #337) gives every photo a `url`, which the spec describes as "where the image is served; never build it from image_hash". It is present on history, updates, pins, last messages, pushes and the upload response. `KunChatPhoto` gains `url?: string | null`. It is optional so payloads and fixtures from before 1.1.0 still type-check.

`KunChatBubble`, `KunChatMessageList` (its lightbox included) and `KunChatPinnedBar` now show `media.url` when you pass no `resolve-media-url`, so a site on spec 1.1.0 can drop its hash-to-URL resolver. A resolver you do pass still takes precedence: keep it if you serve the bubble a smaller preview than the lightbox, because `url` is a single address for both. A photo with neither a `url` nor a resolver renders as before, with an empty `src`.

A conversation's `photo_url` needs nothing new from KunUI. Pass it to `KunChatConversationItem`'s `avatar`, which already takes a URL.
