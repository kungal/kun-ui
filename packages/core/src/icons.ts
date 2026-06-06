import { KUN_BUNDLED_ICONS } from './icons-data'

// Iconify-compatible icon shape: `body` is the inner SVG markup (using
// `currentColor`), rendered into a `0 0 width height` viewBox (default 24).
export interface KunIconData {
  body: string
  width?: number
  height?: number
}

// The registry is SEEDED with KunUI's bundled internal icons (referenced via
// the data import, so it is never tree-shaken away — no side-effect needed).
// Consumers add their own icons with registerKunIcon(s). KunIcon renders from
// this registry and NEVER fetches from a network/API.
const registry = new Map<string, KunIconData>(Object.entries(KUN_BUNDLED_ICONS))

export const registerKunIcon = (name: string, data: KunIconData): void => {
  registry.set(name, data)
}

// Bulk register — pass a Record<name, data>, e.g. icons extracted from
// `@iconify-json/*` at build time, or your own custom SVGs.
export const registerKunIcons = (
  icons: Record<string, KunIconData>
): void => {
  for (const [name, data] of Object.entries(icons)) registry.set(name, data)
}

export const getKunIcon = (name: string): KunIconData | undefined =>
  registry.get(name)

export const hasKunIcon = (name: string): boolean => registry.has(name)
