<script setup lang="ts" generic="T extends KunSelectValue = KunSelectValue, O extends KunSelectOption<T> = KunSelectOption<T>">
import { computed, nextTick, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { size } from '@floating-ui/vue'
import {
  cn,
  kunRoundedClasses,
  kunControlSizeClasses,
  kunFocusRingClasses,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunFloating } from '../composables/useKunFloating'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { scrollItemIntoView } from '../utils/scrollItemIntoView'
import KunIcon from './Icon.vue'
import type { KunSelectOption, KunSelectProps, KunSelectValue } from './types'

defineOptions({ name: 'KunSelect' })

const props = withDefaults(defineProps<KunSelectProps<T, O>>(), {
  placeholder: '',
  label: '',
  disabled: false,
  error: '',
  description: '',
  darkBorder: true,
  color: 'default',
  ariaLabel: '',
  className: '',
  rounded: undefined,
  size: 'md',
  multiple: false,
  searchable: false,
  clearable: false,
  searchPlaceholder: '搜索…',
  noResultText: '无匹配项',
  name: undefined,
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

// null/[] represents "nothing selected"; single = scalar, multiple = array.
const modelValue = defineModel<T | T[] | null>({ required: true })

const emit = defineEmits<{
  set: [value: T, index: number]
}>()

const kunUniqueId = useKunUniqueId('kun-select')
const listId = computed(() => `${kunUniqueId.value}-listbox`)
const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(-1)
const buttonRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)

const { floatingStyles, transformOrigin } = useKunFloating(buttonRef, dropdownRef, {
  placement: 'bottom-start',
  open: isOpen,
  offset: 4,
  middleware: [
    // Match dropdown width to the trigger; cap height to viewport so the
    // list scrolls instead of overflowing.
    size({
      apply({ rects, elements, availableHeight }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
          maxHeight: `${Math.min(280, availableHeight - 8)}px`,
        })
      },
    }),
  ],
})

// ── selection model ──────────────────────────────────────────────────────
const selected = computed<T[]>(() => {
  const v = modelValue.value
  if (props.multiple) return Array.isArray(v) ? v : []
  return v === undefined || v === null ? [] : [v as T]
})
const selectedSet = computed(() => new Set<KunSelectValue>(selected.value))
const selectedOptions = computed(() =>
  props.options.filter((o) => selectedSet.value.has(o.value))
)
const singleLabel = computed(() => selectedOptions.value[0]?.label ?? '')
const hasSelection = computed(() => selected.value.length > 0)

