import raw from './zh-CN.json'
import type { KunMessageCatalog } from './types'

// KunUI's built-in default. The strings are the ones the components used to
// hold inline, reproduced verbatim, so adopting the locale system changed no
// rendered output.
//
// The catalog is JSON rather than a TypeScript literal because one file feeds
// both the web bundle and the generated kun_ui_messages pub package, and a
// Node generator can read JSON without evaluating TypeScript. The annotation
// below is what type-checks it: a key missing from KunMessages fails the build.
export const KUN_CATALOG_ZH_CN: KunMessageCatalog = raw
