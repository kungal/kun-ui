<script setup lang="ts">
import { ref } from 'vue'
import type {
  KunRadioOption,
  KunSelectOption,
  KunAutocompleteOption,
} from '@kungal/ui-vue'

const text = ref('')
const password = ref('')
const bio = ref('')
const on = ref(true)
const checked = ref(false)
const slider = ref(40)
const radio = ref('vue')

// Select (single / searchable / multiple)
const selectValue = ref<string>('vue')
const multiValue = ref<string[]>(['vue', 'solid'])
const selectOptions: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
  { value: 'qwik', label: 'Qwik' },
]

// Autocomplete
const acText = ref('')
const acOptions: KunAutocompleteOption[] = [
  { value: 'tokyo', label: '東京 Tokyo' },
  { value: 'osaka', label: '大阪 Osaka' },
  { value: 'kyoto', label: '京都 Kyoto' },
  { value: 'sapporo', label: '札幌 Sapporo' },
  { value: 'nagoya', label: '名古屋 Nagoya' },
]

// NumberInput + PinInput
const qty = ref<number | null>(3)
const price = ref<number | null>(19.9)
const freeNum = ref<number | null>(null)
const pin = ref('')

// CheckBox indeterminate (select-all)
const items = ref([
  { id: 1, label: 'Item A', checked: true },
  { id: 2, label: 'Item B', checked: false },
  { id: 3, label: 'Item C', checked: false },
])
const allChecked = () => items.value.every((i) => i.checked)
const someChecked = () => items.value.some((i) => i.checked) && !allChecked()
const toggleAll = (v: boolean) => items.value.forEach((i) => (i.checked = v))

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
        description="Helper text below the field"
        :is-clearable="true"
        :required="true"
      />
      <KunInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        :reveal-password="true"
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

    <h3 class="text-default-600 text-sm font-semibold">Select · Autocomplete</h3>
    <div class="grid max-w-md gap-4">
      <KunSelect
        v-model="selectValue"
        :options="selectOptions"
        label="Single (keyboard + type-ahead)"
        :clearable="true"
        description="Try ↑/↓, Enter, Esc, Home/End, or type a letter"
      />
      <KunSelect
        v-model="selectValue"
        :options="selectOptions"
        label="Searchable"
        :searchable="true"
      />
      <KunSelect
        v-model="multiValue"
        :options="selectOptions"
        label="Multiple + searchable"
        :multiple="true"
        :searchable="true"
      />
      <KunAutocomplete
        v-model="acText"
        :options="acOptions"
        label="Autocomplete (combobox)"
        placeholder="Type a city…"
        :clearable="true"
      />
    </div>

    <h3 class="text-default-600 text-sm font-semibold">NumberInput · PinInput</h3>
    <div class="grid max-w-md gap-4">
      <KunNumberInput v-model="qty" label="Quantity" :min="0" :max="10" />
      <KunNumberInput
        v-model="price"
        label="Price"
        :min="0"
        :step="0.1"
        :precision="2"
      />
      <KunNumberInput v-model="freeNum" label="Unbounded (empty start)" />
      <div>
        <p class="text-default-700 mb-1 text-sm font-medium">OTP / PIN</p>
        <KunPinInput v-model="pin" :length="6" />
        <p class="text-default-500 mt-1 text-sm">值: {{ pin || '—' }}</p>
      </div>
    </div>

    <h3 class="text-default-600 text-sm font-semibold">Toggles</h3>
    <div class="flex flex-wrap items-center gap-6">
      <KunSwitch v-model="on" label="Notifications" description="We'll email you" />
      <KunCheckBox v-model="checked" color="primary" label="I agree" />
      <KunCheckBox :model-value="true" type="single" color="success" label="Single (radio-look)" />
    </div>

    <div class="max-w-xs">
      <KunCheckBox
        :model-value="allChecked()"
        :indeterminate="someChecked()"
        color="primary"
        label="Select all"
        @change="toggleAll"
      />
      <div class="mt-2 ml-6 flex flex-col gap-1">
        <KunCheckBox
          v-for="item in items"
          :key="item.id"
          v-model="item.checked"
          color="primary"
          :label="item.label"
        />
      </div>
    </div>

    <h3 class="text-default-600 text-sm font-semibold">Slider</h3>
    <div class="max-w-md">
      <KunSlider
        v-model="slider"
        label="Volume"
        :show-value="true"
        :show-tooltip="true"
        :marks="[0, 25, 50, 75, 100]"
      />
      <KunSlider
        v-model="slider"
        class="mt-6"
        color="secondary"
        :marks="[
          { value: 0, label: 'Min' },
          { value: 50, label: 'Mid' },
          { value: 100, label: 'Max' },
        ]"
      />
      <KunSlider v-model="slider" class="mt-6" :disabled="true" description="Disabled" />
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