// ── filtering ──────────────────────────────────────────────────────────
const filtered = computed(() => {
  if (!props.searchable || !query.value.trim()) return props.options
  const q = query.value.trim().toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

const activeId = computed(() =>
  activeIndex.value >= 0 && filtered.value[activeIndex.value]
    ? `${kunUniqueId.value}-opt-${activeIndex.value}`
    : undefined
)

const firstEnabled = (from = 0, dir = 1) => {
  const list = filtered.value
  for (let i = from; i >= 0 && i < list.length; i += dir) {
    if (!list[i]!.disabled) return i
  }
  return -1
}

// ── open / close ─────────────────────────────────────────────────────────
const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  query.value = ''
  // Start on the (first) selected option, else the first enabled one.
  const sel = filtered.value.findIndex((o) => selectedSet.value.has(o.value))
  activeIndex.value = sel >= 0 ? sel : firstEnabled()
  nextTick(() => {
    // preventScroll: the search field lives in the teleported dropdown, which
    // is momentarily at (0,0) before floating-ui's first measurement — a plain
    // focus() would scroll the page to the top. floating-ui handles visibility.
    if (props.searchable) searchRef.value?.focus({ preventScroll: true })
    scrollActiveIntoView()
  })
}

const close = (returnFocus = true) => {
  if (!isOpen.value) return
  isOpen.value = false
  query.value = ''
  if (returnFocus) nextTick(() => buttonRef.value?.focus({ preventScroll: true }))
}

const toggle = () => (isOpen.value ? close() : open())

onClickOutside(buttonRef, (event) => {
  if (dropdownRef.value?.contains(event.target as Node)) return
  close(false)
})

// ── selection actions ────────────────────────────────────────────────────
const selectOption = (option: O) => {
  if (option.disabled) return
  const origIndex = props.options.findIndex((o) => o.value === option.value)
  if (props.multiple) {
    const cur = Array.isArray(modelValue.value) ? [...modelValue.value] : []
    const at = cur.indexOf(option.value)
    if (at >= 0) cur.splice(at, 1)
    else cur.push(option.value)
    modelValue.value = cur
    if (props.searchable) nextTick(() => searchRef.value?.focus({ preventScroll: true }))
  } else {
    modelValue.value = option.value
    close()
  }
  emit('set', option.value, origIndex)
}

const selectActive = () => {
  const opt = filtered.value[activeIndex.value]
  if (opt) selectOption(opt)
}

const removeValue = (value: T) => {
  if (props.disabled) return
  const cur = Array.isArray(modelValue.value) ? [...modelValue.value] : []
  modelValue.value = cur.filter((v) => v !== value)
}

const clearAll = () => {
  if (props.disabled) return
  modelValue.value = props.multiple ? [] : null
}

// ── keyboard ─────────────────────────────────────────────────────────────
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

const setEdgeActive = (dir: 1 | -1) => {
  activeIndex.value = dir === 1 ? firstEnabled(0, 1) : firstEnabled(filtered.value.length - 1, -1)
  scrollActiveIntoView()
}

// type-ahead for the non-searchable listbox.
let typeBuffer = ''
let typeTimer: ReturnType<typeof setTimeout> | null = null
const typeahead = (char: string) => {
  typeBuffer += char.toLowerCase()
  if (typeTimer) clearTimeout(typeTimer)
  typeTimer = setTimeout(() => (typeBuffer = ''), 600)
  const i = props.options.findIndex(
    (o) => !o.disabled && o.label.toLowerCase().startsWith(typeBuffer)
  )
  if (i >= 0) {
    activeIndex.value = i
    scrollActiveIntoView()
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return
  const key = e.key
  if (!isOpen.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
      e.preventDefault()
      open()
    }
    return
  }
  switch (key) {
    case 'ArrowDown':
      e.preventDefault()
      moveActive(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      moveActive(-1)
      break
    case 'Home':
      e.preventDefault()
      setEdgeActive(1)
      break
    case 'End':
      e.preventDefault()
      setEdgeActive(-1)
      break
    case 'Enter':
      e.preventDefault()
      selectActive()
      break
    case ' ':
      // In a search field a space types; in the plain listbox it selects.
      if (!props.searchable) {
        e.preventDefault()
        selectActive()
      }
      break
    case 'Escape':
      e.preventDefault()
      close()
      break
    case 'Tab':
      close(false)
      break
    default:
      if (
        !props.searchable &&
        key.length === 1 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        typeahead(key)
      }
  }
}

// Filtering shifts indices — keep `active` on a valid, enabled row.
watch(filtered, () => {
  if (!isOpen.value) return
  if (activeIndex.value < 0 || activeIndex.value >= filtered.value.length) {
    activeIndex.value = firstEnabled()
  } else if (filtered.value[activeIndex.value]?.disabled) {
    activeIndex.value = firstEnabled()
  }
})
</script>

<template>
  <div :class="cn('relative w-full', props.className)">
    <label
      v-if="label"
      :id="`${kunUniqueId}-label`"
      :for="kunUniqueId"
      class="text-default-700 mb-1 block text-sm font-medium"
    >
      {{ label }}
    </label>

    <div
      ref="buttonRef"
      :id="kunUniqueId"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-label="ariaLabel || (label ? undefined : 'select')"
      :aria-labelledby="label ? `${kunUniqueId}-label` : undefined"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="listId"
      :aria-activedescendant="isOpen ? activeId : undefined"
      :aria-disabled="disabled || undefined"
      :class="
        cn(
          'flex w-full cursor-pointer items-center justify-between gap-2 text-left transition-[color,box-shadow]',
          kunControlSizeClasses[props.size],
          roundedClass,
          'bg-content1 shadow-kun-sm border',
          error
            ? cn('border-danger-300', kunFocusRingClasses.danger)
            : cn('border-kun', kunFocusRingClasses[color]),
          disabled && 'cursor-not-allowed opacity-60'
        )
      "
      @click="toggle"
      @keydown="onKeydown"
    >
      <!-- Multiple: removable chips -->
      <span v-if="multiple && hasSelection" class="flex min-w-0 flex-1 flex-wrap gap-1">
        <span
          v-for="opt in selectedOptions"
          :key="String(opt.value)"
          class="bg-default-100 text-default-700 inline-flex max-w-full items-center gap-1 rounded-kun-sm px-1.5 py-0.5 text-xs"
        >
          <span class="truncate">{{ opt.label }}</span>
          <button
            v-if="!disabled"
            type="button"
            class="hover:text-danger shrink-0"
            :aria-label="`移除 ${opt.label}`"
            @click.stop="removeValue(opt.value)"
            @mousedown.stop.prevent
          >
            <KunIcon name="lucide:x" class="size-3" />
          </button>
        </span>
      </span>

      <!-- Single: label or placeholder -->
      <span v-else class="block min-w-0 flex-1 truncate" :class="!hasSelection && 'text-default-400'">
        {{ multiple ? placeholder : singleLabel || placeholder }}
      </span>

      <button
        v-if="clearable && hasSelection && !disabled"
        type="button"
        class="text-default-400 hover:text-default-600 shrink-0"
        aria-label="清除"
        @click.stop="clearAll"
        @mousedown.stop.prevent
      >
        <KunIcon name="lucide:circle-x" class="size-4" />
      </button>
      <KunIcon
        name="lucide:chevron-down"
        class="pointer-events-none shrink-0 transition-transform"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </div>

    <!-- Hidden native fields so the value is collected by a surrounding <form>. -->
    <template v-if="name">
      <input
        v-for="v in selected"
        :key="`hidden-${String(v)}`"
        type="hidden"
        :name="name"
        :value="String(v)"
      />
      <input v-if="!hasSelection" type="hidden" :name="name" value="" />
    </template>

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
          v-if="isOpen"
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
          <div v-if="searchable" class="p-1">
            <input
              ref="searchRef"
              v-model="query"
              type="text"
              enterkeyhint="done"
              :placeholder="searchPlaceholder"
              role="combobox"
              :aria-controls="listId"
              :aria-expanded="isOpen"
              :aria-activedescendant="activeId"
              :class="
                cn(
                  'bg-content1 shadow-kun-sm border-kun w-full rounded-kun-sm border px-2.5 py-1.5 text-sm',
                  kunFocusRingClasses[color]
                )
              "
              @keydown="onKeydown"
            />
          </div>

          <ul
            ref="listRef"
            :id="listId"
            class="scrollbar-hide min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-kun-sm text-sm focus:outline-none"
            tabindex="-1"
            role="listbox"
            :aria-multiselectable="multiple || undefined"
          >
            <li
              v-for="(option, index) in filtered"
              :id="`${kunUniqueId}-opt-${index}`"
              :key="String(option.value)"
              :data-index="index"
              class="text-foreground relative flex items-center gap-2 rounded-kun-md px-3 py-2 select-none"
              :class="[
                option.disabled
                  ? 'text-default-300 cursor-not-allowed'
                  : 'cursor-pointer',
                index === activeIndex && !option.disabled ? 'bg-default-100' : '',
              ]"
              role="option"
              :aria-selected="selectedSet.has(option.value)"
              :aria-disabled="option.disabled || undefined"
              @click="selectOption(option)"
              @mousemove="!option.disabled && (activeIndex = index)"
            >
              <!-- Custom item rendering: pass an option shape with extra fields
                   (avatar, description, …) and read them here. Defaults to the
                   plain label. The flex-1 wrapper lets rich content (avatar +
                   text) group at the left while the check stays at the right. -->
              <div class="flex min-w-0 flex-1 items-center gap-2">
                <slot
                  name="option"
                  :option="option"
                  :index="index"
                  :active="index === activeIndex"
                  :selected="selectedSet.has(option.value)"
                >
                  <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
                </slot>
              </div>
              <KunIcon
                v-if="selectedSet.has(option.value)"
                name="lucide:check"
                class="text-primary shrink-0"
              />
            </li>

            <li
              v-if="!filtered.length"
              class="text-default-400 px-3 py-6 text-center text-sm"
            >
              {{ noResultText }}
            </li>
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
