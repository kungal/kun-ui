<script setup lang="ts">
import { computed, h, nextTick, onBeforeUnmount, ref, type VNodeChild } from 'vue'
import { buildKunChatEntityTree, type KunChatEntityNode, type KunChatTextNode } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import { useKunUIConfig } from '../config/useKunUIConfig'
import { useKunLocale } from '../locale/useKunLocale'
import { mountKunSpoilerParticles } from '../composables/useSpoilerContent'
import { kunChatSafeUrl } from '../utils/chat'
import type { KunChatTextProps } from './types'

// Message text + entities, rendered from the tree ui-core builds — the same
// tree the Flutter port renders. No v-html anywhere: every run of text is a
// text node, so nothing a user typed can become markup.
defineOptions({ name: 'KunChatText' })

const props = withDefaults(defineProps<KunChatTextProps>(), {
  entities: null,
  preview: false,
})

const emit = defineEmits<{
  /** A mention was clicked. It is a real link to the profile
   *  (`userLinkTemplate`); call `event.preventDefault()` to handle it yourself. */
  mention: [userId: string, event: MouseEvent]
  /** A link was clicked. It opens in a new tab unless you call
   *  `event.preventDefault()`, e.g. to route an in-site URL. */
  link: [url: string, event: MouseEvent]
}>()

const config = useKunUIConfig()
const { t } = useKunLocale()

const tree = computed(() => buildKunChatEntityTree(props.text, props.entities))

// One click reveals every spoiler in the message, as in both Telegram web
// clients, and a revealed spoiler stays revealed.
const revealed = ref(false)
const particles = new Map<number, { el: HTMLElement; handle: ReturnType<typeof mountKunSpoilerParticles> }>()

const trackSpoiler = (key: number, el: unknown) => {
  const current = particles.get(key)
  if (el === current?.el) return
  current?.handle.destroy()
  particles.delete(key)
  if (el instanceof HTMLElement && !revealed.value) {
    particles.set(key, { el, handle: mountKunSpoilerParticles(el) })
  }
}

// One stable ref function per spoiler: Vue calls a function ref on every
// patch, and a fresh closure each render would be called with null first —
// tearing the particle field down and seeding it again on every re-render.
const spoilerRefs = new Map<number, (el: unknown) => void>()
const spoilerRef = (key: number) => {
  let fn = spoilerRefs.get(key)
  if (!fn) {
    fn = (el: unknown) => trackSpoiler(key, el)
    spoilerRefs.set(key, fn)
  }
  return fn
}

const reveal = () => {
  if (revealed.value) return
  revealed.value = true
  particles.forEach(({ handle }) => handle.reveal())
  nextTick(() => particles.clear())
}

onBeforeUnmount(() => {
  particles.forEach(({ handle }) => handle.destroy())
  particles.clear()
})

const copiedAt = ref<number | null>(null)
let copiedTimer: ReturnType<typeof setTimeout> | undefined
const copyPre = async (node: KunChatEntityNode) => {
  const { offset, length } = node.entity
  try {
    await navigator.clipboard.writeText(props.text.slice(offset, offset + length))
    copiedAt.value = offset
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => (copiedAt.value = null), 2000)
  } catch (err) {
    console.error('[KunUI] copy failed:', err)
  }
}
onBeforeUnmount(() => clearTimeout(copiedTimer))

const linkClass =
  'text-primary-600 underline decoration-primary-600/40 underline-offset-2 hover:decoration-primary-600'
const codeClass = 'kun-chat-code rounded-kun-sm bg-default/20 px-1 py-px text-[0.9em]'

const renderNodes = (nodes: KunChatTextNode[]): VNodeChild[] => nodes.map(renderNode)

