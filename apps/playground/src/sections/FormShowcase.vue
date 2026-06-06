<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const text = ref('')
const bio = ref('')
const on = ref(true)
const checked = ref(false)
const slider = ref(40)
const radio = ref('vue')

const radioOptions: KunRadioOption[] = [
  { value: 'vue', label: 'Vue', description: 'The Progressive Framework' },
  { value: 'react', label: 'React', description: 'A library for web UIs' },
  { value: 'solid', label: 'Solid', description: 'Simple and performant' },
  { value: 'svelte', label: 'Svelte', description: 'Disabled', disabled: true },
]
</script>

<template>
  <section class="flex flex-col gap-5">
    <h2 class="text-lg font-semibold">Form controls (v-model)</h2>

    <div class="grid max-w-md gap-4">
      <KunInput
        v-model="text"
        label="Username"
        placeholder="Type here…"
        helper-text="Helper text below the field"
        :required="true"
      />
      <KunInput
        v-model="text"
        label="With error"
        color="danger"
        error="This field is required"
      />
      <KunTextarea
        v-model="bio"
        label="Bio"
        placeholder="Tell us about yourself"
        :show-char-count="true"
        :maxlength="200"
        :auto-grow="true"
      />
    </div>

    <div class="flex flex-wrap items-center gap-6">
      <KunSwitch v-model="on" label="Notifications" />
      <KunCheckBox v-model="checked" color="primary" label="I agree" />
      <KunCheckBox :model-value="true" type="single" color="success" label="Single (radio-look)" />
    </div>

    <div class="max-w-md">
      <p class="text-default-500 mb-1 text-sm">Slider: {{ slider }}</p>
      <KunSlider v-model="slider" :min="0" :max="100" />
    </div>

    <div class="flex flex-wrap gap-8">
      <KunRadioGroup
        v-model="radio"
        label="Classic"
        :options="radioOptions"
        color="primary"
      />
      <KunRadioGroup
        v-model="radio"
        label="Card variant"
        variant="card"
        :options="radioOptions"
        color="secondary"
      />
    </div>
  </section>
</template>
