---
'@kungal/ui-vue': patch
---

fix(vue): KunReaction honors `active` skin in action mode (menu-button reactions)

The filled/coloured skin now follows the `active` model in BOTH modes, not just
`toggle` mode. This lets an action-mode (`toggle="false"`) reaction be a
controlled "menu button": wrap it as a `KunPopover` trigger, bind `:model-value`
to your own state, and the click opens the picker instead of self-toggling while
the skin still reflects your state. This is what a 收藏 button needs when it sits
next to a 点赞 reaction — both stay peer pills (identical skin), but 收藏's click
opens a 收藏夹 picker and its filled state = "in ≥1 list" (Bilibili / YouTube
pattern), no split button. Fully backward-compatible: existing action-mode
buttons (share / more …) pass no `active`, so they stay neutral exactly as before.
