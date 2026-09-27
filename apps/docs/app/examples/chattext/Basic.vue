<script setup lang="ts">
import { parseKunChatMarkdown } from '@kungal/ui-vue'
import { ME } from '~/utils/chatDemo'

// text + entities exactly as the API returns them. Here they come from the
// composer syntax, which is how a real message gets its entities too.
const message = parseKunChatMarkdown(
  [
    '**《星空鉄道とシロの旅》** 补丁更新了,__主线__ 已经 ++完整++ 汉化,~~番外还在路上~~ 番外下月补齐。',
    `安装说明见 [补丁页](https://www.moyu.moe/patch/3021/introduction),有问题 [@鲲](mention:${ME})。`,
    '> 转区后再启动,不然会乱码。',
    '启动命令:',
    '```shell\nLANG=ja_JP.UTF-8 wine "Game.exe"\n```',
    '存档在 `%APPDATA%/StarRail` 下面。',
  ].join('\n')
)
</script>

<template>
  <div class="w-full bg-content1 border-default/20 rounded-kun-lg border p-4 text-[0.9375rem] leading-snug">
    <KunChatText :text="message.text" :entities="message.entities" />
  </div>
</template>
