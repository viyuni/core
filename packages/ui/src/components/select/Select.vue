<script setup lang="ts">
import { cn } from '../../lib/utils';

interface Option {
  label: string;
  value: string | null;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    options: Option[];
    class?: string;
  }>(),
  {
    placeholder: 'Please select',
    class: '',
  },
);

const modelValue = defineModel<string | null | undefined>();
</script>

<template>
  <select
    v-model="modelValue"
    :disabled="disabled"
    :class="cn('select select-bordered', error && 'select-error', props.class)"
  >
    <option
      v-for="option in options"
      :key="option.value ?? 'UNSELECT'"
      :value="option.value"
      :disabled="option.disabled"
    >
      {{ option.label }}
    </option>
  </select>
</template>
