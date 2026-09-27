<script setup lang="ts">
import { parseKunChatMarkdown } from '@kungal/ui-vue'

// `preview` is the one-line form used by conversation rows, reply and pinned
// bars: blocks run inline, links are plain text, and a spoiler's text is not
// rendered at all — only a mask.
const message = parseKunChatMarkdown(
  '结局是 ||列车长就是白本人||!**强烈推荐**,攻略见 [论坛](https://www.kungal.com/topic/1024)\n```\nwine Game.exe\n```'
)
</script>

<template>
  <div class="w-full bg-content1 border-default/20 flex max-w-sm flex-col gap-1 rounded-kun-lg border p-3 text-sm">
    <span class="font-semibold">雪之下小春</span>
    <span class="text-default-500 truncate">
      <KunChatText :text="message.text" :entities="message.entities" preview />
    </span>
  </div>
</template>
