<script setup lang="ts">
import { computed, ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import { cn, kunRoundedClasses } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { checkImageValid, resizeImage } from '../utils/handleFileChange'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import KunModal from './Modal.vue'
import type { KunUploadProps } from './types'
import 'vue-advanced-cropper/dist/style.css'
import 'vue-advanced-cropper/dist/theme.compact.css'

// Image upload with drag-drop + crop (vue-advanced-cropper) + canvas resize.
// Emits the final webp Blob. cn/rounded from @kungal/ui-core; no Nuxt coupling.
defineOptions({ name: 'KunUpload' })

const props = withDefaults(defineProps<KunUploadProps>(), {
  initialImage: '',
  hint: '',
  description: '',
  className: '',
  rounded: undefined,
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

// `description` is the canonical helper name; `hint` is the deprecated alias.
const helper = computed(() => props.description || props.hint)

const emits = defineEmits<{
  /** The cropped image, once the user applies the crop. */
  setImage: [img: Blob]
}>()

const input = ref<HTMLInputElement>()
const uploadedImage = ref<Blob>()
const selectedFileUrl = ref('')
const showCropper = ref(false)
const cropperImage = ref('')

const initialImage = computed(() => props.initialImage || '')

const uploadImage = (file: File) => {
  if (!checkImageValid(file)) return
  cropperImage.value = URL.createObjectURL(file)
  showCropper.value = true
}

const handleCrop = async (cropData: { canvas: HTMLCanvasElement }) => {
  const canvas = cropData.canvas
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b)
      },
      'image/webp',
      0.77
    )
  })

  const resizedFile = await resizeImage(
    new File([blob], 'cropped.webp', { type: 'image/webp' }),
    props.size,
    props.size / props.aspect
  )

  uploadedImage.value = resizedFile
  selectedFileUrl.value = URL.createObjectURL(resizedFile)
}

const handleFileChange = (event: Event) => {
  const el = event.target as HTMLInputElement
  if (!el.files || !el.files[0]) return
  uploadImage(el.files[0])
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  const dataTransfer = event.dataTransfer
  if (dataTransfer?.files.length && dataTransfer.files[0]) {
    uploadImage(dataTransfer.files[0])
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'copy'
}

const handleClickUpload = () => {
  input.value?.click()
}

const handleApplyCrop = () => {
  if (!uploadedImage.value) return
  showCropper.value = false
  emits('setImage', uploadedImage.value)
}
</script>

<template>
  <div>
    <div
      tabindex="0"
      :class="
        cn(
          'border-default-500 hover:border-default-700 relative cursor-pointer border-2 border-dashed transition-colors',
          roundedClass,
          className
        )
      "
      :style="{ 'aspect-ratio': props.aspect }"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @click="handleClickUpload"
    >
      <div
        v-if="!selectedFileUrl && !initialImage"
        class="absolute inset-0 flex flex-col items-center justify-center"
      >
        <KunIcon name="lucide:plus" class="text-default-500 text-3xl" />
        <span v-if="helper" class="text-default-500 mt-2 text-sm">{{ helper }}</span>
      </div>

      <img
        v-if="selectedFileUrl || initialImage"
        :src="selectedFileUrl || initialImage"
        alt="上传图片"
        :class="cn('h-full w-full object-cover', roundedClass)"
      />

      <input
        ref="input"
        hidden
        type="file"
        accept=".jpg, .jpeg, .png, .webp"
        @change="handleFileChange"
      />
    </div>

    <KunModal
      :model-value="showCropper"
      :is-dismissable="false"
      @update:model-value="(value) => (showCropper = value)"
    >
      <div class="max-w-xl">
        <div class="mb-4">
          <h3 class="text-lg font-semibold">裁剪图片</h3>
        </div>

        <Cropper
          v-if="cropperImage"
          :src="cropperImage"
          :stencil-props="{ aspectRatio: props.aspect }"
          @change="handleCrop"
        />

        <div class="mt-4 flex justify-end space-x-2">
          <KunButton variant="light" color="danger" @click="showCropper = false">
            取消
          </KunButton>
          <KunButton variant="solid" color="primary" @click="handleApplyCrop">
            确定
          </KunButton>
        </div>
      </div>
    </KunModal>
  </div>
</template>
