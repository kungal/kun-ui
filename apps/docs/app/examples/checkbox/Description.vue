<script setup lang="ts">
import { ref } from 'vue'
const subscribe = ref(true)
const terms = ref(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <KunCheckBox
      v-model="subscribe"
      color="primary"
      label="订阅邮件"
      description="我们会在有新内容时通知你"
    />
    <KunCheckBox
      v-model="terms"
      color="danger"
      label="我已阅读并同意条款"
      error="必须同意条款才能继续"
    />
  </div>
</template>
