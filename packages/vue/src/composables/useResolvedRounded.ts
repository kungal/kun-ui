import { computed, type ComputedRef } from 'vue'
import { resolveRounded, type KunUIRounded } from '@kungal/ui-core'
import { useKunUIConfig } from '../config/useKunUIConfig'

// Vue reactive wrapper around @kungal/ui-core's pure `resolveRounded`. Pass the
// prop accessor as a function so reactivity tracking works inside computed.
//
//   const rounded = useResolvedRounded(() => props.rounded)        // prop > provider > default
//   const rounded = useResolvedRounded(() => props.rounded, 'lg')  // with component built-in
//
// `fallback` lets a component set its own built-in default (e.g. Modal 'lg',
// Input 'md') while still deferring to the provider/global default when the
// prop is absent.
export const useResolvedRounded = (
  propValue: () => KunUIRounded | undefined,
  fallback?: KunUIRounded
): ComputedRef<KunUIRounded> => {
  const config = useKunUIConfig()
  return computed(() => resolveRounded(propValue(), fallback, config.rounded))
}
