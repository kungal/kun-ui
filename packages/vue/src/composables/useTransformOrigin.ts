import { computed, type Ref } from 'vue'

// Maps a floating-ui placement to the CSS transform-origin that makes a panel
// appear to grow OUT OF its trigger (origin sits on the edge nearest the
// trigger). Uses the post-flip placement, so a menu that flips above its
// trigger correctly grows from its bottom edge.
const PLACEMENT_ORIGIN: Record<string, string> = {
  bottom: 'top center',
  'bottom-start': 'top left',
  'bottom-end': 'top right',
  top: 'bottom center',
  'top-start': 'bottom left',
  'top-end': 'bottom right',
  left: 'center right',
  'left-start': 'top right',
  'left-end': 'bottom right',
  right: 'center left',
  'right-start': 'top left',
  'right-end': 'bottom left',
}

export const useTransformOrigin = (placement: Ref<string>) =>
  computed(() => PLACEMENT_ORIGIN[placement.value] ?? 'top center')
