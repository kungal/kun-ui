<script setup lang="ts">
import type { KunUser, KunSelectOption, KunRadioOption, KunTabItem, KunDropdownItem } from '@kungal/ui-vue'

// Exercises EVERY public component so each one's SSR setup() runs under Nuxt.
const modalOpen = ref(false)
const drawerOpen = ref(false)
const lightboxOpen = ref(false)
const sw = ref(true)
const cb = ref(false)
const slider = ref(40)
const radio = ref('a')
const tab = ref('a')
const text = ref('')
const tags = ref(['vue'])
const single = ref<string | null>('')
const sel = ref('a')
const file = ref<File | null>(null)
const rating = ref(3)
const page = ref(1)

const avatar = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%237c3aed"/></svg>')}`
const user: KunUser = { id: 1, name: 'Kun', avatar }
const users: KunUser[] = [user, { id: 2, name: 'B', avatar }]
const selOpts: KunSelectOption[] = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]
const radioOpts: KunRadioOption[] = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]
const tabItems: KunTabItem[] = [{ value: 'a', textValue: 'A' }, { value: 'b', textValue: 'B' }]
const ddItems: KunDropdownItem[] = [{ key: 'x', label: 'X' }]
const lbImages = [{ src: avatar, alt: 'a' }]
const html = '<p>trusted <strong>html</strong></p>'
</script>

<template>
  <div class="flex min-h-screen flex-col gap-4 p-6">
    <KunHeader name="KunUI on Nuxt — full SSR check" scale="h2" />

    <!-- display -->
    <section class="flex flex-wrap items-center gap-2">
      <KunButton color="primary">Btn</KunButton>
      <KunButton href="/about" variant="light">Link btn</KunButton>
      <KunBadge :count="3"><KunIcon name="lucide:info" class="text-2xl" /></KunBadge>
      <KunChip color="success">chip</KunChip>
      <KunIcon name="lucide:check" class="text-success text-2xl" />
      <KunImage :src="avatar" alt="img" class-name="size-10" />
      <KunImageNative :src="avatar" alt="n" :width="40" />
      <KunLink to="/about">link</KunLink>
      <KunBrand name="KunUI" to="#" :icon-src="avatar" />
      <KunFavicon class="size-6" />
      <KunMarkdown class="size-5" />
      <KunCopy text="copy-me" />
      <KunRating v-model="rating" />
    </section>

    <KunCard color="default" class-name="max-w-sm">card body</KunCard>
    <KunLoading :loading="false" :src="avatar"><div>wrapped content</div></KunLoading>
    <KunDivider>or</KunDivider>
    <KunProgress :value="60" />
    <KunInfo color="primary" icon="lucide:info" title="Info" description="callout" />
    <KunHeader name="sub" scale="h3" />

    <!-- form -->
    <section class="grid max-w-md gap-3">
      <KunInput v-model="text" label="Input" />
      <KunTextarea v-model="text" label="Textarea" />
      <KunSwitch v-model="sw" label="switch" />
      <KunCheckBox v-model="cb" label="check" />
      <KunSlider v-model="slider" :min="0" :max="100" />
      <KunRadioGroup v-model="radio" :options="radioOpts" />
      <KunDatePicker v-model="single" label="date" />
      <KunSelect v-model="sel" :options="selOpts" label="select" />
      <KunFileInput v-model="file" />
      <KunTagInput v-model="tags" label="tags" />
      <KunUpload :size="200" :aspect="1" hint="upload" class-name="w-32" />
    </section>

    <!-- overlay (default closed — setup still runs on SSR) -->
    <section class="flex flex-wrap items-center gap-2">
      <KunTab v-model="tab" :items="tabItems" />
      <KunTooltip text="tip"><KunButton variant="bordered">tip</KunButton></KunTooltip>
      <KunPopover><template #trigger><KunButton>pop</KunButton></template><div class="p-3">popover</div></KunPopover>
      <KunDropdown :items="ddItems"><template #trigger><KunButton>menu</KunButton></template></KunDropdown>
      <KunButton @click="modalOpen = true">modal</KunButton>
      <KunButton @click="drawerOpen = true">drawer</KunButton>
      <KunButton @click="lightboxOpen = true">lightbox</KunButton>
      <KunModal v-model="modalOpen"><div class="p-2">modal</div></KunModal>
      <KunDrawer v-model="drawerOpen" title="drawer"><p>drawer body</p></KunDrawer>
      <KunLightbox v-model:is-open="lightboxOpen" :images="lbImages" />
      <KunLightboxGallery>
        <KunLightboxGalleryItem :src="avatar" alt="g"><img :src="avatar" class="size-10" alt="" /></KunLightboxGalleryItem>
      </KunLightboxGallery>
    </section>

    <!-- content -->
    <KunContent :content="html" />
    <KunText content="a_b/c" />

    <!-- people -->
    <section class="flex items-center gap-4">
      <KunAvatar :user="user" :is-navigation="false" />
      <KunAvatarGroup :users="users" :total="5" />
      <KunUserChip :user="user" description="member" />
    </section>

    <!-- util -->
    <KunScrollShadow class-name="max-w-xs">
      <KunCard v-for="n in 6" :key="n" color="default" class-name="w-24 shrink-0">{{ n }}</KunCard>
    </KunScrollShadow>
    <KunPagination v-model:current-page="page" :total-page="10" />
    <KunFadeCard><KunCard color="primary" class-name="max-w-xs">fade</KunCard></KunFadeCard>
    <KunNull description="empty" :is-show-sticker="false" />

    <!-- triggers -->
    <section class="flex flex-wrap gap-2">
      <KunButton @click="useKunMessage('toast', 'success')">toast</KunButton>
      <KunButton @click="useKunAlert({ title: 'a', message: 'b' })">alert</KunButton>
      <KunButton @click="useKunLoliInfo('loli', 3)">loli</KunButton>
    </section>

    <!-- mounted-once providers -->
    <KunMessageProvider />
    <KunAlertProvider />
    <KunLoliProvider />
  </div>
</template>
