import type { KunUIVariant, KunUIColor } from './types'

// Single source of truth for the variant × color → Tailwind class table.
// Button / Badge / Chip / Tab / Info / Progress etc. (in every framework
// layer) consume this so the 7 × 7 matrix lives in exactly one place.
//
// All keys MUST be static string literals so the Tailwind JIT picks them
// up — never construct class names with template strings at runtime.
// Every entry carries an explicit `border` WIDTH so the outline variants
// (bordered / ghost) actually render — `border-{color}` alone sets only the
// color and paints nothing in Tailwind v4. Filled / light variants use a
// transparent border of the same width so switching variants never shifts the
// box by a pixel.
const TABLE: Record<KunUIVariant, Record<KunUIColor, string>> = {
  // Filled buttons keep white text in BOTH modes, so the fill must stay dark
  // enough for contrast. The dark color scale is inverted (`-500`/`-600` become
  // LIGHT in dark mode), so a plain `bg-{color}` renders pale — worst on the
  // light hues (info ≈ L88%, default/secondary ≈ L65–72%). Each entry pins a
  // `dark:bg-{color}-{n}` that lands every color at a consistent ~L44–55% so the
  // whole row reads as one saturated tier with legible white text.
  solid: {
    default: 'border border-transparent bg-default text-white dark:bg-default-400',
    primary: 'border border-transparent bg-primary text-white dark:bg-primary-400',
    secondary: 'border border-transparent bg-secondary text-white dark:bg-secondary-300',
    success: 'border border-transparent bg-success-600 text-white dark:bg-success-400',
    warning: 'border border-transparent bg-warning text-white dark:bg-warning-400',
    danger: 'border border-transparent bg-danger text-white dark:bg-danger-400',
    info: 'border border-transparent bg-info-600 text-white dark:bg-info-300',
  },
  bordered: {
    default: 'border border-default bg-transparent',
    primary: 'border border-primary bg-transparent text-primary',
    secondary: 'border border-secondary bg-transparent text-secondary',
    success: 'border border-success bg-transparent text-success',
    warning: 'border border-warning bg-transparent text-warning',
    danger: 'border border-danger bg-transparent text-danger',
    info: 'border border-info bg-transparent text-info',
  },
  light: {
    default: 'border border-transparent bg-transparent hover:bg-default/20',
    primary: 'border border-transparent bg-transparent text-primary hover:bg-primary/20',
    secondary: 'border border-transparent bg-transparent text-secondary hover:bg-secondary/20',
    success: 'border border-transparent bg-transparent text-success hover:bg-success/20',
    warning: 'border border-transparent bg-transparent text-warning hover:bg-warning/20',
    danger: 'border border-transparent bg-transparent text-danger hover:bg-danger/20',
    info: 'border border-transparent bg-transparent text-info hover:bg-info/20',
  },
  flat: {
    default: 'border border-transparent bg-default/20 text-default-700',
    primary: 'border border-transparent bg-primary/20 text-primary-600',
    secondary: 'border border-transparent bg-secondary/20 text-secondary-600',
    success: 'border border-transparent bg-success/20 text-success-700 dark:text-success',
    warning: 'border border-transparent bg-warning/20 text-warning-700 dark:text-warning',
    danger: 'border border-transparent bg-danger/20 text-danger-600 dark:text-danger-500',
    info: 'border border-transparent bg-info/20 text-info-700 dark:text-info-500',
  },
  // Same fill logic as `solid` (see note above) plus the colored glow; the
  // `dark:bg-{color}-{n}` overrides keep the dark row at one consistent tier.
  shadow: {
    default: 'border border-transparent shadow-default/40 bg-default text-white dark:bg-default-400',
    primary: 'border border-transparent shadow-primary/40 bg-primary text-white dark:bg-primary-400',
    secondary: 'border border-transparent shadow-secondary/40 bg-secondary text-white dark:bg-secondary-300',
    success: 'border border-transparent shadow-success/40 bg-success-600 text-white dark:bg-success-400',
    warning: 'border border-transparent shadow-warning/40 bg-warning text-white dark:bg-warning-400',
    danger: 'border border-transparent shadow-danger/40 bg-danger text-white dark:bg-danger-400',
    info: 'border border-transparent shadow-info/40 bg-info-600 text-white dark:bg-info-300',
  },
  ghost: {
    default: 'border border-default bg-transparent hover:bg-default/10',
    primary: 'border border-primary bg-transparent text-primary hover:bg-primary/10',
    secondary: 'border border-secondary bg-transparent text-secondary hover:bg-secondary/10',
    success: 'border border-success bg-transparent text-success hover:bg-success/10',
    warning: 'border border-warning bg-transparent text-warning hover:bg-warning/10',
    danger: 'border border-danger bg-transparent text-danger hover:bg-danger/10',
    info: 'border border-info bg-transparent text-info hover:bg-info/10',
  },
}

