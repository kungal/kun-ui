// The Vue layer's view of a locale. The strings themselves live in
// @kungal/ui-core (framework-free data, and the source the kun_ui_messages pub
// package is generated from); what this layer adds is the one part of a locale
// that cannot cross to another render layer — a date-fns locale object.
import type { Locale as KunDateFnsLocale } from 'date-fns'
import type { KunMessageCatalog } from '@kungal/ui-core'

export type {
  KunMessages,
  KunMessageCatalog,
  KunMessagePath,
} from '@kungal/ui-core'

export interface KunLocale extends KunMessageCatalog {
  /** date-fns locale backing the calendar grid — weekday and month names, and
   *  the full date each day cell announces. Omit it and KunDatePicker falls
   *  back to `code` (it knows `zh-CN` / `ja` / `en`), then to `en-US`. Supply
   *  it for any other language: the grid is dates, not strings, so `messages`
   *  alone cannot localize it. */
  dateLocale?: KunDateFnsLocale
}

export const defineKunLocale = (locale: KunLocale): KunLocale => locale
