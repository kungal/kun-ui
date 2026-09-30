---
'@kungal/ui-vue': patch
'@kungal/ui-tokens': patch
---

Secondary text now clears WCAG AA on the fills it sits on, not only on the bare page.

- **`foreground-muted` is slightly stronger.** It was the ramp's `default-600` in light and `default-500` in dark. That cleared AA on `background` and `content1`, but not on the neutral fills muted text also sits on: a hovered or keyboard-highlighted row (`bg-default/20`), a keycap (`bg-default-100`) and a code-block header (`bg-default/15`). On those it measured as low as 3.95:1 in light and 3.93:1 in dark, and a KunKbd keycap in dark mode read 4.36:1. It is now a grey of its own between the ramp steps: OKLCH L 0.48 in light and 0.66 in dark. That is the smallest move that clears 4.5:1 on all of those fills. On the page it is now 5.98:1 in light and 6.35:1 in dark, up from 5.03:1 and 5.42:1. The token generator now measures it on `background`, on `content1`, on `default/20` over each and on `default-100`, and fails the build if any is below AA. Placeholders use this token, so placeholders on tinted inputs get the same fix. `{c}-text` is now also measured on its own `100` step, the fill of the viewer's own chat bubble; every hue already cleared it.
- **Text on a tint laid over another tinted surface uses `text-default-text`,** as a flat default chip's label does. This covers KunChatMessageList's unread divider, a `default/15` band on the `default-100` chat wallpaper (4.10:1 in light), and KunChatText's code-block language label inside a coloured bubble (4.12:1 in dark).
- **No transparency on a fill's on-colour.** White on `primary` is 4.59:1, so any alpha drops it below AA.
  - KunChatConversationItem's selected row drew its time at 80% and its preview at 85%, which measured 3.50:1 and 3.76:1.
  - KunInfo's solid and shadow descriptions were drawn at 90% (4.02:1).
  - Both are now at full strength.
- **KunChatConversationItem muted-chat badge.** The unread badge of a muted chat was white on `default-400`, 2.53:1 in light. It is now the solid default fill with its own on-colour, 4.87:1.
- **KunChatBubble.**
  - A deleted reply's "message deleted" line was `default-500` (3.20:1 in light); it is now `foreground-muted`.
  - The time shown over a photo now sits on `bg-black/55` instead of `/45`. White on black/45 over a white screenshot is 3.35:1, and /55 is the lowest opacity that clears 4.5:1 over any image.

**What it costs:** muted text renders slightly darker in light mode and slightly lighter in dark mode everywhere it is used. Your code needs no changes. In `tokens.dtcg.json`, `foreground-muted` is now a colour value instead of an alias to a ramp step. In Flutter, `KunColorScheme.foregroundMuted` takes the new value; its API is unchanged.

Measured in Chromium on every demo across the 77 component pages, in both modes. The only text still below AA is:

- disabled controls;
- KunLoading's outlined caption, and the content dimmed under its mask;
- a reaction colour the consumer chose;
- text on an image or a gradient.
