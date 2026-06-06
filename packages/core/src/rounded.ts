import type { KunUIRounded } from './types'

// Static class map for the 5-bucket Kun radius system. All keys are literal
// strings so the Tailwind JIT picks them up — the `rounded-kun-*` utilities
// come from the --radius-kun-* tokens shipped by @kun/tokens.
export const kunRoundedClasses: Record<KunUIRounded, string> = {
  none: 'rounded-kun-none',
  sm: 'rounded-kun-sm',
  md: 'rounded-kun-md',
  lg: 'rounded-kun-lg',
  full: 'rounded-kun-full',
}

// Global default radius bucket (matches the source layer's behaviour where
// the un-configured fallback is 'md'). A render layer's config provider may
// override this per subtree.
export const KUN_DEFAULT_ROUNDED: KunUIRounded = 'md'

// Pure precedence resolver for a component's effective radius:
//   prop  >  component built-in fallback  >  app/provider default
//
// This is the framework-agnostic core of the original Vue
// `useResolvedRounded` composable. Each render layer wraps it in its own
// reactivity primitive:
//   Vue:   computed(() => resolveRounded(props.rounded, fallback, cfg.rounded))
//   React: useMemo(() => resolveRounded(rounded, fallback, cfg.rounded), [...])
export const resolveRounded = (
  prop: KunUIRounded | undefined,
  fallback: KunUIRounded | undefined,
  configDefault: KunUIRounded = KUN_DEFAULT_ROUNDED
): KunUIRounded => prop ?? fallback ?? configDefault
