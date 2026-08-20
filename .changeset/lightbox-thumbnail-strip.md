---
'@kungal/ui-vue': minor
---

KunLightbox's thumbnail strip now runs on phones as well, and it follows the
image you are looking at.

Below `md` the viewer used to show a row of dots and keep the thumbnails for
desktop only. Dots do not survive a real gallery — twenty of them are twenty 8px
targets that say nothing about where they lead — so the same strip is shown at
every width, sized down on phones (48px thumbnails against 56px, `max-width:
92vw`). It pans with a finger for free: it is a plain `overflow-x` scroller, and
that is what the browser already does with one.

- **The active thumbnail is kept centred** — on open, and on every change after
  that (swipe, ←/→, a click on another thumbnail). A gallery longer than the
  strip used to stay parked at the first thumbnail, so past the fifth image
  there was nothing on screen telling you where you were. Centring, rather than
  the smallest scroll that brings it into view (what KunTab does), is what a
  filmstrip wants: the neighbours on both sides stay visible. It is lightGallery's
  default too (`currentPagerPosition: 'middle'`). Smooth, or instant under
  `prefers-reduced-motion`.
- **The mouse wheel scrolls the strip** on desktop. The dominant axis wins, so a
  trackpad's horizontal swipe drives it as well as a vertical wheel does, and at
  either end the wheel is released rather than swallowed, so nothing is trapped.
- Thumbnails are `loading="lazy"`. `KunLightboxImage` carries no separate
  thumbnail URL, so every thumbnail is the full-size original — measured in
  Chrome 151, a 100-image strip now fetches 26 of them when the viewer opens
  instead of 100.
- `overscroll-behavior-x: contain` on the strip. Horizontal overscroll is the
  back gesture on Chrome for Android and on Safari; dragging past the last
  thumbnail must not navigate away from the page the viewer was opened from.

Also: wheel deltas are now converted to pixels before they are used, in the
lightbox strip and in `KunScrollShadow`'s `wheel` mode. A wheel event may report
its delta in lines (`deltaMode: 1`, which is what Firefox sends for a mouse
wheel — 3 per notch) or pages, and both were being applied as if they were
pixels: one notch moved a `KunScrollShadow` row 3px in Firefox. A line counts as
40px, which puts a Firefox notch within a few pixels of the ~125px Chromium
reports for the same notch.

No API change; the dot row is the only thing removed.
