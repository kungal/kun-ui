<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import { cn, kunVariantClasses } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import { useKunLocale } from '../locale/useKunLocale'
import type { KunBannerProps } from './types'

// Full-width, one-sentence announcement strip for the top of a page. It sits in
// normal flow and is a named region landmark, not a live region: `role="alert"`
// is not announced for content that arrives with the page, and interrupts when
// it is inserted later.
defineOptions({ name: 'KunBanner', inheritAttrs: false })

const { t } = useKunLocale()

const props = withDefaults(defineProps<KunBannerProps>(), {
  text: '',
  color: 'primary',
  variant: 'solid',
  icon: '',
  closable: true,
  storageKey: '',
  nonce: undefined,
  className: '',
})

const emit = defineEmits<{
  close: []
}>()

/** Whether the banner is shown. Starts open when unbound; with `storageKey`,
 *  a dismissal stored by an earlier visit sets it to `false` after mount. */
const open = defineModel<boolean>({ default: true })

const DISMISSED = '1'
const key = computed(() => props.storageKey.replace(/[^\w-]/g, '-'))
const storageItem = (k: string) => `kun-banner:${k}`
const hiddenVar = (k: string) => `--kun-banner-${k}`

// localStorage throws, rather than returning null, when site data is blocked.
const readDismissed = () => {
  try {
    return localStorage.getItem(storageItem(key.value)) === DISMISSED
  } catch {
    return false
  }
}
const writeDismissed = (dismissed: boolean) => {
  try {
    if (dismissed) localStorage.setItem(storageItem(key.value), DISMISSED)
    else localStorage.removeItem(storageItem(key.value))
  } catch {}
}

// The server cannot read localStorage, so it renders every banner. This script
// runs as the parser reaches it, before the banner is parsed or painted, and
// hides a closed one through a custom property on <html>: Vue never hydrates
// <html>, so the banner's own attributes still match the server's. Rendered
// with `innerHTML` — a text child is HTML-escaped by the SSR renderer and the
// script becomes a SyntaxError. `key` is sanitised to [\w-], so it cannot
// close the <script> element.
const PrePaintScript = () =>
  h('script', {
    nonce: props.nonce,
    innerHTML: `try{if(localStorage.getItem("${storageItem(key.value)}")==="${DISMISSED}")document.documentElement.style.setProperty("${hiddenVar(key.value)}","none")}catch(e){}`,
  })

// A banner the script already hid closes without its collapse animation.
const instant = ref(false)
const closeInstantly = () => {
  if (!open.value) return
  instant.value = true
  open.value = false
}

// Hydration must render what the server rendered, so a stored dismissal is
// applied after mount, not in setup.
onMounted(() => {
  if (key.value && readDismissed()) closeInstantly()
})

watch(open, (isOpen) => {
  if (!key.value) return
  writeDismissed(!isOpen)
  if (isOpen) document.documentElement.style.removeProperty(hiddenVar(key.value))
})

// A new key is a new announcement.
watch(key, (next, prev) => {
  if (prev) document.documentElement.style.removeProperty(hiddenVar(prev))
  if (!next) return
  if (readDismissed()) closeInstantly()
  else open.value = true
})

const dismiss = () => {
  if (!open.value) return
  open.value = false
  emit('close')
}

// @kungal/ui-tokens/base.css gives every element the foreground colour, so the
// text nested in the strip rendered dark on a solid fill while the strip itself
// was white. `:where()` keeps the inherit at zero specificity, so a colour class
// on slotted content still wins — an unlayered `:deep(*)` rule would not.
const INHERIT_COLOR = '[:where(&)_*]:text-inherit'

const display = computed(() =>
  key.value ? `var(${hiddenVar(key.value)}, grid)` : 'grid'
)
</script>

<template>
  <PrePaintScript v-if="key" :key="key" />
  <Transition name="kun-banner" :css="!instant" @after-leave="instant = false">
    <section
      v-if="open"
      v-bind="$attrs"
      :aria-label="ariaLabel ?? t('banner.label')"
      :class="
        cn(
          'kun-banner w-full',
          kunVariantClasses(variant, color),
          INHERIT_COLOR,
          'border-0',
          className
        )
      "
      :style="{ display }"
    >
      <div class="min-h-0 overflow-hidden">
        <div class="flex min-h-10 items-center gap-3 px-4 py-1.5 text-sm sm:px-6">
          <!-- Mirrors the close column, so the message centres on the page. -->
          <div class="hidden flex-1 sm:block" />
          <div
            class="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 sm:flex-initial sm:justify-center"
          >
            <div class="flex min-w-0 items-start gap-2">
              <KunIcon v-if="icon" :name="icon" class="mt-0.5 size-4 shrink-0" />
              <div
                class="min-w-0 font-medium sm:text-center sm:text-balance [&_a]:text-current [&_a]:underline [&_a]:underline-offset-4"
              >
                <slot :dismiss="dismiss">{{ text }}</slot>
              </div>
            </div>
            <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
              <slot name="actions" :dismiss="dismiss" />
            </div>
          </div>
          <div class="flex flex-none justify-end sm:flex-1">
            <button
              v-if="closable"
              type="button"
              class="-my-1 -mr-1.5 inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md opacity-80 transition hover:bg-current/10 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-current"
              :aria-label="t('banner.close')"
              @click="dismiss"
            >
              <KunIcon name="lucide:x" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
/* The row collapses through the grid 0fr trick so the page below slides up
   instead of jumping — the one layout-animating transition here, and it runs
   once. Opacity leads so the text is gone before the strip is thin. */
.kun-banner {
  grid-template-rows: 1fr;
}
.kun-banner-enter-active {
  transition:
    grid-template-rows var(--kun-dur-base, 250ms) var(--ease-kun-standard, ease),
    opacity var(--kun-dur-base, 250ms) var(--ease-kun-out, ease-out);
}
.kun-banner-leave-active {
  transition:
    grid-template-rows var(--kun-dur-base, 250ms) var(--ease-kun-standard, ease),
    opacity var(--kun-dur-exit, 180ms) var(--ease-kun-in, ease-in);
}
.kun-banner-enter-from,
.kun-banner-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .kun-banner-enter-active,
  .kun-banner-leave-active {
    transition: none;
  }
}
</style>