const renderLink = (node: KunChatEntityNode, href: string | null): VNodeChild => {
  const children = renderNodes(node.children)
  if (props.preview || !href) return h('span', children)
  return h(
    'a',
    {
      href,
      target: '_blank',
      rel: 'noopener noreferrer nofollow ugc',
      // A text link hides its target; the tooltip shows where it goes.
      title: node.entity.type === 'text_link' ? href : undefined,
      class: linkClass,
      onClick: (event: MouseEvent) => emit('link', href, event),
    },
    children
  )
}

const renderMention = (node: KunChatEntityNode): VNodeChild => {
  const children = renderNodes(node.children)
  const id = node.entity.user_id
  if (props.preview || !id) return h('span', { class: 'font-medium' }, children)
  const href = config.userLinkTemplate.replace('{id}', encodeURIComponent(id))
  const attrs = {
    class: 'text-primary-600 font-medium underline-offset-2 hover:underline',
    // Capture: RouterLink (NuxtLink under Nuxt) navigates from its own click
    // listener, which runs before a fallthrough one, so a bubble-phase
    // handler's preventDefault came too late to stop it (vue-router 5.1).
    onClickCapture: (event: MouseEvent) => emit('mention', id, event),
  }
  return typeof config.linkComponent === 'string'
    ? h(config.linkComponent, { ...attrs, href }, children)
    : h(config.linkComponent, { ...attrs, to: href }, { default: () => children })
}

const renderSpoiler = (node: KunChatEntityNode): VNodeChild => {
  const { offset, length } = node.entity
  if (props.preview) {
    // The hidden text is not in the DOM at all — a preview is not clickable,
    // and copying a conversation row must not leak it.
    const size = Math.min(12, Math.max(3, Array.from(props.text.slice(offset, offset + length)).length))
    return h('span', { class: 'kun-chat-spoiler-mask', 'aria-hidden': 'true' }, '⠿'.repeat(size))
  }
  const hidden = !revealed.value
  const onActivate = (event: Event) => {
    if (!hidden) return
    event.preventDefault()
    event.stopPropagation()
    reveal()
  }
  return h(
    'span',
    {
      key: `s${offset}`,
      ref: spoilerRef(offset),
      class: hidden ? 'kun-spoiler kun-spoiler-hidden' : 'kun-spoiler',
      role: hidden ? 'button' : undefined,
      tabindex: hidden ? 0 : undefined,
      'aria-label': hidden ? t('spoiler.reveal') : undefined,
      // Capture: a hidden link inside must not be followed by the reveal click.
      onClickCapture: onActivate,
      onKeydown: (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') onActivate(event)
      },
    },
    renderNodes(node.children)
  )
}

const renderPre = (node: KunChatEntityNode): VNodeChild => {
  const code = h('code', renderNodes(node.children))
  if (props.preview) return h('code', { class: codeClass }, renderNodes(node.children))
  const copied = copiedAt.value === node.entity.offset
  return h('div', { class: 'kun-chat-pre my-1 overflow-hidden rounded-kun-md bg-default/15' }, [
    h('div', { class: 'flex h-7 items-center justify-between gap-2 pr-1 pl-3 text-xs' }, [
      h('span', { class: 'text-default-500 truncate font-medium' }, node.entity.language ?? ''),
      h(
        'button',
        {
          type: 'button',
          class:
            'text-default-500 hover:text-foreground inline-flex size-6 items-center justify-center rounded-kun-sm transition-colors',
          'aria-label': copied ? t('copy.copied') : t('spoiler.copyCode'),
          onClick: () => copyPre(node),
        },
        [h(KunIcon, { name: copied ? 'lucide:check' : 'lucide:copy', class: 'text-sm' })]
      ),
    ]),
    h('pre', { class: 'overflow-x-auto px-3 pb-2 text-[0.85em] leading-5' }, [code]),
  ])
}

