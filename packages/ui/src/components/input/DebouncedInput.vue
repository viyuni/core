<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';

import { cn } from '../../lib/utils';
import type { InputProps } from './types';

const props = withDefaults(defineProps<InputProps & { debounce?: number }>(), {
  debounce: 300,
  type: 'text',
  placeholder: '',
  class: '',
});

const modelValue = defineModel<string>({ default: '' });

const handleInput = useDebounceFn((event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  modelValue.value = value;
}, props.debounce);
</script>

<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :class="cn('input input-bordered', props.class)"
    :value="modelValue"
    @input="handleInput($event)"
  />
</template>
