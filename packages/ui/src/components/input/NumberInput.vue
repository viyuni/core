<script setup lang="ts">
import { cn } from '../../lib/utils';
import type { InputProps } from './types';

const props = withDefaults(
  defineProps<Omit<InputProps, 'type'> & { min?: number; max?: number; step?: number }>(),
  {
    placeholder: '',
    class: '',
  },
);


const modelValue = defineModel<number | null>({ default: null });


const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  modelValue.value = value === '' ? null : Number.parseFloat(value);
};
</script>

<template>
  <input
    type="number"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="modelValue ?? ''"
    :min="min"
    :max="max"
    :step="step"
    :class="cn('input input-bordered w-full', error && 'input-error', props.class)"
    @input="handleInput"
  />
</template>
