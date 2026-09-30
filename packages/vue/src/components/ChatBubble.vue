<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  cn,
  layoutKunChatAlbum,
  type KunChatMessage,
  type KunChatPhoto,
  type KunChatReaction,
} from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import KunImage from './Image.vue'
import KunLightbox from './Lightbox.vue'
import KunChatText from './ChatText.vue'
import { useKunUIConfig } from '../config/useKunUIConfig'
import { useKunLocale } from '../locale/useKunLocale'
import {
  formatKunChatFullTime,
  formatKunChatTime,
  kunChatMediaLabel,
  kunChatSafeUrl,
  kunChatServiceText,
  kunChatUserMap,
  resolveKunChatUser,
} from '../utils/chat'
import type { KunChatBubbleProps } from './types'

// One message: text, photo or album, with its reply preview, context card,
// reactions and meta. A service message renders as a centred pill instead.
// Positioning in a row (left / right, avatar column) is the list's job.
defineOptions({ name: 'KunChatBubble' })

const props = withDefaults(defineProps<KunChatBubbleProps>(), {
  album: null,
  own: false,
  users: () => [],
  currentUserId: undefined,
  showSender: false,
  position: 'single',
  status: undefined,
  reactionOptions: () => [],
  resolveMediaUrl: undefined,
  resolveMessage: undefined,
  timeZone: undefined,
  lightbox: true,
  disabled: false,
})

const emit = defineEmits<{
  /** The reply preview was clicked: jump to the replied-to message. */
  'reply-click': [seq: number]
  /** A reaction chip was clicked: the key to set, or null to remove the
   *  viewer's own. One reaction per person, so setting replaces. */
  react: [reaction: string | null]
  /** The failed-status button was clicked. */
  retry: []
  /** A photo was clicked (index into the album). Fires with `lightbox` on
   *  as well. */
  'photo-click': [index: number]
  /** The sender's name was clicked. It links to the profile unless you call
   *  `event.preventDefault()`. */
  'user-click': [userId: string, event: MouseEvent]
  /** A mention in the text was clicked. */
  mention: [userId: string, event: MouseEvent]
  /** A link in the text or the context card was clicked. */
  link: [url: string, event: MouseEvent]
}>()

const config = useKunUIConfig()
const { t, locale } = useKunLocale()

const users = computed(() => kunChatUserMap(props.users))
const sender = computed(() => resolveKunChatUser(users.value, props.message.sender_id, t))
const isService = computed(() => props.message.kind === 'service')
const serviceText = computed(() =>
  isService.value
    ? kunChatServiceText(props.message, {
        users: users.value,
        currentUserId: props.currentUserId,
        t,
        locale: locale.code,
        resolveMessage: props.resolveMessage,
      })
    : ''
)

const profileHref = (id: string) => config.userLinkTemplate.replace('{id}', encodeURIComponent(id))
const linkBinding = (href: string) =>
  typeof config.linkComponent === 'string' ? { href } : { to: href }

const photos = computed(() =>
  (props.album?.length ? props.album : [props.message])
    .map((m) => m.media)
    .filter((m): m is KunChatPhoto => m?.type === 'photo')
)
const isAlbum = computed(() => photos.value.length > 1)
const hasText = computed(() => !!props.message.text)
const mediaOnly = computed(() => photos.value.length > 0 && !hasText.value)

// A lone photo keeps its shape within bounds: at most 320 × 420 CSS px, at
// least 140 wide, with extreme ratios cropped rather than drawn as a sliver.
const PHOTO_MAX_W = 320
const PHOTO_MAX_H = 420
const PHOTO_MIN_W = 140
const single = computed(() => {
  const p = photos.value[0]
  if (!p || isAlbum.value) return null
  const natural = p.width > 0 && p.height > 0 ? p.width / p.height : 1
  const ratio = Math.min(Math.max(natural, 0.5), 2.4)
  let width = Math.min(PHOTO_MAX_W, p.width || PHOTO_MAX_W)
  if (width / ratio > PHOTO_MAX_H) width = PHOTO_MAX_H * ratio
  width = Math.round(Math.max(width, PHOTO_MIN_W))
  return { width, ratio }
})

const ALBUM_W = 320
const album = computed(() => {
  if (!isAlbum.value) return null
  const layout = layoutKunChatAlbum(photos.value.map((p) => ({ width: p.width, height: p.height })))
  const pct = (v: number, of: number) => `${(v / of) * 100}%`
  return {
    ratio: `${layout.width} / ${layout.height}`,
    tiles: layout.tiles.map((tile) => ({
      left: pct(tile.x, layout.width),
      top: pct(tile.y, layout.height),
      width: pct(tile.width, layout.width),
      height: pct(tile.height, layout.height),
    })),
  }
})

