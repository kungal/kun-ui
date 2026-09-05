<script setup lang="ts" generic="T extends KunAutocompleteOption = KunAutocompleteOption">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { size as floatingSize } from '@floating-ui/vue'
import {
  cn,
  kunRoundedClasses,
  kunControlSizeClasses,
  kunFocusRingClasses,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunFloating } from '../composables/useKunFloating'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { useKunFloatingLayer } from '../composables/useKunFloatingLayer'
import { scrollItemIntoView } from '../utils/scrollItemIntoView'
import { isImeComposing } from '../utils/imeComposition'
import KunIcon from './Icon.vue'
import KunLoading from './Loading.vue'
import type { KunAutocompleteOption, KunAutocompleteProps } from './types'

// A combobox: a text field with a suggestion list. v-model is the field text
// (equals the picked option's label after a selection); @select carries the
// full option so the parent can read `.value`; @search fires per keystroke for
// remote/async sources (pair with `manualFilter`).
defineOptions({ name: 'KunAutocomplete', inheritAttrs: false })

const props = withDefaults(defineProps<KunAutocompleteProps<T>>(), {
  label: '',
  placeholder: '',
  error: '',
  description: '',
  isInvalid: false,
  disabled: false,
  size: 'md',
  rounded: undefined,
  darkBorder: true,
  color: 'default',
  clearable: false,
  allowCustomValue: true,
  manualFilter: false,
  noResultText: '无匹配项',
  loading: false,
  loadingText: '加载中…',
  debounce: 0,
  name: undefined,
  ariaLabel: '',
})

const modelValue = defineModel<string>({ default: '' })

const emit = defineEmits<{
  select: [option: T]
  search: [query: string]
}>()

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])
const kunUniqueId = useKunUniqueId('kun-autocomplete')
const listId = computed(() => `${kunUniqueId.value}-listbox`)

const invalid = computed(() => !!props.error || props.isInvalid)

const isOpen = ref(false)
const activeIndex = ref(-1)
// `dirty` = the user typed since the last selection/open, so we should filter.
const dirty = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
useKunFloatingLayer(dropdownRef, { trigger: triggerRef })
const listRef = ref<HTMLElement | null>(null)

const { floatingStyles, transformOrigin } = useKunFloating(triggerRef, dropdownRef, {
  placement: 'bottom-start',
  open: isOpen,
  offset: 4,
  middleware: [
    floatingSize({
      apply({ rects, elements, availableHeight }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
          maxHeight: `${Math.min(280, availableHeight - 8)}px`,
        })
      },
    }),
  ],
})

// Filtering takes the query as an argument because `modelValue` is a defineModel
// ref: with v-model bound on the parent, reading it back in the same tick still
// returns the pre-keystroke text (vuejs/core#11832, closed as expected behaviour
// — the value only comes back after the parent re-renders). onInput needs the
// list for the text that was *just* typed.
const filterOptions = (query: string) => {
  if (props.manualFilter || !query.trim()) return props.options
  const q = query.trim().toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
}

const filtered = computed(() =>
  dirty.value ? filterOptions(modelValue.value) : props.options
)

const activeId = computed(() =>
  activeIndex.value >= 0 && filtered.value[activeIndex.value]
    ? `${kunUniqueId.value}-opt-${activeIndex.value}`
    : undefined
)

const firstEnabledOf = (list: readonly T[]) => list.findIndex((o) => !o.disabled)
const firstEnabled = () => firstEnabledOf(filtered.value)

const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  activeIndex.value = firstEnabled()
}
const close = () => {
  isOpen.value = false
}

const scrollActiveIntoView = () => {
  nextTick(() => {
    scrollItemIntoView(
      listRef.value,
      listRef.value?.querySelector(`[data-index="${activeIndex.value}"]`)
    )
  })
}

const moveActive = (dir: 1 | -1) => {
  const n = filtered.value.length
  if (!n) return
  let i = activeIndex.value
  for (let step = 0; step < n; step++) {
    i = (i + dir + n) % n
    if (!filtered.value[i]!.disabled) {
      activeIndex.value = i
      break
    }
  }
  scrollActiveIntoView()
}

