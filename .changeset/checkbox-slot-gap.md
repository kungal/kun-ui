---
"@kungal/ui-vue": patch
---

KunCheckBox: add a gap between the box and its slotted content.

The box and its content sat as adjacent flex children with no gap, so the box's
right edge touched the start of slotted content (`<KunCheckBox>分类</KunCheckBox>`)
— measured gap was 0. Only the `label` *prop* path was spaced, because that
`<label>` carried its own `ml-2`; slot/`v-html` content had nothing. The wrapper
now uses `gap-2` (matching KunRadioGroup) and the redundant `ml-2` is dropped from
the label, so the box→content gap is a uniform 8px whether you use the `label`
prop or the default slot.
