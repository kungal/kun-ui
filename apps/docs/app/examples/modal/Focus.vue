<script setup lang="ts">
import { nextTick, ref } from 'vue'

const text = ref('把光标放到想插入链接的位置,再点上面的按钮。')
const url = ref('')
const open = ref(false)
const editor = ref<{
  focus: (options?: FocusOptions) => void
  insertAtCaret: (text: string) => void
} | null>(null)

// `return-focus` is false, so the dialog leaves focus alone and the editor
// takes it back, caret and all, once the close has been applied.
const backToEditor = (insert?: string) =>
  nextTick(() => {
    editor.value?.focus({ preventScroll: true })
    if (insert) editor.value?.insertAtCaret(insert)
  })

const confirm = () => {
  const link = url.value.trim()
  open.value = false
  url.value = ''
  backToEditor(link && `[链接](${link})`)
}

const cancel = () => {
  open.value = false
  backToEditor()
}
</script>

<template>
  <div class="flex w-full max-w-lg flex-col gap-2">
    <div>
      <KunButton size="sm" variant="bordered" @click="open = true">插入链接</KunButton>
    </div>
    <KunTextarea ref="editor" v-model="text" label="正文" />
    <KunModal
      v-model="open"
      title="插入链接"
      initial-focus="input"
      :return-focus="false"
      @close="backToEditor()"
    >
      <form class="flex flex-col gap-4" @submit.prevent="confirm">
        <KunInput v-model="url" label="链接地址" placeholder="https://www.kungal.com" />
        <div class="flex justify-end gap-2">
          <KunButton variant="light" @click="cancel">取消</KunButton>
          <KunButton type="submit" color="primary">插入</KunButton>
        </div>
      </form>
    </KunModal>
  </div>
</template>
