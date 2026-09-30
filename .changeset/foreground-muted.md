---
'@kungal/ui-vue': minor
'@kungal/ui-tokens': minor
---

New token `foreground-muted` for secondary text: descriptions, helper text, timestamps, counts, empty states and meta lines. It is `default-600` in light mode and `default-500` in dark mode. The token generator now fails the build unless it clears 4.5:1 (WCAG AA) on both `background` and `content1` in both modes. Measured: 5.03:1 and 5.53:1 in light, 5.42:1 and 4.85:1 in dark.

KunUI's own components use it for secondary text. They used to set that text in `text-default-500` or `text-default-400`, which measure 3.33:1 and 2.31:1 on the light page background, so both fell below AA. Affected text includes field descriptions and helper text, tab labels that are not selected, divider labels, user-chip descriptions, character counts, empty states, timeline and chat timestamps, conversation previews and command-palette meta lines.

- **What it costs:** in light mode that text is now a step darker. Dark mode renders exactly as before, because its value (`default-500`) is the one it already used.
- **What stays the same:** placeholders (`::placeholder` stays `default-400`), the text of an empty select or date picker, disabled states, outside-month days and icons.

**Migrating your own text.** No single grey clears 4.5:1 against both the light and the dark page, and the ramp's `500` step is the same value in both modes. So readable secondary text belongs on this token, not on a fixed step:

- In Vue, replace `text-default-500` or `text-default-400` with `text-foreground-muted`.
- In Flutter (`kun_ui_tokens`), `KunColorScheme` gains `foregroundMuted`. Replace `scheme.neutral.shade500` with `scheme.foregroundMuted`.
- Keep the old steps for anything that is not text meant to be read.

`KunColorScheme`'s constructor gains a required `foregroundMuted` parameter. Only code that builds a scheme by hand needs to pass it. `KunColors.light` and `KunColors.dark` already carry it.
