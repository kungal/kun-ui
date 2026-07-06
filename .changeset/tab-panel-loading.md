---
'@kungal/ui-vue': minor
---

feat(vue): KunTabPanel gains a `loading` state (dim + inert + aria-busy)

`<KunTabPanel :loading>` marks a panel busy while async / lazy data resolves. It
dims the panel to `0.5` opacity, makes it `inert` (no pointer **or** keyboard
interaction) and sets `aria-busy` for screen readers. The dim uses a *delayed*
fade (`transition: opacity 0.2s 0.2s linear` — the React `useDeferredValue`
trick): a load that resolves quickly clears `loading` before the dim ever paints,
so fast tab switches never flicker; only a genuinely slow load visibly dims. It
snaps back to full opacity the instant content is ready, and honours
`prefers-reduced-motion`.

This is the stale-while-revalidate mechanism only — it dims content that is
already there. For a true first load (nothing to dim), render a skeleton (e.g.
`KunSkeleton`) in the slot and leave `loading` off, so the skeleton shows at full
opacity; flip `loading` on only when revalidating existing content. See the new
"懒加载 / 加载中" docs example.
