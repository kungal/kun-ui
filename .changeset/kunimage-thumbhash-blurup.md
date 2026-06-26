---
'@kungal/ui-vue': minor
---

feat(vue): KunImage — ThumbHash blur-up placeholder

KunImage gains a `thumbhash` prop: pass the base64 ThumbHash a backend ships
alongside image metadata, and KunImage shows a decoded, blurred "blur-up"
placeholder until the image loads, then cross-fades to it — much closer to the
final frame than a plain skeleton, with no extra network request.

- Decoded on the client (canvas) to a tiny data-URL image, upscaled by `bg-cover`;
  SSR-safe — falls back to the pulse skeleton until decoded, or if the hash is
  invalid.
- The ~2KB `thumbhash` decoder is loaded via a dynamic import, so it only ships for
  images that actually use the prop — zero cost otherwise.
