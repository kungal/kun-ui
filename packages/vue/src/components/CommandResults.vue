<script setup lang="ts" generic="T extends KunCommandItem = KunCommandItem">
import { cn } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import { useKunLocale } from '../locale/useKunLocale'
import { commandItemKey, type KunCommandRowGroup } from '../utils/commandItems'
import type { KunCommandItem } from './types'

defineOptions({ name: 'KunCommandResults' })

const { t } = useKunLocale()

const props = defineProps<{
  rows: KunCommandRowGroup<T>[]
  activeIndex: number
  uid: string
  highlight: (text: string) => string
  /** -1 keeps the options out of the tab order (KunCommandSearch: focus never
   *  leaves its field). */
  optionTabindex?: number
}>()

const emit = defineEmits<{
  select: [item: T]
  hover: [index: number]
  remove: [item: T, index: number]
}>()

defineSlots<{
  item?: (props: {
    item: T
    active: boolean
    index: number
    highlight: (text: string) => string
  }) => unknown
}>()

const optionId = (index: number) => `${props.uid}-opt-${index}`
</script>

<template>
  <div
    v-for="(group, gi) in rows"
    :key="gi"
    :role="group.label ? 'group' : undefined"
    :aria-labelledby="group.label ? `${uid}-group-${gi}` : undefined"
    class="mb-1 last:mb-0"
  >
    <div
      v-if="group.label"
      :id="`${uid}-group-${gi}`"
      class="text-foreground-muted px-3 pt-2 pb-1 text-xs font-medium"
    >
      {{ group.label }}
    </div>
    <component
      :is="row.item.href ? 'a' : 'button'"
      v-for="row in group.items"
      :id="optionId(row.index)"
      :key="commandItemKey(row.item)"
      :href="row.item.href || undefined"
      :type="row.item.href ? undefined : 'button'"
      :tabindex="optionTabindex"
      role="option"
      :data-active="row.index === activeIndex"
      :aria-selected="row.index === activeIndex"
      :aria-disabled="row.item.disabled || undefined"
      :aria-keyshortcuts="row.item.removable ? 'Shift+Delete' : undefined"
      :class="
        cn(
          'flex w-full cursor-pointer items-center gap-3 rounded-kun-md px-3 py-2 text-left transition-colors',
          row.index === activeIndex ? 'bg-primary/10' : 'hover:bg-default-100',
          row.item.disabled && 'pointer-events-none opacity-50'
        )
      "
      @click="emit('select', row.item)"
      @mousemove="!row.item.disabled && row.index !== activeIndex && emit('hover', row.index)"
    >
      <slot
        name="item"
        :item="row.item"
        :active="row.index === activeIndex"
        :index="row.index"
        :highlight="highlight"
      >
        <KunIcon v-if="row.item.icon" :name="row.item.icon" class="text-default-500 shrink-0" />
        <span class="min-w-0 flex-1">
          <span v-if="row.item.section" class="text-foreground-muted mb-0.5 block text-xs">{{
            row.item.section
          }}</span>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span
            class="text-foreground block truncate text-sm font-medium"
            v-html="highlight(row.item.label)"
          />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span
            v-if="row.item.description"
            class="text-foreground-muted mt-0.5 block truncate text-xs"
            v-html="highlight(row.item.description)"
          />
        </span>
      </slot>
      <!-- Pointer-only: a control inside an option is not reachable by a screen
           reader, so the keyboard path is Shift+Delete (aria-keyshortcuts). A
           span, because the option itself is often a <button>. -->
      <span
        v-if="row.item.removable && !row.item.disabled"
        aria-hidden="true"
        :title="t('commandPalette.remove')"
        class="text-default-400 hover:text-default-700 hover:bg-default-200 -mr-1 flex size-6 shrink-0 items-center justify-center rounded-kun-sm transition-colors"
        @mousedown.prevent
        @click.stop.prevent="emit('remove', row.item, row.index)"
      >
        <KunIcon name="lucide:x" class="size-3.5" />
      </span>
    </component>
  </div>
</template>
