<script setup lang="ts">
import { ref } from 'vue'

// 当"加载失败"意味着整块内容都不该出现时(例如角色立绘、装饰图),
// fallbackSrc 帮不上忙——它只是换一张图,占位盒子还在。
// 这时监听 @error,自己把整块移除。
const broken = 'https://invalid.kungal.example/not-found.png'
const ok = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23c7d2fe"/><text x="200" y="160" font-size="28" fill="%234338ca" text-anchor="middle">正常图片</text></svg>'
)}`

// 事件签名:(src, event?) —— src 是失败的那个地址,
// event 在通过 DOM 事件发现失败时存在;若失败是从缓存中直接判定的(图片
// 早已 complete 且解码失败),则没有对应的 DOM 事件,event 为 undefined。
const gone = ref(false)
const log = ref<string[]>([])
const onError = (src: string, event?: Event) => {
  gone.value = true
  log.value.push(`error: ${src.slice(0, 40)} (${event ? event.type : '无 DOM 事件'})`)
}
const onLoad = (src: string) => log.value.push(`load: ${src.slice(0, 40)}`)
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-start gap-4">
      <KunImage
        v-if="!gone"
        :src="broken"
        alt="加载失败即整体消失"
        provider="none"
        aspect-ratio="4 / 3"
        class-name="w-56 rounded-kun-lg"
        @error="onError"
        @load="onLoad"
      />
      <KunImage
        :src="ok"
        alt="正常图片"
        provider="none"
        aspect-ratio="4 / 3"
        class-name="w-56 rounded-kun-lg"
        @error="onError"
        @load="onLoad"
      />
    </div>
    <pre class="text-default-500 text-xs">{{ log.join('\n') || '等待中…' }}</pre>
  </div>
</template>