// Width is correctness here (a caption must wrap to the photo, not widen the
// bubble), so it is inline.
const bubbleStyle = computed(() => {
  if (single.value) return { width: `${single.value.width}px`, maxWidth: '100%' }
  if (album.value) return { width: `${ALBUM_W}px`, maxWidth: '100%' }
  return undefined
})

const src = (p: KunChatPhoto, variant: 'preview' | 'original') =>
  props.resolveMediaUrl?.(p, variant) ?? p.url ?? ''

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const lightboxImages = computed(() =>
  photos.value.map((p) => ({ src: src(p, 'original'), alt: t('chat.photoFrom', { name: sender.value.name }) }))
)
const openPhoto = (index: number) => {
  if (props.disabled) return
  emit('photo-click', index)
  if (!props.lightbox) return
  lightboxIndex.value = index
  lightboxOpen.value = true
}

const reply = computed(() => props.message.reply_to)
const replySender = computed(() =>
  reply.value ? resolveKunChatUser(users.value, reply.value.sender_id, t) : null
)
const quote = computed(() => props.message.reply_quote)

const context = computed(() => {
  const c = props.message.context
  if (!c) return null
  const href = kunChatSafeUrl(c.url)
  let host = c.site
  try {
    if (href) host = new URL(href).host
  } catch {
    // keep the site key
  }
  return { ...c, href, host }
})

const reactionOption = (key: string) => props.reactionOptions.find((o) => o.key === key)
const reactionLabel = (r: KunChatReaction) => reactionOption(r.reaction)?.label ?? r.reaction
const onReact = (r: KunChatReaction) => {
  if (!props.disabled) emit('react', r.reacted ? null : r.reaction)
}

const time = computed(() => formatKunChatTime(props.message.created_at, locale.code, props.timeZone))
const fullTime = computed(() =>
  formatKunChatFullTime(props.message.created_at, locale.code, props.timeZone)
)
const statusIcon = computed(() => {
  switch (props.status) {
    case 'sending':
      return 'lucide:clock'
    case 'sent':
      return 'lucide:check'
    case 'read':
      return 'lucide:check-check'
    default:
      return null
  }
})

// A photo with nothing around it is its own bubble: no surface, no tail.
const bare = computed(
  () => mediaOnly.value && !reply.value && !context.value && !(props.showSender && !props.own)
)
const tail = computed(
  () => !bare.value && (props.position === 'last' || props.position === 'single')
)
// Corners on the sender's side shrink inside a run and vanish where the
// tail joins; the far side stays round.
const cornerClass = computed(() => {
  const p = props.position
  const near = {
    top: p === 'middle' || p === 'last',
    bottom: p === 'first' || p === 'middle',
  }
  if (props.own) {
    return cn(
      'rounded-kun-lg',
      near.top && 'rounded-tr-kun-sm',
      near.bottom && 'rounded-br-kun-sm',
      tail.value && 'rounded-br-none'
    )
  }
  return cn(
    'rounded-kun-lg',
    near.top && 'rounded-tl-kun-sm',
    near.bottom && 'rounded-bl-kun-sm',
    tail.value && 'rounded-bl-none'
  )
})

const surfaceClass = computed(() =>
  props.own ? 'bg-primary-100 fill-primary-100' : 'bg-content1 fill-content1'
)
const metaClass = computed(() => (props.own ? 'text-primary-600' : 'text-foreground-muted'))
</script>

