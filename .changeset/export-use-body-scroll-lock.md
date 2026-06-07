---
"@kungal/ui-vue": patch
---

Export `useBodyScrollLock`. The refcounted body scroll-lock composable that
KunModal / KunDrawer / KunLightbox already use internally is now public, so apps
can lock body scroll for their own overlays through the same shared counter
(nested overlays won't unlock the body until the outermost one closes).
