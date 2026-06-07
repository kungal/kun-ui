import { computed } from 'vue'
import { useRoute, useSeoMeta, useHead } from '#imports'
import { site, getPageMeta, displayLabel } from '~/site.config'

interface KunSeoInput {
  /** Page title (the " · KunUI" suffix is added automatically). */
  title?: string
  /** Meta description. */
  description?: string
  ogType?: 'website' | 'article' | 'profile'
  /** Absolute or root-relative OG/Twitter image. Defaults to site.ogImage. */
  ogImage?: string
}

/**
 * Set per-page SEO (title, description, Open Graph, Twitter card, canonical).
 *
 * Adapted from the kungalgame `useKunSeoMeta`, but driven by `site.config`:
 * called once (reactively) in app.vue, it resolves each route's title +
 * description from `pageMeta`, so every page is covered with no per-page
 * boilerplate. A page can still override by calling it with explicit input.
 *
 * All fields are passed as getters so they update on client-side navigation.
 */
export const useKunSeoMeta = (input: KunSeoInput = {}) => {
  const route = useRoute()

  const entry = computed(() => getPageMeta(route.path))
  // Base = "Input (输入框)" for component pages, "KunUI" for home.
  const base = computed(() => input.title ?? displayLabel(route.path))
  const description = computed(
    () => input.description ?? entry.value?.description ?? site.description
  )
  // Home stays "KunUI"; everything else becomes "<Page> · KunUI".
  const title = computed(() =>
    base.value === site.name ? site.name : `${base.value} · ${site.name}`
  )
  const url = computed(() => site.url + route.path)
  // OG/Twitter images must be absolute URLs for social scrapers.
  const rawImage = input.ogImage ?? site.ogImage
  const image = rawImage.startsWith('http') ? rawImage : `${site.url}${rawImage}`

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    keywords: site.keywords.join(', '),
    ogUrl: () => url.value,
    ogType: input.ogType ?? 'website',
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogImage: image,
    ogImageAlt: () => title.value,
    ogSiteName: site.name,
    ogLocale: site.locale,
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: image,
    twitterImageAlt: () => title.value,
  })

  useHead({
    link: [{ rel: 'canonical', href: () => url.value }],
  })
}
