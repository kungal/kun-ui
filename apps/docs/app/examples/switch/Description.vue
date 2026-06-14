<script setup lang="ts">
import { ref } from 'vue'
const notify = ref(true)
const sync = ref(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <KunSwitch v-model="notify" label="邮件通知" description="有新消息时我们会发邮件给你" />
    <KunSwitch v-model="sync" label="自动同步" description="在所有设备间保持数据一致" />
  </div>
</template>
