<script setup lang="ts">
import { ref } from 'vue'
import { parseKunChatMarkdown } from '@kungal/ui-vue'

// Links open in a new tab and mentions link to the profile by default; both
// emit first, so a site can take over — route an in-site URL, open a user card.
const message = parseKunChatMarkdown(
  '[@雪之下小春](mention:1002) 发了 [补丁页](https://www.moyu.moe/patch/3021/introduction),详见 https://www.kungal.com/topic/1024'
)
// The server marks bare URLs with a `url` entity; the demo does it by hand.
const at = message.text.indexOf('https://www.kungal.com')
message.entities.push({ type: 'url', offset: at, length: message.text.length - at })
const log = ref('点一下链接或提及')

const onLink = (url: string, event: MouseEvent) => {
  event.preventDefault()
  log.value = `link → ${url}`
}
const onMention = (id: string, event: MouseEvent) => {
  event.preventDefault()
  log.value = `mention → 用户 ${id}`
}
</script>

<template>
  <div class="w-full bg-content1 border-default/20 flex flex-col gap-2 rounded-kun-lg border p-4 text-[0.9375rem]">
    <KunChatText :text="message.text" :entities="message.entities" @link="onLink" @mention="onMention" />
    <code class="text-default-500 text-xs">{{ log }}</code>
  </div>
</template>
