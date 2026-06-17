---
'@kungal/ui-vue': patch
---

fix(vue): SSR-safe active highlight for KunTab

The Tab active indicator was measured on the client (`offsetLeft`/`offsetWidth`)
and so was absent from server-rendered HTML — on first paint (and the whole
pre-hydration window) the selected tab showed only a text-color change, with the
underline/pill missing. For the `solid` variant the active tab was effectively
invisible (white text on no background) until hydration.

The selected tab now carries a CSS-only active highlight that renders in SSR
(inline inset box-shadow for `underlined`; background tint for `solid` / `light`);
the JS-measured sliding indicator takes over after the client mounts, with no
hydration mismatch. The indicator is also re-measured on mount and via a
`ResizeObserver`, so web-font swaps and container resizes no longer leave it
stale. `pills` / `bordered` were already SSR-safe and are unchanged.
