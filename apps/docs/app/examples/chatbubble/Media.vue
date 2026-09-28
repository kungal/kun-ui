<script setup lang="ts">
import { DEMO_TZ, demoMessage, demoPhoto, demoTime, demoUsers } from '~/utils/chatDemo'

// A photo keeps its shape inside 320 × 420; photos sharing a `media_group_id`
// are one album, laid out with Telegram's mosaic. A thumbhash shows while the
// image loads; a click opens the lightbox. The photo's `url` is shown as the
// server sends it; pass `resolve-media-url` to serve a smaller preview.
const photo = demoMessage('1002', demoTime(0, '09:13'), '', { media: demoPhoto('bg/bg36', 1920, 1080) })
const captioned = demoMessage('1002', demoTime(0, '09:14'), '片头曲好好听,这张是开场动画的截图', {
  media: demoPhoto('ren/2337', 290, 599),
})
const album = [
  demoPhoto('bg/bg12', 1920, 1080),
  demoPhoto('ren/2339', 367, 602),
  demoPhoto('bg/bg25', 1920, 1239),
  demoPhoto('bg/bg4', 1920, 1200),
  demoPhoto('bg/bg45', 1920, 1268),
].map((media, i) =>
  demoMessage('1002', demoTime(0, '10:33'), i === 4 ? '通关了!最喜欢的五张 CG' : '', { media, media_group_id: '5001' })
)
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col gap-2 rounded-kun-lg p-3">
    <KunChatBubble :message="photo" :users="demoUsers" :time-zone="DEMO_TZ" />
    <KunChatBubble :message="captioned" :users="demoUsers" :time-zone="DEMO_TZ" />
    <KunChatBubble
      :message="album[4]!"
      :album="album"
      :users="demoUsers"
      :time-zone="DEMO_TZ"
    />
  </div>
</template>
