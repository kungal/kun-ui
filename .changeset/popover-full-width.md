---
'@kungal/ui-vue': minor
---

feat(vue): KunPopover gains a `fullWidth` prop

The trigger was wrapped in two hardcoded `inline-block` divs, so a consumer could
never make the anchor span its container — external classes only reached the outer
wrapper, not the inner `triggerRef`. `<KunPopover full-width>` now switches both
wrappers to `block w-full`, so a full-width trigger (e.g. a `fullWidth` KunButton
or a split button) fills the width. Default `false` (inline, content-width) —
unchanged.
