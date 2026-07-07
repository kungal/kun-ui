---
'@kungal/ui-vue': minor
---

feat(vue): KunAutocomplete & KunSelect support custom option rendering via `#option`

Both components are now generic over the option shape, so you can pass options
with extra fields (avatar, description, …) and read them — typed — in a new
`#option` scoped slot: `<template #option="{ option, index, active, selected }">`.
Render a leading image, two-line text, badges, anything. Without the slot the
plain label renders exactly as before (fully backward-compatible). Select keeps
its check indicator outside the slot, and the option row now groups rich content
at the left with the indicator at the right.
