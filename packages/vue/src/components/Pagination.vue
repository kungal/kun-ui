<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { cn, kunFocusRingClasses } from '@kungal/ui-core'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type { KunPaginationProps } from './types'

defineOptions({ name: 'KunPagination' })

const props = defineProps<KunPaginationProps>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const jumpToPage = ref('')
const kunUniqueId = useKunUniqueId('kun-pagination')

// The RENDERED window is decoupled from `currentPage`: during the "highlight
// leads" animation for middle pages the layout lags one step behind the active
// page (see the two-phase watch). `windowPage` drives what's shown; `currentPage`
// drives which button is active.
const windowPage = ref(props.currentPage)

interface PageItem {
  key: string
  page: number | null // null = an ellipsis gap
}
const displayedPages = computed<PageItem[]>(() => {
  const items: PageItem[] = []
  const push = (page: number) => items.push({ key: `p${page}`, page })
  const gap = (side: 'l' | 'r') => items.push({ key: `gap-${side}`, page: null })
  const cur = windowPage.value
  const total = props.totalPage
  const maxVisiblePages = 7

  if (total <= maxVisiblePages) {
    for (let i = 1; i <= total; i++) push(i)
    return items
  }

  push(1)
  if (cur > 3) gap('l')

  let start = Math.max(2, cur - 1)
  let end = Math.min(total - 1, cur + 1)
  if (cur <= 3) end = Math.min(total - 1, 4)
  if (cur >= total - 2) start = Math.max(2, total - 3)

  for (let i = start; i <= end; i++) push(i)

  if (cur < total - 2) gap('r')
  push(total)

  return items
})

const handlePageChange = (page: number) => {
  if (props.isLoading || page === props.currentPage) return
  emit('update:currentPage', page)
}

const handleJumpToPage = () => {
  if (props.isLoading) return
  const page = parseInt(jumpToPage.value)
  if (page && page >= 1 && page <= props.totalPage) {
    emit('update:currentPage', page)
    jumpToPage.value = ''
  }
}

// ── Sliding active-page indicator (mirrors KunTab's measured indicator) ──────
// A single primary pill is absolutely positioned inside the number-button row
// and slides to the active page (transform + width transition) instead of each
// button toggling a solid fill. Measured from the DOM (offsetLeft/Width), so it
// can't exist in SSR HTML — until mount the active page falls back to a real
// solid KunButton (see the template's variant + `showIndicator`).
const pagesRef = ref<HTMLElement | null>(null)
const pageEls = ref<Record<number, HTMLElement>>({})
const setPageRef = (el: unknown, page: number) => {
  const node =
    el && typeof el === 'object' && '$el' in (el as object)
      ? ((el as { $el?: Element }).$el ?? null)
      : (el as Element | null)
  if (node instanceof HTMLElement) pageEls.value[page] = node
}

const indicatorStyle = ref<Record<string, string>>({})
const updateIndicator = () => {
  const el = pageEls.value[props.currentPage]
  if (!el || !pagesRef.value) {
    indicatorStyle.value = {}
    return
  }
  indicatorStyle.value = {
    transform: `translate(${el.offsetLeft}px, ${el.offsetTop}px)`,
    width: `${el.offsetWidth}px`,
    height: `${el.offsetHeight}px`,
  }
}

const hasMounted = ref(false)
const showIndicator = computed(
  () => hasMounted.value && Object.keys(indicatorStyle.value).length > 0
)

// Bumped on every page change so the inner pill re-keys → replays the "pop".
const popKey = ref(0)

// Re-measure the pill whenever the RENDERED layout changes (window shift,
// totalPage change) — this is what recenters it in Phase B. Wait a paint frame
// so TransitionGroup has taken leaving numbers out of flow (else the row hasn't
// recentred yet and we'd measure the wrong slot).
watch(displayedPages, () => {
  nextTick(() => {
    if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(updateIndicator)
    else updateIndicator()
  })
})

// ── Two-phase "highlight leads" for middle pages ─────────────────────────────
// A centered page keeps the active button in the same pixel slot, so a plain
// slide looks static. When both the old and new page are centered and adjacent:
//   Phase A — keep the old layout; slide the pill onto the NEW page (already on
//             screen at the neighbouring slot): the highlight "covers" it.
//   Phase B — shift the window; the number row FLIP-scrolls to recenter and the
//             pill rides back to the middle with it.
// Every other move (edges, non-adjacent jumps) shifts the window immediately and
// the pill just slides/pops.
const isCentered = (p: number) =>
  props.totalPage > 7 && p > 3 && p < props.totalPage - 2
