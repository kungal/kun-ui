<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <KunButton color="primary" @click="open = true">带标题的抽屉</KunButton>

  <KunDrawer v-model="open" title="个人设置">
    <p class="text-default-600 text-sm">
      设置 <code>title</code> 后,抽屉顶部会渲染一个带标题的头部栏,
      并自动关联 <code>aria-labelledby</code> 以提升可访问性。
    </p>
  </KunDrawer>
</template>
