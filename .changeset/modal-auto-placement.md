---
'@kungal/ui-vue': minor
---

feat(vue): KunModal opens as a bottom sheet on phones

**Behaviour change.** `placement` gains an `auto` value and it is now the
default: below `md` the panel is anchored to the bottom edge and spans the
width, at `md` and up it is the centred dialog it has always been. This is
HeroUI's default too, and it matches how a phone expects a dialog to arrive —
within thumb reach, rising from the edge, instead of parked in the middle of the
screen. Pass `placement="center"` to keep the old behaviour at every width.

Measured against HeroUI v2's own modal at 390x844, the two now agree: panel
inset 4px from the left and bottom edges, `align-items: flex-end`, corners left
rounded, and an 80px rise on enter with no scale (desktop keeps KunUI's existing
`translateY(8px) scale(0.96)`).

It is built out of breakpoint classes — `items-end md:items-center` — not a
`useMediaQuery` ref, deliberately. VueUse's media queries evaluate to `false` on
the server unless the app calls `provideSSRWidth`, so a JS-driven version would
ship a dialog that is open in the SSR markup as centred and snap it to the
bottom on hydration. The static classes render the sheet in the first paint,
before any JS runs. Verified under Nuxt SSR with the modal open: no hydration
warnings.

Two mobile sizing bugs are fixed along the way, and they apply to **every**
placement, not just `auto`:

- The panel was capped at `90vh`. On phones `vh` resolves against the *large*
  viewport — the one you get with the address bar retracted — so a tall panel
  already ran off-screen behind the browser chrome. It is now
  `min(90dvh, 100%)`.
- Nothing tracked the on-screen keyboard. `dvh` deliberately ignores it, so a
  dialog with an input in it sat behind the keyboard the moment that input took
  focus. The overlay now measures `visualViewport` (a new
  `useVisualViewportHeight` composable, listening only while open) and shrinks to
  what is genuinely visible. Simulated at 390x844 with a 424px keyboard: the
  panel's bottom edge moves from 840px to 416px, and a panel too tall to fit
  clamps to the visible area and scrolls inside itself.

`auto` also pads the overlay with `env(safe-area-inset-bottom)` so the sheet
clears the home indicator on notched phones, and drops the panel's `min-w-80`
floor below `md`, which on its own overflowed a 320px-wide screen.

`KunModalPlacement` is exported alongside `KunModalSize`.
