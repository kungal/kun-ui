---
'@kungal/ui-vue': minor
---

feat(vue): add KunButtonGroup (segmented actions + split buttons)

`KunButtonGroup` joins a row/column of `KunButton`s into one attached unit —
collapsing the touching inner corners and overlapping the 1px borders into a
single seam. It is the building block for a GitHub-style **split button**: a
primary `KunButton` next to a chevron `KunButton` that triggers a `KunPopover`
holding a rich menu (e.g. a `KunCheckBoxGroup` of lists + a "create list"
footer). The seam CSS reaches a button nested inside a `KunPopover` trigger
wrapper, and — because the popover panel teleports to `<body>` — never touches
the menu's own buttons. Supports `orientation="horizontal" | "vertical"`.
