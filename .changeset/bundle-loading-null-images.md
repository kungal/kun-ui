---
"@kungal/ui-vue": minor
---

Bundle the default KunLoading / KunNull mascot images (base64 data URIs) — zero
consumer setup, no network request, consistent with the bundled-icon policy.

- `KunLoading`: default `src` is now a bundled image (previously relied on a
  consumer-provided `/kun.webp` public asset).
- `KunNull`: default image is now bundled (previously fetched a random sticker
  from the KunUI CDN via `getRandomSticker()`); added an optional `src` prop to
  override it.
- Both images now render at their natural aspect ratio instead of being forced
  into a square.
