<script setup lang="ts">
import { ref } from 'vue'

const rating = ref(3)
const page = ref(1)
const fadeShown = ref(true)
</script>

<template>
  <section class="flex flex-col gap-5">
    <h2 class="text-lg font-semibold">
      Copy · Rating · Brand · Pagination · ScrollShadow · FadeCard · Null · Favicon
    </h2>

    <div class="flex flex-wrap items-center gap-4">
      <KunCopy text="https://kungal.com" name="Copy the URL" />
      <KunRating v-model="rating" />
      <span class="text-default-500 text-sm">rating: {{ rating }}</span>
    </div>

    <h3 class="text-base font-medium">Brand</h3>
    <KunBrand name="KunUI" badge="Docs" to="#">
      <template #default />
    </KunBrand>

    <h3 class="text-base font-medium">Pagination</h3>
    <KunPagination v-model:current-page="page" :total-page="20" />

    <h3 class="text-base font-medium">ScrollShadow (scroll the row)</h3>
    <KunScrollShadow class-name="max-w-md">
      <KunCard v-for="n in 12" :key="n" color="default" class-name="w-32 shrink-0">
        Item {{ n }}
      </KunCard>
    </KunScrollShadow>

    <h3 class="text-base font-medium">FadeCard</h3>
    <div class="flex flex-col items-start gap-2">
      <KunButton size="sm" variant="bordered" @click="fadeShown = !fadeShown">
        Toggle
      </KunButton>
      <KunFadeCard>
        <KunCard v-if="fadeShown" color="primary" class-name="max-w-sm">
          Fades + expands in/out
        </KunCard>
      </KunFadeCard>
    </div>

    <h3 class="text-base font-medium">Null (empty state)</h3>
    <div class="flex flex-wrap items-center gap-8">
      <KunNull />
    </div>
  </section>
</template>