export const kunVariantClasses = (
  variant: KunUIVariant,
  color: KunUIColor
): string => TABLE[variant][color]

// Static maps for narrower use cases (just the fill color, just the text
// color, etc.) — same JIT-safety requirement: keys must be literals.

export const kunBgClasses: Record<KunUIColor, string> = {
  default: 'bg-default',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
}

export const kunTextClasses: Record<KunUIColor, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
}

export const kunBorderClasses: Record<KunUIColor, string> = {
  default: 'border-default',
  primary: 'border-primary',
  secondary: 'border-secondary',
  success: 'border-success',
  warning: 'border-warning',
  danger: 'border-danger',
  info: 'border-info',
}

/**
 * @deprecated Use {@link kunFocusRingClasses} (or {@link kunFocusRingWithinClasses}
 * for composite widgets). This mixed `:focus` + `:focus-within` so a mouse click
 * lit the ring, and used a different opacity from the rest of the library.
 */
export const kunRingClasses: Record<KunUIColor, string> = {
  default: 'focus-within:ring-default/40 focus:ring-default/40',
  primary: 'focus-within:ring-primary/40 focus:ring-primary/40',
  secondary: 'focus-within:ring-secondary/40 focus:ring-secondary/40',
  success: 'focus-within:ring-success/40 focus:ring-success/40',
  warning: 'focus-within:ring-warning/40 focus:ring-warning/40',
  danger: 'focus-within:ring-danger/40 focus:ring-danger/40',
  info: 'focus-within:ring-info/40 focus:ring-info/40',
}

/**
 * Unified focus ring — ONE recipe for every directly-focusable control (inputs,
 * textarea, select trigger, buttons, checkbox/radio, links, tabs, menu items…).
 * Keyboard focus only (`:focus-visible`, so a mouse click on a button shows no
 * ring; text fields still show it on click via the browser's focus-visible
 * heuristic). A flush 2px ring in the control's semantic color at 50% — replaces
 * the old scatter of `:focus`/`:focus-within` × `ring-1|2|4` × `/25|/40|/50|full`.
 * Pair with `border-kun` at rest; on an invalid control use the `danger` entry.
 */
export const kunFocusRingClasses: Record<KunUIColor, string> = {
  default: 'outline-none focus-visible:ring-2 focus-visible:ring-default/50',
  primary: 'outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
  secondary: 'outline-none focus-visible:ring-2 focus-visible:ring-secondary/50',
  success: 'outline-none focus-visible:ring-2 focus-visible:ring-success/50',
  warning: 'outline-none focus-visible:ring-2 focus-visible:ring-warning/50',
  danger: 'outline-none focus-visible:ring-2 focus-visible:ring-danger/50',
  info: 'outline-none focus-visible:ring-2 focus-visible:ring-info/50',
}

/**
 * Composite-widget variant of {@link kunFocusRingClasses}: the focusable element
 * is an inner `<input>` but the ring should sit on the WRAPPER. Put this on the
 * wrapper and give the inner input `outline-none` (and no ring of its own) so
 * there's exactly one indicator. Used by KunNumberInput / KunTagInput.
 *
 * Uses `focus-within` (not `has-[:focus-visible]`): for a text-field wrapper the
 * two are equivalent — a text input matches `:focus-visible` on click too — and
 * `focus-within` is a native variant that reliably compiles, whereas the
 * `has-[:focus-visible]` arbitrary variant isn't extracted from this TS source.
 */
export const kunFocusRingWithinClasses: Record<KunUIColor, string> = {
  default: 'focus-within:ring-2 focus-within:ring-default/50',
  primary: 'focus-within:ring-2 focus-within:ring-primary/50',
  secondary: 'focus-within:ring-2 focus-within:ring-secondary/50',
  success: 'focus-within:ring-2 focus-within:ring-success/50',
  warning: 'focus-within:ring-2 focus-within:ring-warning/50',
  danger: 'focus-within:ring-2 focus-within:ring-danger/50',
  info: 'focus-within:ring-2 focus-within:ring-info/50',
}

// Very light tint of the semantic color — "selected card" backgrounds in
// RadioGroup and any "barely there" colored fill. Keys are static literals.
export const kunSoftBgClasses: Record<KunUIColor, string> = {
  default: 'bg-default/5',
  primary: 'bg-primary/5',
  secondary: 'bg-secondary/5',
  success: 'bg-success/5',
  warning: 'bg-warning/5',
  danger: 'bg-danger/5',
  info: 'bg-info/5',
}
