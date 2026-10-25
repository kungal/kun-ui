---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

**KunLightbox: thumbhash placeholders and veiled images.** `KunLightboxImage` gains four optional fields. Existing image lists behave as before.

- `thumbhash` (base64 ThumbHash) is drawn in the image's own frame until `src` has loaded: contain-fit in the viewer, never wider than the image, and zoomed and rotated with it. It also sits behind each thumbnail while that thumbnail loads.
- `width` and `height` (intrinsic px) give the placeholder the image's shape and size before the image decodes. Without them the placeholder takes the hash's approximate aspect ratio and fills the viewer.
- `veiled` withholds the picture until the reader asks for it, for example an adult image on a site that blurs them by default. While an image is veiled, its `src` is never requested, neither for the stage nor for its thumbnail. The viewer draws the thumbhash with the new `#veil` slot over it, and zoom, rotation, pan and download are disabled. Paging, the thumbnail strip and closing still work. The slot gets `{ index, image, reveal }`. Its default is a "Show image" button, with the new `lightbox.reveal` message as its label.
- `reveal` lifts the veil for that image until the viewer closes, and emits the new `reveal` event with the image's index. The app owns the policy: to keep an image revealed, set `veiled: false` from `@reveal`.

Asked by the kungal Flutter app, whose image viewer moves onto KunLightbox.
