---
"@kungal/ui-vue": minor
---

`KunImage` / `KunImageNative` now default to `loading="lazy"`.

Previously `loading` defaulted to unset, so the browser loaded every image
eagerly. A page with many images (card grids, lists, avatars) fired them all at
once and saturated the connection, starving the above-the-fold images — they
filled in slowly behind a long-lingering skeleton, making the page feel stuck on
images. `KunImage` already reserves space (its aspect-ratio box + skeleton), so
deferring off-screen images causes no layout shift and shortens the critical
path. `KunImageNative` also gains a `loading` prop (it had none before).

**Opt your LCP / hero image back into eager loading:**
`<KunImage loading="eager" fetchpriority="high" … />` — otherwise it's lazy like
the rest, which can cost a little LCP for that one image.
