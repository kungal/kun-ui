import raw from './en.json'
import type { KunMessageCatalog } from './types'

// Its own entry point (`@kungal/ui-core/locale/en`) so a zh-CN app never
// bundles it. Every locale after this one follows the same shape.
export const KUN_CATALOG_EN: KunMessageCatalog = raw
