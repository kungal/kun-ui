---
'@kungal/ui-vue': patch
---

fix(vue): KunMessage toasts use semantic-colored border + count badge

Each toast's outline is now its own semantic colour (`ring-{color}/50`) instead of
a uniform neutral grey ring, and the de-dup count badge uses a matching
`bg-{color}/10` tint instead of the neutral `bg-black/10`. Each type now reads as
one cohesive coloured surface in both light and dark.