// Emit `@search`, debounced by `props.debounce` (the input text itself always
// updates instantly — only the parent notification waits). `immediate` skips the
// wait for resets (clear / blur) so they fire at once, and supersedes any pending
// keystroke emit.
// While a debounce timer is armed we're "about to search": `pending` surfaces the
// spinner and suppresses `noResultText` so the gap before the request fires never
// flashes "no matches". With `debounce: 0` (default) it's never set, so behaviour
// is unchanged. `props.loading` (the real, parent-driven request) does the same.
const pending = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | null = null
const cancelPendingSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }
  pending.value = false
}
const emitSearch = (q: string, immediate = false) => {
  cancelPendingSearch()
  if (immediate || props.debounce <= 0) {
    emit('search', q)
    return
  }
  pending.value = true
  searchTimer = setTimeout(() => {
    searchTimer = null
    pending.value = false
    emit('search', q)
  }, props.debounce)
}
onBeforeUnmount(cancelPendingSearch)

// Spinner shows for the real request (`loading`) and the pre-request debounce gap.
const showSpinner = computed(() => props.loading || pending.value)

const selectOption = (option: T) => {
  if (option.disabled) return
  // Drop any pending keystroke search so it can't refetch with the pre-selection
  // query right after the user committed a choice.
  cancelPendingSearch()
  modelValue.value = option.label
  dirty.value = false
  emit('select', option)
  close()
  nextTick(() => inputRef.value?.focus({ preventScroll: true }))
}

const onInput = (e: Event) => {
  // Everything here runs off `value`, never off `modelValue.value` (see
  // filterOptions): @search used to fire one keystroke behind — typing "key"
  // searched "", "k", "ke" — and the highlight was the first enabled row of the
  // *previous* query's list, so Enter could commit an option the user never saw
  // highlighted.
  const value = (e.target as HTMLInputElement).value
  modelValue.value = value
  dirty.value = true
  emitSearch(value)
  open()
  activeIndex.value = firstEnabledOf(filterOptions(value))
}

const onKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return
  if (isImeComposing(e)) return
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (!isOpen.value) open()
      else moveActive(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      if (isOpen.value) moveActive(-1)
      break
    case 'Enter':
      if (isOpen.value && filtered.value[activeIndex.value]) {
        e.preventDefault()
        selectOption(filtered.value[activeIndex.value]!)
      }
      break
    case 'Escape':
      if (isOpen.value) {
        e.preventDefault()
        close()
      }
      break
    case 'Tab':
      close()
      break
  }
}

const onBlur = () => {
  // Defer so a click on an option still registers before we validate.
  setTimeout(() => {
    if (
      !props.allowCustomValue &&
      modelValue.value &&
      !props.options.some(
        (o) => o.label.toLowerCase() === modelValue.value.toLowerCase()
      )
    ) {
      modelValue.value = ''
      emitSearch('', true)
    }
  }, 120)
}

const clear = () => {
  modelValue.value = ''
  dirty.value = true
  emitSearch('', true)
  nextTick(() => inputRef.value?.focus({ preventScroll: true }))
  open()
}

onClickOutside(triggerRef, (event) => {
  if (dropdownRef.value?.contains(event.target as Node)) return
  close()
})

watch(filtered, () => {
  if (!isOpen.value) return
  if (
    activeIndex.value < 0 ||
    activeIndex.value >= filtered.value.length ||
    filtered.value[activeIndex.value]?.disabled
  ) {
    activeIndex.value = firstEnabled()
  }
})

defineExpose({
  focus: (options?: FocusOptions) => inputRef.value?.focus(options),
  blur: () => inputRef.value?.blur(),
})
</script>

