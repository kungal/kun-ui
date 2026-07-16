---
'@kungal/ui-vue': patch
---

feat(vue): KunPagination animates the active page (sliding pill + "highlight leads")

The active page is now a single primary pill that slides between numbers (like
KunTab's indicator) with a small elastic pop, instead of the highlight jumping.
For mid-range pages — where the active number stays centered in the ellipsis
window so the pill can't slide — the highlight *leads*: it first covers the
adjacent number, then the number row scrolls (FLIP) to recenter and the pill
rides back with it. Honors `prefers-reduced-motion`; falls back to a solid pill
before hydration. No API change.
