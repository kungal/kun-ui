import type { ComputedRef, InjectionKey } from 'vue'

export type KunTabMount = 'eager' | 'lazy' | 'unmount'
export type KunTabHiddenStrategy = 'until-found' | 'display'

// Shared between <KunTabPanels> (provider) and <KunTabPanel> (child). A panel
// works standalone via its own props too; the context only supplies defaults +
// the active value when the wrapper is used.
export interface KunTabPanelsContext {
  active: ComputedRef<string | undefined>
  activate: (value: string) => void
  mount: ComputedRef<KunTabMount>
  hiddenStrategy: ComputedRef<KunTabHiddenStrategy>
  name: ComputedRef<string | undefined>
}

export const KUN_TAB_PANELS: InjectionKey<KunTabPanelsContext> =
  Symbol('kun-tab-panels')

// Tabs and panels link their ARIA ids off the tab `value` (+ an optional shared
// `name` so several tab groups on one page don't collide).
export const kunTabId = (name: string | undefined, value: string) =>
  `${name ?? 'kun'}-tab-${value}`
export const kunTabPanelId = (name: string | undefined, value: string) =>
  `${name ?? 'kun'}-tabpanel-${value}`
