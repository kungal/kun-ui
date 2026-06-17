<script setup lang="ts">
import { ref } from 'vue'
const open = ref<string[]>(['a'])
</script>

<template>
  <KunAccordion v-model="open" multiple class-name="max-w-lg">
    <KunAccordionItem value="a" title="可以同时展开多个" icon="lucide:check">
      传入 multiple 后,多个区块可同时打开;v-model 绑定一个数组。
    </KunAccordionItem>
    <KunAccordionItem value="b" title="第二个区块" icon="lucide:check">
      当前展开:{{ open.join(', ') || '无' }}
    </KunAccordionItem>
    <KunAccordionItem value="c" title="第三个区块" icon="lucide:check">
      点击多个头部试试。
    </KunAccordionItem>
  </KunAccordion>
</template>
