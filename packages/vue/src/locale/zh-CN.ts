import { KUN_CATALOG_ZH_CN } from '@kungal/ui-core'
import { zhCN as zhCNDates } from 'date-fns/locale'
import type { KunLocale } from './types'

// KunUI's built-in default.
const zhCN: KunLocale = { ...KUN_CATALOG_ZH_CN, dateLocale: zhCNDates }

export default zhCN
