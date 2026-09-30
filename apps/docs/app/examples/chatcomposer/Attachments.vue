<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { KunChatAttachment } from '@kungal/ui-vue'

// Pick, paste or drop images: `attach` hands over the files. The site uploads
// them (NextMoe: POST /v2/chat/images) and lists them in `attachments` with a
// local preview and progress; a failed one is a button that emits
// `retry-attachment`. Here every third upload fails once.
const attachments = ref<KunChatAttachment[]>([])
const draft = ref('')
let count = 0
const urls: string[] = []

const upload = (key: string) => {
  const item = attachments.value.find((a) => a.key === key)
  if (!item) return
  Object.assign(item, { progress: 0, error: false })
  const fail = ++count % 3 === 0
  const tick = setInterval(() => {
    const a = attachments.value.find((x) => x.key === key)
    if (!a) return clearInterval(tick)
    a.progress = Math.min(1, (a.progress ?? 0) + 0.2)
    if (fail && a.progress >= 0.6) {
      clearInterval(tick)
      a.error = true
    } else if (a.progress >= 1) {
      clearInterval(tick)
      a.progress = undefined
    }
  }, 250)
}

const onAttach = (files: File[]) => {
  for (const file of files.filter((f) => f.type.startsWith('image/'))) {
    const url = URL.createObjectURL(file)
    urls.push(url)
    const key = `${file.name}-${Date.now()}-${Math.random()}`
    attachments.value.push({ key, url, name: file.name, progress: 0 })
    upload(key)
  }
}
const remove = (key: string) => (attachments.value = attachments.value.filter((a) => a.key !== key))
const send = () => (attachments.value = [])
onBeforeUnmount(() => urls.forEach((u) => URL.revokeObjectURL(u)))
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <p class="text-foreground-muted px-3 pt-3 text-xs">点回形针选图,或把图片粘贴 / 拖到输入区。</p>
    <KunChatComposer
      v-model="draft"
      :attachments="attachments"
      @attach="onAttach"
      @remove-attachment="remove"
      @retry-attachment="upload"
      @send="send"
    />
  </div>
</template>
