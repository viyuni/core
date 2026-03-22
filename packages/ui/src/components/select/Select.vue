<script setup lang="ts">
import { cn } from '../../lib/utils'

interface Option {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    placeholder?: string
    error?: boolean
    disabled?: boolean
    options: Option[]
    class?: string
  }>(),
  {
    placeholder: '请选择',
    class: '',
  },
)

const modelValue = defineModel<string>({ default: '' })
</script>

<template>
  <select
    v-model="modelValue"
    :disabled="disabled"
    :class="cn('select select-bordered w-full', error && 'select-error', props.class)"
  >
    <option value="" disabled>{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