<template>
  <div v-if="isService" class="flex justify-center px-2">
    <span
      class="bg-default/25 text-foreground/80 max-w-full rounded-full px-3 py-1 text-center text-xs font-medium"
      :style="{ overflowWrap: 'anywhere' }"
    >
      {{ serviceText }}
    </span>
  </div>

  <div
    v-else
    :class="
      cn(
        'kun-chat-bubble relative w-fit min-w-0 max-w-[min(85%,34rem)] text-[0.9375rem] leading-5',
        !bare && surfaceClass,
        !bare && !own && 'shadow-kun-sm',
        cornerClass
      )
    "
    :style="bubbleStyle"
    :data-own="own || undefined"
  >
    <span v-if="!showSender" class="sr-only">
      {{ t('chat.senderPrefix', { name: own ? t('chat.you') : sender.name }) }}
    </span>

    <!-- Sender (group chats, first of a run) -->
    <div
      v-if="showSender && !own"
      :class="cn('truncate px-3 pt-1.5 text-sm font-semibold text-primary', mediaOnly && 'pb-1')"
    >
      <span v-if="sender.deleted">{{ sender.name }}</span>
      <component
        :is="config.linkComponent"
        v-else
        v-bind="linkBinding(profileHref(sender.id))"
        class="text-primary hover:underline"
        @click.capture="(e: MouseEvent) => emit('user-click', sender.id, e)"
      >
        {{ sender.name }}
      </component>
    </div>

    <!-- Reply preview -->
    <button
      v-if="reply"
      type="button"
      :disabled="disabled"
      :class="
        cn(
          'mx-2 mt-1.5 flex w-[calc(100%-1rem)] min-w-0 flex-col items-start gap-px rounded-kun-sm border-l-[3px] border-primary py-1 pr-2 pl-2 text-left text-sm transition-colors',
          own ? 'bg-primary-200/60 hover:bg-primary-200' : 'bg-primary/10 hover:bg-primary/15',
          mediaOnly && 'mb-1'
        )
      "
      @click="emit('reply-click', reply.seq)"
    >
      <span class="flex max-w-full items-center gap-1 font-semibold text-primary">
        <KunIcon v-if="quote" name="lucide:quote" class="shrink-0 text-xs" />
        <span class="truncate">{{ replySender?.name }}</span>
      </span>
      <span v-if="reply.deleted" class="text-default-500 italic">
        {{ t('chat.deletedMessage') }}
      </span>
      <span v-else class="text-foreground/80 block max-w-full truncate [:where(&)_*]:text-inherit">
        <KunChatText
          v-if="quote || reply.text"
          :text="quote ? quote.text : reply.text"
          :entities="quote ? quote.entities : reply.entities"
          preview
        />
        <span v-else class="inline-flex items-center gap-1">
          <KunIcon name="lucide:image" class="text-xs" />
          {{ kunChatMediaLabel(reply.media_type ? { type: reply.media_type } : null, t) }}
        </span>
      </span>
    </button>

    <!-- A single photo -->
    <div
      v-if="single"
      :class="
        cn(
          'relative overflow-hidden',
          reply || (showSender && !own) ? 'mx-1 mt-1 rounded-kun-md' : cornerClass,
          hasText && !(reply || (showSender && !own)) && 'rounded-b-none'
        )
      "
    >
      <button
        type="button"
        class="block w-full cursor-zoom-in"
        :aria-label="t('chat.photoFrom', { name: sender.name })"
        @click="openPhoto(0)"
      >
        <KunImage
          :src="src(photos[0]!, 'preview')"
          :thumbhash="photos[0]!.thumbhash ?? undefined"
          :aspect-ratio="String(single.ratio)"
          :width="photos[0]!.width"
          :height="photos[0]!.height"
          alt=""
          class-name="block w-full"
        />
      </button>
      <span
        v-if="mediaOnly && !message.reactions.length"
        class="pointer-events-none absolute right-1.5 bottom-1.5 inline-flex items-center gap-1 rounded-full bg-black/45 px-1.5 py-px text-[11px] text-white [:where(&)_*]:text-inherit"
      >
        <span v-if="message.edited_at">{{ t('chat.edited') }}</span>
        <time :datetime="message.created_at" :title="fullTime">{{ time }}</time>
        <KunIcon v-if="statusIcon" :name="statusIcon" class="text-xs" />
      </span>
    </div>

    <!-- An album -->
    <div
      v-if="album"
      :class="
        cn(
          'relative overflow-hidden',
          reply || (showSender && !own) ? 'mx-1 mt-1 rounded-kun-md' : cornerClass,
          hasText && !(reply || (showSender && !own)) && 'rounded-b-none'
        )
      "
      :style="{ aspectRatio: album.ratio }"
    >
      <button
        v-for="(tile, i) in album.tiles"
        :key="i"
        type="button"
        class="absolute cursor-zoom-in overflow-hidden"
        :style="tile"
        :aria-label="t('chat.photoFrom', { name: sender.name })"
        @click="openPhoto(i)"
      >
        <KunImage
          :src="src(photos[i]!, 'preview')"
          :thumbhash="photos[i]!.thumbhash ?? undefined"
          alt=""
          class-name="size-full"
          image-class-name="size-full object-cover"
        />
      </button>
      <span
        v-if="mediaOnly && !message.reactions.length"
        class="pointer-events-none absolute right-1.5 bottom-1.5 inline-flex items-center gap-1 rounded-full bg-black/45 px-1.5 py-px text-[11px] text-white [:where(&)_*]:text-inherit"
      >
        <time :datetime="message.created_at" :title="fullTime">{{ time }}</time>
        <KunIcon v-if="statusIcon" :name="statusIcon" class="text-xs" />
      </span>
    </div>

    <!-- Cross-site context card -->
    <component
      :is="context.href ? 'a' : 'div'"
      v-if="context"
      :href="context.href ?? undefined"
      :target="context.href ? '_blank' : undefined"
      :rel="context.href ? 'noopener noreferrer' : undefined"
      :class="
        cn(
          'mx-2 mt-1.5 flex min-w-0 flex-col rounded-kun-sm border border-default/30 px-2.5 py-1.5 text-sm transition-colors',
          context.href && 'hover:bg-default/10'
        )
      "
      @click="(e: MouseEvent) => context?.href && emit('link', context.href, e)"
    >
      <span class="text-foreground-muted flex items-center gap-1 text-xs">
        <KunIcon name="lucide:external-link" class="shrink-0" />
        <span class="truncate">{{ context.host }}</span>
      </span>
      <span class="truncate font-medium">{{ context.title }}</span>
    </component>

    <!-- Text, with the meta tucked into its last line -->
    <div v-if="hasText" class="relative px-3 pt-1.5 pb-1.5">
      <KunChatText
        :text="message.text"
        :entities="message.entities"
        class="inline"
        @mention="(id, e) => emit('mention', id, e)"
        @link="(url, e) => emit('link', url, e)"
      />
      <!-- An invisible twin of the meta at the end of the text reserves its
           room on the last line; the real one sits in the corner over it. -->
      <span
        v-if="!message.reactions.length"
        aria-hidden="true"
        class="invisible ml-2 inline-flex items-center gap-1 text-[11px]"
      >
        <span v-if="message.edited_at">{{ t('chat.edited') }}</span>
        <span>{{ time }}</span>
        <KunIcon v-if="own && (statusIcon || status === 'failed')" name="lucide:check-check" class="text-sm" />
      </span>
    </div>

    <!-- Reactions -->
    <div
      v-if="message.reactions.length"
      :class="cn('flex flex-wrap items-center gap-1 px-2 pb-1.5', !hasText && 'pt-1.5')"
      role="group"
      :aria-label="t('chat.reactions')"
    >
      <button
        v-for="r in message.reactions"
        :key="r.reaction"
        type="button"
        :disabled="disabled"
        :aria-pressed="r.reacted"
        :aria-label="t('chat.reactionCount', { label: reactionLabel(r), count: r.count })"
        :class="
          cn(
            'inline-flex h-7 items-center gap-1 rounded-full px-2 text-sm tabular-nums transition-colors',
            r.reacted
              ? 'bg-primary text-primary-foreground'
              : own
                ? 'bg-primary-200 text-primary-700 hover:bg-primary-300'
                : 'bg-primary/10 text-primary-700 hover:bg-primary/20'
          )
        "
        @click="onReact(r)"
      >
        <img
          v-if="reactionOption(r.reaction)?.image_url"
          :src="reactionOption(r.reaction)!.image_url!"
          alt=""
          class="size-5 object-contain"
          loading="lazy"
          decoding="async"
        />
        <span v-else class="text-base leading-none">
          {{ reactionOption(r.reaction)?.emoji ?? r.reaction }}
        </span>
        <span>{{ r.count }}</span>
      </button>
      <span :class="cn('ml-auto inline-flex items-center gap-1 pl-1 text-[11px] [:where(&)_*]:text-inherit', metaClass)">
        <span v-if="message.edited_at">{{ t('chat.edited') }}</span>
        <time :datetime="message.created_at" :title="fullTime">{{ time }}</time>
        <KunIcon v-if="own && statusIcon" :name="statusIcon" class="text-sm" />
      </span>
    </div>

    <!-- Meta in the corner, over the reserved room -->
    <span
      v-if="hasText && !message.reactions.length"
      :class="cn('absolute right-2.5 bottom-1.5 inline-flex items-center gap-1 text-[11px] [:where(&)_*]:text-inherit', metaClass)"
    >
      <span v-if="message.edited_at">{{ t('chat.edited') }}</span>
      <time :datetime="message.created_at" :title="fullTime">{{ time }}</time>
      <KunIcon v-if="own && statusIcon" :name="statusIcon" class="text-sm" :aria-label="t(`chatStatus.${status!}`)" />
    </span>

    <button
      v-if="own && status === 'failed'"
      type="button"
      class="text-danger absolute -left-8 bottom-0 inline-flex size-6 items-center justify-center rounded-full bg-content1 shadow-kun-sm"
      :aria-label="t('chatStatus.failed')"
      :title="t('chatStatus.failed')"
      @click="emit('retry')"
    >
      <KunIcon name="lucide:circle-alert" class="text-base" />
    </button>

    <!-- Tail -->
    <svg
      v-if="tail"
      aria-hidden="true"
      viewBox="0 0 7 17"
      :class="cn('absolute bottom-0 h-[17px] w-[7px]', own ? '-right-[6px]' : '-left-[6px] -scale-x-100')"
    >
      <path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" />
    </svg>

    <KunLightbox
      v-if="lightbox && photos.length"
      v-model:is-open="lightboxOpen"
      :images="lightboxImages"
      :initial-index="lightboxIndex"
    />
  </div>
</template>
