# @kungal/tokens

KunUI's design tokens as **pure, framework-agnostic CSS**. This is the
single source of truth for the visual language — semantic color scales
(7 colors × 50–950 + light/dark), the 5-bucket radius system, the
z-index layering, and animation keyframes — expressed as Tailwind v4
`@theme` declarations and CSS custom properties.

No JavaScript. No framework. Consumable identically by Vue, React, or
plain HTML.

## Install

```bash
pnpm add @kungal/tokens tailwindcss
```

## Usage

Import **after** Tailwind in your app's entry stylesheet, then point
Tailwind's scanner at whichever KunUI render layer you use:

```css
@import 'tailwindcss';
@import '@kungal/tokens';                     /* tokens + opinionated base */
@source '../node_modules/@kungal/ui-vue';     /* or @kungal/ui-react */
```

### Entry points

| Import | Contents |
| --- | --- |
| `@kungal/tokens` / `@kungal/tokens/index.css` | tokens **+** base layer (resets, page bg, scrollbar/font) |
| `@kungal/tokens/css` | tokens **only** (`@theme`, colors, radius, z-index, animations) |
| `@kungal/tokens/base.css` | opinionated base layer only |

Use `@kungal/tokens/css` when the host app wants the design tokens but owns
its own global element styling.

## Dark mode

Dark values live under `.kun-dark-mode`. Toggle by adding/removing that
class on a root element (`<html class="kun-dark-mode">`). The Tailwind
`dark:` variant is wired to it via `@custom-variant dark`.

## Overriding

Any token is a CSS variable — override in your app's `:root`:

```css
:root {
  --primary-500: 280, 90%, 55%; /* rebrand primary */
  --radius-kun-md: 0.375rem;     /* tighter default radius */
  --z-kun-modal: 1200;           /* coexist with a third-party widget */
}
```
