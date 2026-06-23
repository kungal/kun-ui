---
"@kungal/ui-vue": patch
---

fix(vue): KunPopover restores focus to the trigger on every close

Hardens focus handling found while stress-testing hover menus: if focus was
inside the panel when it closed via a path that doesn't restore it itself —
e.g. a hover `group` sibling stealing the open menu — focus is now pulled back to
the trigger instead of being orphaned on the detached panel node. Covers all
close paths (group steal, click-outside, programmatic).