const renderNode = (node: KunChatTextNode): VNodeChild => {
  if (node.kind === 'text') {
    // `data-kun-o` is the run's offset in the message text: how a selection
    // maps back to a quote (kunChatSelectionRange).
    return props.preview ? node.text : h('span', { 'data-kun-o': node.offset }, node.text)
  }
  const children = () => renderNodes(node.children)
  const { entity } = node
  switch (entity.type) {
    case 'bold':
      return h('strong', { class: 'font-semibold' }, children())
    case 'italic':
      return h('em', children())
    case 'underline':
      return h('u', { class: 'underline-offset-2' }, children())
    case 'strikethrough':
      return h('s', children())
    case 'code':
      return h('code', { class: codeClass }, children())
    case 'pre':
      return renderPre(node)
    case 'blockquote':
      return props.preview
        ? h('span', children())
        : h(
            'blockquote',
            { class: 'my-1 rounded-r-kun-sm border-l-[3px] border-primary bg-primary/10 py-0.5 pr-2 pl-2.5' },
            children()
          )
    case 'spoiler':
      return renderSpoiler(node)
    case 'text_link':
      return renderLink(node, kunChatSafeUrl(entity.url ?? ''))
    case 'url':
      return renderLink(node, kunChatSafeUrl(props.text.slice(entity.offset, entity.offset + entity.length)))
    case 'mention':
      return renderMention(node)
    default:
      return h('span', children())
  }
}

const Nodes = () => renderNodes(tree.value)

// Line breaks are content, and a long URL must still wrap inside a bubble —
// both correctness, so inline rather than a class the consumer's Tailwind
// might not generate.
const rootStyle = computed(() =>
  props.preview
    ? { whiteSpace: 'nowrap' as const }
    : { whiteSpace: 'pre-wrap' as const, overflowWrap: 'anywhere' as const }
)
</script>

<template>
  <component :is="preview ? 'span' : 'div'" class="kun-chat-text" :style="rootStyle">
    <Nodes />
  </component>
</template>

<style scoped>
/* Spoilers share KunContent's cover: transparent text over a tint, present in
   the server HTML, with the particle canvas layered on by JS. See the notes in
   Content.vue — above all why the covered box is an inline-block. */
.kun-chat-text :deep(.kun-spoiler) {
  transition: color var(--kun-dur-base) var(--ease-kun-standard);
}
/* `:has(canvas)`: Vue rewrites `class` when the cover comes off and drops the
   engine's `kun-spoiler-live`, but the canvas is still dissolving and must
   stay positioned against this box until it is removed. */
.kun-chat-text :deep(.kun-spoiler-hidden),
.kun-chat-text :deep(.kun-spoiler-live),
.kun-chat-text :deep(.kun-spoiler:has(> .kun-spoiler-canvas)) {
  position: relative;
  display: inline-block;
}
.kun-chat-text :deep(.kun-spoiler-hidden) {
  cursor: pointer;
  color: transparent !important;
  user-select: none;
  background-color: rgb(150 150 150 / 0.18);
}
.kun-chat-text :deep(.kun-spoiler-hidden > :not(.kun-spoiler-canvas)) {
  visibility: hidden;
}
.kun-chat-text :deep(.kun-spoiler-hidden:hover) {
  background-color: rgb(150 150 150 / 0.26);
}
.kun-chat-text :deep(.kun-spoiler-hidden.kun-spoiler-live),
.kun-chat-text :deep(.kun-spoiler-hidden.kun-spoiler-live:hover) {
  background-color: transparent;
}
.kun-chat-text :deep(.kun-spoiler-mask) {
  opacity: 0.55;
  letter-spacing: -0.05em;
}
/* A code block keeps its own lines and scrolls sideways. */
.kun-chat-text :deep(.kun-chat-pre pre) {
  white-space: pre;
}
/* KunUI's own mono stack, the one `.kun-prose` sets code in. */
.kun-chat-text :deep(.kun-chat-code),
.kun-chat-text :deep(.kun-chat-pre pre) {
  font-family: var(--kun-font-mono);
}
</style>
