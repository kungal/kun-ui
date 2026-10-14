---
'@kungal/ui-vue': patch
---

KunImage no longer writes its ThumbHash blur into server-rendered HTML. Reported downstream by kungal, where it was most of the page.

The blur was a base64 PNG of about 3.3 KB per image, and compression cannot shrink it. On kungal's `/galgame/4` the 39 placeholders were 80 KB of a 142 KB brotli response.

The server now renders the hash's average colour as a solid background, about 20 bytes, in the same box. After mount the client decodes the blur and fades it in over that colour. An image already loaded from cache by mount skips the decode. Re-rendering kungal's production HTML this way takes `/galgame/4` from 142 KB to 62 KB on the wire and the home page from 117 KB to 69 KB.

Before hydration the placeholder is now a flat colour instead of the blur. Lazy images below the fold have their blur in place by the time they scroll in. A client-side navigation shows the colour for one frame, then the 350 ms fade (none under `prefers-reduced-motion`). Nothing changes in the API.
