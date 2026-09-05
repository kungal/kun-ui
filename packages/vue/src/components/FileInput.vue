<script setup lang="ts">
import { computed, watch } from 'vue'
import { cn } from '@kungal/ui-core'
import { useFilePicker } from '../composables/useFilePicker'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type { KunFileInputProps } from './types'

// Thin declarative wrapper over useFilePicker. Two named v-models:
//   single (default): v-model="file"        File | null
//   multi:            v-model:files="files"  File[]
defineOptions({ name: 'KunFileInput' })

const props = withDefaults(defineProps<KunFileInputProps>(), {
  accept: '',
  multiple: false,
  maxSize: undefined,
  hint: '',
  description: '',
  error: '',
  disabled: false,
  triggerText: '选择文件',
  triggerIcon: 'lucide:upload',
  triggerVariant: 'flat',
  triggerColor: 'primary',
  triggerSize: 'md',
  fullWidth: false,
  showFileName: true,
  className: '',
})

const file = defineModel<File | null>({ default: null })
const filesModel = defineModel<File[]>('files', { default: () => [] })

const emit = defineEmits<{
  /** The files that passed `accept` and `maxSize`. */
  change: [picked: File[]]
  /** A human-readable reason a picked file was rejected. */
  errorPick: [message: string]
}>()

// `description` is the canonical helper name; `hint` is the deprecated alias.
const helper = computed(() => props.description || props.hint)

const { pickFiles, files: pickedFiles } = useFilePicker({
  accept: props.accept || undefined,
  multiple: props.multiple,
  maxSize: props.maxSize,
  onError: (msg) => emit('errorPick', msg),
})

watch(pickedFiles, (next) => {
  // Cancelled dialog → keep previous selection (native behavior).
  if (next.length === 0) return
  if (props.multiple) {
    filesModel.value = next
  } else {
    file.value = next[0] ?? null
  }
  emit('change', next)
})

const displayName = computed<string | null>(() => {
  if (props.multiple) {
    const n = filesModel.value.length
    return n === 0 ? null : `已选 ${n} 个文件`
  }
  return file.value?.name ?? null
})

const handlePick = () => {
  if (props.disabled) return
  pickFiles()
}
</script>

<template>
  <div :class="cn('flex flex-col gap-1', className)">
    <div class="flex items-center gap-2">
      <slot :pick="handlePick" :disabled="disabled" :file-name="displayName">
        <KunButton
          :variant="triggerVariant"
          :color="triggerColor"
          :size="triggerSize"
          :disabled="disabled"
          :full-width="fullWidth"
          type="button"
          @click="handlePick"
        >
          <KunIcon v-if="triggerIcon" :name="triggerIcon" class="mr-1 size-4" />
          {{ triggerText }}
        </KunButton>
      </slot>
      <span
        v-if="showFileName && displayName"
        class="text-default-500 truncate text-sm"
      >
        {{ displayName }}
      </span>
    </div>
    <p v-if="helper && !error" class="text-default-400 text-xs">{{ helper }}</p>
    <p v-if="error" class="text-danger text-xs">{{ error }}</p>
  </div>
</template>