const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches

let phaseTimer: ReturnType<typeof setTimeout> | null = null
const PHASE_MS = 150

watch(
  () => props.currentPage,
  (newP, oldP) => {
    popKey.value++
    if (phaseTimer) {
      clearTimeout(phaseTimer)
      phaseTimer = null
    }
    const lead =
      Math.abs(newP - oldP) === 1 &&
      isCentered(newP) &&
      isCentered(oldP) &&
      !!pageEls.value[newP] &&
      !prefersReducedMotion()

    if (lead) {
      // Phase A: layout stays; pill covers the new page in the current window.
      nextTick(updateIndicator)
      phaseTimer = setTimeout(() => {
        phaseTimer = null
        // Phase B: recompute the window → the displayedPages watch re-measures
        // the pill (now centered) while the row FLIP-scrolls to meet it.
        windowPage.value = newP
      }, PHASE_MS)
    } else {
      windowPage.value = newP
      nextTick(updateIndicator)
    }
  }
)

let resizeObserver: ResizeObserver | null = null
onMounted(() => {
  hasMounted.value = true
  nextTick(updateIndicator)
  if (typeof ResizeObserver !== 'undefined' && pagesRef.value) {
    resizeObserver = new ResizeObserver(() => updateIndicator())
    resizeObserver.observe(pagesRef.value)
  }
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  if (phaseTimer) clearTimeout(phaseTimer)
})

// White text on the pill once it's measured (the light variant's text-primary is
// overridden by tailwind-merge); match the pill's timing so text + pill land
// together. Reserve `relative z-10` so buttons sit above the sliding pill.
// When a number leaves it becomes `position: absolute` (so the row recenters at
// once). Absolute with no offsets snaps to the container origin — right on top of
// page "1". So pin its current spot the frame BEFORE it detaches, and it fades
// where it stood instead of flashing over "1".
const onNumBeforeLeave = (el: Element) => {
  const e = el as HTMLElement
  e.style.left = `${e.offsetLeft}px`
  e.style.top = `${e.offsetTop}px`
}

const pageButtonClass = (page: number) =>
  cn(
    'relative z-10 duration-150 ease-kun-standard',
    props.currentPage === page && showIndicator.value && 'text-primary-foreground'
  )

// Skip global arrow-key paging when a widget owns arrow keys itself.
const KEY_OWNING_ROLES = new Set([
  'tab',
  'option',
  'menuitem',
  'menuitemradio',
  'menuitemcheckbox',
  'slider',
  'spinbutton',
  'combobox',
  'tree',
  'treeitem',
])
const isEditableTarget = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null
  if (!t) return false
  if (t.isContentEditable) return true
  const tag = t.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  const role = t.getAttribute('role')
  return !!role && KEY_OWNING_ROLES.has(role)
}

onKeyStroke('ArrowLeft', (e) => {
  if (isEditableTarget(e)) return
  if (props.currentPage > 1) handlePageChange(props.currentPage - 1)
})

onKeyStroke('ArrowRight', (e) => {
  if (isEditableTarget(e)) return
  if (props.currentPage < props.totalPage) handlePageChange(props.currentPage + 1)
})
</script>

