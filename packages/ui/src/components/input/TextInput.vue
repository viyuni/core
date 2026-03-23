<script setup lang="ts">
import { cn } from '../../lib/utils';
import type { InputProps } from './types';

const props = withDefaults(defineProps<Omit<InputProps, 'type'>>(), {
  placeholder: '',
  class: '',
});


const modelValue = defineModel<string>({ default: '' });
</script>

<template>
  <input
    v-model="modelValue"
    type="text"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="cn('input input-bordered w-full', error && 'input-error', props.class)"
  />
</template>
