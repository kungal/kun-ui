---
"@kungal/ui-vue": minor
---

feat(vue): KunReaction `toggle` (action mode) + default-slot visible label

Two additive, backward-compatible hooks so a whole actions row can be one
component, and so the text is part of the click target:

- **`toggle` prop** (default `true`). `false` = a one-shot ACTION (share / 更多 …)
  in the same compact skin: no pressed state, no burst, just a tactile pop —
  handle it with a native `@click`. A reactions row no longer needs to mix in a
  heavier icon button.
- **Default slot** = a visible label rendered INSIDE the button, so clicking the
  TEXT (not just the icon) toggles too — the clean fix for "点 收藏游戏 文字也该收藏".
  It inherits the active colour; when present it becomes the accessible name (the
  `label` prop is the aria fallback only when there's no visible label). Omit it to
  keep the compact icon-(+count) reaction.
