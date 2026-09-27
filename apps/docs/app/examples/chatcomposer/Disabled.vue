<script setup lang="ts">
// When sending is not possible — the other account was deleted, you were
// blocked — the input gives way to a line saying why.
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <KunChatComposer disabled disabled-text="对方已注销,无法继续发送消息" />
  </div>
</template>
