---
'@kungal/ui-tokens': minor
'@kungal/ui-vue': minor
---

Scroll lock: publish the scrollbar width it removes, and stop compensating a page that lost nothing

Opening a Modal, Drawer, Lightbox or CommandPalette hides the page scrollbar.
KunUI compensates by padding `<body>`, which holds in-flow content still but
cannot reach anything `position: fixed` — fixed positioning resolves against the
initial containing block, and that grows by the scrollbar width. Measured on
this repo's own docs site (Chromium 152, 15.2px classic scrollbar): a
`top-right` toast went from `right = 1458.4` to `right = 1473.6` when the
command palette opened, and a probe fixed at `right: 1rem` moved the same
15.2px. There was no way for a consumer to correct it either, because the number
was never exposed.

It is now published on `<html>` as `--kun-scrollbar-width` for as long as a lock
is held, so a fixed header, FAB or side rail can take it back:

```css
.my-fixed-toolbar { right: 1rem; margin-right: var(--kun-scrollbar-width, 0px); }
```

Apply it as a **margin**, not folded into `left`/`right`: a declaration
containing `var()` is only validated after substitution, so a value that isn't a
length invalidates the whole declaration — a dropped margin merely loses the
compensation, a dropped `left` sends the element to its static position.
`@kungal/ui-tokens` ships the `0px` resting value; keep the `0px` fallback
anyway if you may be used without it. This is the same contract Radix
(`--removed-body-scroll-bar-size`) and Reka (`--scrollbar-width`) expose.

`KunMessageProvider` now uses it to hold its own toasts still — all of the width
for the right-anchored placements, half for the centred ones, none for the
left-anchored ones.

**Also fixed:** a page that already set `scrollbar-gutter: stable` on `<html>`
was compensated on top of a gutter that was never lost, so KunUI's padding *was*
the layout shift — measured at 16px of content shrink on every open. The lock
now detects a reserved gutter and adds nothing. On overlay-scrollbar platforms
(macOS, iOS, most mobile) nothing is removed either, and the published width is
`0px` in both cases, so one consumer declaration is correct everywhere.

**Why KunUI does not set `scrollbar-gutter: stable` itself**, though it would
hold fixed elements still and react-aria and Base UI both do it: a reserved
gutter sits outside the initial containing block, and page content cannot paint
there by any means — measured in Chrome 152, `right: -32px`, `width: 100vw` and
a negative margin all still clipped at the ICB edge, and
`document.elementFromPoint()` in the gutter returned `null`. Every full-bleed
backdrop would stop ~15px short of the screen edge and show the page background
as a bright band down the side of a dim modal, and a right-anchored Drawer would
float 15.6px off the edge. Reserving the gutter is only viable together with
keeping the scrollbar *rendered*, which is a larger change than this one.

The scroll lock's standing limitations are now written down in
`docs/INTEGRATION.md` §5 — most usefully, it does nothing at all on a page whose
scroll container is `<html>` rather than `<body>` (`html { overflow-y: scroll }`
and friends), which has always been true and is now stated.

**What it costs you:** nothing to change. The only new thing KunUI touches is
one custom property on `<html>`, saved and put back on close so a value of your
own survives; if you observe root attribute mutations, expect a `style` change
on open and on close. If you were correcting KunUI's shift by hand in an app
stylesheet, replace it with the variable — it is correct on the platforms where
your hand-rolled constant was not.