<template>
  <nav
    aria-label="分页导航"
    class="flex w-full flex-wrap items-center justify-between gap-4"
  >
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex items-center gap-2">
        <KunButton
          :is-icon-only="true"
          variant="light"
          size="sm"
          aria-label="上一页"
          :href="pageHref && currentPage > 1 ? pageHref(currentPage - 1) : undefined"
          :disabled="isLoading || currentPage === 1"
          :class="{ 'cursor-not-allowed opacity-50': isLoading || currentPage === 1 }"
          @click="handlePageChange(currentPage - 1)"
        >
          <KunIcon name="lucide:chevron-left" />
        </KunButton>

        <div ref="pagesRef" class="relative flex items-center gap-1">
          <!-- The active-page pill (measured; absent until mounted). Outer slides
               (translate + width); inner replays a scale "pop" on each change. -->
          <div
            v-if="showIndicator"
            aria-hidden="true"
            class="kun-page-indicator absolute top-0 left-0"
            :style="indicatorStyle"
          >
            <div :key="popKey" class="kun-page-pop bg-primary rounded-kun-md h-full w-full" />
          </div>
          <!-- The number row FLIP-scrolls (`-move`) when the window shifts.
               `relative` so a leaving number's `position: absolute` is contained
               HERE (staying where it was) instead of jumping to the outer origin
               and flashing over page 1. -->
          <TransitionGroup
            tag="div"
            name="kun-page-num"
            class="relative flex items-center gap-1"
            @before-leave="onNumBeforeLeave"
          >
            <template v-for="it in displayedPages">
              <KunButton
                v-if="it.page !== null"
                :key="it.key"
                :ref="(el: unknown) => setPageRef(el, it.page as number)"
                :variant="currentPage === it.page && !showIndicator ? 'solid' : 'light'"
                size="sm"
                :disabled="isLoading"
                :href="pageHref ? pageHref(it.page) : undefined"
                :aria-label="`第 ${it.page} 页`"
                :aria-current="currentPage === it.page ? 'page' : undefined"
                :class-name="pageButtonClass(it.page)"
                @click="handlePageChange(it.page)"
              >
                {{ it.page }}
              </KunButton>
              <span v-else :key="it.key" class="px-2">...</span>
            </template>
          </TransitionGroup>
        </div>

        <KunButton
          :is-icon-only="true"
          variant="light"
          size="sm"
          aria-label="下一页"
          :href="pageHref && currentPage < totalPage ? pageHref(currentPage + 1) : undefined"
          :disabled="isLoading || currentPage === totalPage"
          :class="{ 'cursor-not-allowed opacity-50': isLoading || currentPage === totalPage }"
          @click="handlePageChange(currentPage + 1)"
        >
          <KunIcon name="lucide:chevron-right" />
        </KunButton>
      </div>

      <div class="text-default-500 hidden items-center gap-2 text-sm sm:flex">
        您可以使用 <KunIcon name="lucide:arrow-left" />
        <KunIcon name="lucide:arrow-right" /> 来进行快速翻页
      </div>
    </div>

    <div class="flex items-center gap-2">
      <label :for="kunUniqueId" class="text-sm">跳转到页数</label>
      <input
        :id="kunUniqueId"
        v-model="jumpToPage"
        type="number"
        enterkeyhint="go"
        :disabled="isLoading"
        min="1"
        :max="totalPage"
        :class="
          cn(
            cn(
              'bg-content1 shadow-kun-sm border-kun w-24 rounded-kun-md border px-2 py-1 text-sm transition-[color,box-shadow]',
              kunFocusRingClasses.default
            ),
            isLoading && 'cursor-not-allowed opacity-50'
          )
        "
        @keyup.enter="handleJumpToPage"
      />
      <KunButton size="sm" :disabled="isLoading" @click="handleJumpToPage">
        跳转
      </KunButton>
    </div>
  </nav>
</template>

<style scoped>
/* Slide the pill on the compositor (transform) + width. Matched to the row's
   FLIP + the two-phase timing (PHASE_MS in the script) so the pill and the
   scrolling numbers move in lockstep. */
.kun-page-indicator {
  transition:
    transform 150ms var(--ease-kun-standard),
    width 150ms var(--ease-kun-standard);
}

/* The number row FLIP-scrolls to its new positions when the ellipsis window
   shifts — this is the "numbers slide" half of the middle-page choreography.
   Entering/leaving edge numbers just appear/disappear. */
.kun-page-num-move {
  transition: transform 150ms var(--ease-kun-standard);
}
/* Leaving edge numbers go out of flow AT ONCE so the row recenters immediately
   (the pill measures the settled layout) — they just fade where they were.
   Entering numbers fade in. */
.kun-page-num-enter-active {
  transition: opacity 150ms var(--ease-kun-standard);
}
.kun-page-num-leave-active {
  position: absolute;
  transition: opacity 120ms var(--ease-kun-standard);
}
.kun-page-num-enter-from,
.kun-page-num-leave-to {
  opacity: 0;
}

/* "Pop": the pill lifts (scale up + colored shadow), overshoots slightly, then
   settles back over the number — an elastic "peel up then cover" feel. Re-keyed
   per page change, so it replays every time (incl. when the pill doesn't move). */
.kun-page-pop {
  animation: kun-page-pop 340ms var(--ease-kun-standard);
  transform-origin: center;
  will-change: transform;
}
@keyframes kun-page-pop {
  0% {
    transform: scale(1);
  }
  38% {
    transform: scale(1.1);
    box-shadow: 0 4px 12px -5px color-mix(in oklch, var(--color-primary) 45%, transparent);
  }
  68% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
    box-shadow: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .kun-page-indicator {
    transition: none;
  }
  .kun-page-pop {
    animation: none;
  }
  .kun-page-num-move {
    transition: none;
  }
}
</style>
