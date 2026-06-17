import type { ComputedRef, InjectionKey } from 'vue'

// Shared between <KunCarousel> (the scroll-snap track) and <KunCarouselItem>
// (a slide that sizes itself from slidesPerView / gap).
export interface KunCarouselContext {
  slidesPerView: ComputedRef<number>
  gap: ComputedRef<string>
}

export const KUN_CAROUSEL: InjectionKey<KunCarouselContext> =
  Symbol('kun-carousel')
