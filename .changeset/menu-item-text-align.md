---
'@kungal/ui-vue': patch
---

fix(vue): KunDropdown / KunContextMenu item labels align left, not center

Menu items are native `<button>`s, which default to `text-align: center`; the
`flex-1` label span inherited that, so short labels sat centered. Both item rows
now carry `text-left` so the label starts at the left edge (icon → label), the
expected menu-item layout.