<template>
  <div :class="cn('relative w-full')">
    <label
      v-if="label"
      :for="kunUniqueId"
      class="text-default-700 mb-1 block text-sm font-medium"
    >
      {{ label }}
    </label>

    <div ref="triggerRef" class="relative">
      <input
        :id="kunUniqueId"
        ref="inputRef"
        enterkeyhint="done"
        v-bind="$attrs"
        :value="modelValue"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        :aria-controls="listId"
        :aria-expanded="isOpen"
        :aria-activedescendant="isOpen ? activeId : undefined"
        :aria-label="ariaLabel || (label ? undefined : 'autocomplete')"
        :aria-invalid="invalid || undefined"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="off"
        :class="
          cn(
            'block w-full bg-content1 shadow-kun-sm border transition-[color,box-shadow]',
            roundedClass,
            kunControlSizeClasses[size],
            clearable && modelValue ? 'pr-9' : '',
            invalid
              ? cn('border-danger-300', kunFocusRingClasses.danger)
              : cn('border-kun', kunFocusRingClasses[color]),
            disabled && 'cursor-not-allowed opacity-60'
          )
        "
        @input="onInput"
        @focus="open"
        @click="open"
        @keydown="onKeydown"
        @blur="onBlur"
      />
      <button
        v-if="clearable && modelValue && !disabled"
        type="button"
        tabindex="-1"
        class="text-default-400 hover:text-default-600 absolute inset-y-0 right-0 flex items-center pr-3"
        aria-label="清除"
        @click="clear"
      >
        <KunIcon name="lucide:circle-x" class="size-4" />
      </button>
    </div>

    <input v-if="name" type="hidden" :name="name" :value="modelValue" />

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-kun-base ease-kun-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-kun-exit ease-kun-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen && (filtered.length || dirty || showSpinner)"
          ref="dropdownRef"
          data-kun-overlay
          :style="[floatingStyles, { transformOrigin }]"
          :class="
            cn(
              'bg-content1 z-kun-popover flex flex-col overflow-hidden p-1 shadow-kun-md',
              roundedClass
            )
          "
        >
          <ul
            ref="listRef"
            :id="listId"
            class="scrollbar-hide min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-kun-sm text-sm"
            role="listbox"
            :aria-busy="showSpinner || undefined"
          >
            <!-- Async in flight (or debounce armed): a spinner instead of options
                 / noResultText, so a pending fetch never reads as "no matches". -->
            <li v-if="showSpinner" class="flex justify-center px-3 py-6">
              <KunLoading spinner size="sm" :description="loadingText" />
            </li>

            <template v-else>
              <li
                v-for="(option, index) in filtered"
                :id="`${kunUniqueId}-opt-${index}`"
                :key="option.value"
                :data-index="index"
                class="text-foreground relative flex items-center gap-2 rounded-kun-md px-3 py-2 select-none"
                :class="[
                  option.disabled
                    ? 'text-default-300 cursor-not-allowed'
                    : 'cursor-pointer',
                  index === activeIndex && !option.disabled ? 'bg-default-100' : '',
                ]"
                role="option"
                :aria-selected="index === activeIndex"
                :aria-disabled="option.disabled || undefined"
                @click="selectOption(option)"
                @mousemove="!option.disabled && (activeIndex = index)"
                @mousedown.prevent
              >
                <!-- Custom item rendering: pass an option shape with extra fields
                     (avatar, description, …) and read them here. Defaults to the
                     plain label. The flex-1 wrapper lets rich content (avatar +
                     text) lay out as a row. -->
                <div class="flex min-w-0 flex-1 items-center gap-2">
                  <slot
                    name="option"
                    :option="option"
                    :index="index"
                    :active="index === activeIndex"
                    :selected="option.label === modelValue"
                  >
                    <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
                  </slot>
                </div>
              </li>

              <li
                v-if="!filtered.length"
                class="text-default-400 px-3 py-6 text-center text-sm"
              >
                {{ noResultText }}
              </li>
            </template>
          </ul>
        </div>
      </Transition>
    </Teleport>

    <p v-if="error" class="text-danger mt-1 text-sm">{{ error }}</p>
    <p v-else-if="description" class="text-default-500 mt-1 text-sm">
      {{ description }}
    </p>
  </div>
</template>
