<script setup lang="ts">
import { computed, ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { cn } from '@kungal/ui-core'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type { KunPaginationProps } from './types'

defineOptions({ name: 'KunPagination' })

const props = defineProps<KunPaginationProps>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const jumpToPage = ref('')
const kunUniqueId = useKunUniqueId('kun-pagination')

const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisiblePages = 7

  if (props.totalPage <= maxVisiblePages) {
    return Array.from({ length: props.totalPage }, (_, i) => i + 1)
  }

  pages.push(1)
  if (props.currentPage > 3) pages.push('...')

  let start = Math.max(2, props.currentPage - 1)
  let end = Math.min(props.totalPage - 1, props.currentPage + 1)
  if (props.currentPage <= 3) end = Math.min(props.totalPage - 1, 4)
  if (props.currentPage >= props.totalPage - 2) start = Math.max(2, props.totalPage - 3)

  for (let i = start; i <= end; i++) pages.push(i)

  if (props.currentPage < props.totalPage - 2) pages.push('...')
  pages.push(props.totalPage)

  return pages
})

const handlePageChange = (page: number) => {
  if (props.isLoading || page === props.currentPage) return
  emit('update:currentPage', page)
}

const handleJumpToPage = () => {
  if (props.isLoading) return
  const page = parseInt(jumpToPage.value)
  if (page && page >= 1 && page <= props.totalPage) {
    emit('update:currentPage', page)
    jumpToPage.value = ''
  }
}

// Skip global arrow-key paging when a widget owns arrow keys itself.
const KEY_OWNING_ROLES = new Set([
  'tab',
  'option',
  'menuitem',
  'menuitemradio',
  'menuitemcheckbox',
  'slider',
  'spinbutton',
  'combobox',
  'tree',
  'treeitem',
])
const isEditableTarget = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null
  if (!t) return false
  if (t.isContentEditable) return true
  const tag = t.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  const role = t.getAttribute('role')
  return !!role && KEY_OWNING_ROLES.has(role)
}

onKeyStroke('ArrowLeft', (e) => {
  if (isEditableTarget(e)) return
  if (props.currentPage > 1) handlePageChange(props.currentPage - 1)
})

onKeyStroke('ArrowRight', (e) => {
  if (isEditableTarget(e)) return
  if (props.currentPage < props.totalPage) handlePageChange(props.currentPage + 1)
})
</script>

<template>
  <div class="flex w-full flex-wrap items-center justify-between gap-4">
    <div class="mx-auto flex flex-wrap items-center gap-2">
      <div class="mx-auto flex items-center gap-2">
        <KunButton
          :is-icon-only="true"
          variant="light"
          :disabled="isLoading || currentPage === 1"
          :class="{ 'cursor-not-allowed opacity-50': isLoading || currentPage === 1 }"
          @click="handlePageChange(currentPage - 1)"
        >
          <KunIcon name="lucide:chevron-left" />
        </KunButton>

        <div class="flex items-center gap-1">
          <template v-for="page in displayedPages" :key="page">
            <KunButton
              v-if="page !== '...'"
              :variant="currentPage === page ? 'solid' : 'light'"
              size="sm"
              :disabled="isLoading"
              @click="handlePageChange(Number(page))"
            >
              {{ page }}
            </KunButton>
            <span v-else class="px-2">...</span>
          </template>
        </div>

        <KunButton
          :is-icon-only="true"
          variant="light"
          :disabled="isLoading || currentPage === totalPage"
          :class="{ 'cursor-not-allowed opacity-50': isLoading || currentPage === totalPage }"
          @click="handlePageChange(currentPage + 1)"
        >
          <KunIcon name="lucide:chevron-right" />
        </KunButton>
      </div>

      <div class="text-default-500 mx-auto hidden items-center gap-2 text-sm sm:flex">
        您可以使用 <KunIcon name="lucide:arrow-left" />
        <KunIcon name="lucide:arrow-right" /> 来进行快速翻页
      </div>
    </div>

    <div class="mx-auto flex items-center gap-2">
      <label :for="kunUniqueId" class="text-sm">跳转到页数</label>
      <input
        :id="kunUniqueId"
        v-model="jumpToPage"
        type="number"
        :disabled="isLoading"
        min="1"
        :max="totalPage"
        :class="
          cn(
            'focus:ring-primary border-default-200 w-24 rounded-md border px-2 py-1 text-sm focus:ring-1 focus:outline-none',
            isLoading && 'cursor-not-allowed opacity-50'
          )
        "
        @keyup.enter="handleJumpToPage"
      />
      <KunButton size="sm" :disabled="isLoading" @click="handleJumpToPage">
        跳转
      </KunButton>
    </div>
  </div>
</template>
