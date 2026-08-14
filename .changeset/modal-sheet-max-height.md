---
'@kungal/ui-vue': patch
---

fix(vue): a KunModal sheet caps at 85dvh instead of 90dvh on phones

`placement="auto"` below `md` — the bottom sheet — now caps at `min(85dvh, 100%)`.
Every other placement, and the sheet from `md` up, keeps `min(90dvh, 100%)`.

The leftover height is spent differently in the two shapes. A centred dialog
splits it into two strips (~37px each on a 750px viewport, which reads as
ordinary padding). A bottom sheet puts all of it into one strip at the top, and
that strip is doing two jobs: signalling that this is a layer over the page, and
being the only tap-to-dismiss target. At 90dvh it was 71px on a 750px viewport
and 48px on an iPhone SE — past the 44px minimum with nothing to spare. 85dvh
makes it 108px / 74px.

For reference, HeroUI caps at `calc(100% - 8rem)` at every width, which is really
its desktop `sm:my-16` margins in disguise — on a phone (`my-1`) it just leaves
124px unused, landing at 83% of a 750px viewport and 75% of an SE. shadcn's vaul
drawer is `max-h-[80vh]` with a 96px floor. 85 sits between them.
