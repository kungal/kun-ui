import type { ComputedRef, InjectionKey } from 'vue'

export type KunAccordionVariant = 'light' | 'bordered' | 'splitted'
export type KunAccordionSize = 'sm' | 'md'

// Shared between <KunAccordion> (provider, owns the open set) and
// <KunAccordionItem> (reads its own open state + toggles).
export interface KunAccordionContext {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
  variant: ComputedRef<KunAccordionVariant>
  size: ComputedRef<KunAccordionSize>
}

export const KUN_ACCORDION: InjectionKey<KunAccordionContext> =
  Symbol('kun-accordion')
