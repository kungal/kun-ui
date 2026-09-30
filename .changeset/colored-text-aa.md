---
'@kungal/ui-vue': minor
'@kungal/ui-tokens': minor
'@kungal/ui-core': minor
---

Coloured text and placeholders now clear WCAG AA (4.5:1). A kungal Flutter app's contrast check measured KunUI's own coloured text and placeholders below it, and the web uses the same classes.

**New tokens:**
- `--color-{color}-text` (Tailwind `text-primary-text`, `text-danger-text`, …), one per semantic colour, `default` included.
- In Dart: `KunColorScale.text`.

**Why a new token.** A fill colour used as text measured 1.75–4.42:1 on the light page for every colour but `default`, and in dark mode primary and danger fell to 3.87:1 and 3.66:1 on cards. `{color}-text` is the ramp step closest to the fill that clears 4.5:1 on:
- the page background;
- cards (`content1`);
- the colour's own 20% tint over each, which is the hover and keyboard-focus fill of a light item and the fill of a flat chip.

The token generator measures all four in both modes and fails the build if one misses. The steps it picks:

| Mode | Step 600 | Step 700 |
|---|---|---|
| Light | secondary, warning | primary, success, danger, info, default |
| Dark | every colour except secondary | secondary |

**What moved to it:**
- The `light`, `bordered` and `flat` variants (buttons, chips, badges, menu items) and `kunTextClasses`, which covers KunLink, selected tabs, active steps and reactions.
- KunInfo's `bordered` text, and its dark `flat` danger and info.
- Every form error message and required asterisk.
- Chat sender names, reply and pinned titles, links, mentions, typing and status text.

**What you'll see.** Coloured text is one step darker in light mode and one step lighter in dark mode. Icons, SVG strokes, spinners and text on solid fills keep their colours.

**If your own markup uses `text-primary` for readable text**, switch it to `text-primary-text`. `text-primary` stays the fill colour, meant for fills, borders and icons.

**Placeholders** now use `foreground-muted`, the secondary-text colour: 5.52:1 light and 4.85:1 dark, where `default-400` measured 2.31–3.58:1. This covers the base-layer `::placeholder` rule (every native input), KunSelect's and KunDatePicker's empty trigger, KunChatComposer and KunCommandPalette. A placeholder is often the only label a field has, such as "全部平台" in a filter. Disabled text, outside-month days and icons keep their lighter steps: WCAG exempts disabled controls, and the others are not text.

Measured on the docs site in Chromium: 227 text elements in each mode across the button, chip, tab, link, select, input, info, dropdown, chat bubble, date picker and textarea pages all clear 4.5:1. The lowest are a warning chip (4.77:1 light, 4.87:1 dark) and the dark placeholder (4.85:1).
