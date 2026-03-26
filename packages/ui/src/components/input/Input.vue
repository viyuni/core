<script setup lang="ts">
import { cn } from '../../lib/utils';
import type { InputProps } from './types';

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  placeholder: '',
  class: '',
});

const modelValue = defineModel<string | number>({ default: '' });
</script>

<template>
  <input
    v-model="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="cn('input input-bordered w-full', error && 'input-error', props.class)"
  />
</template>
