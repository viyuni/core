<script setup lang="ts">
import { cn } from '../../lib/utils';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    rows?: number;
    class?: string;
  }>(),
  {
    placeholder: '',
    rows: 3,
    class: '',
  },
);


const modelValue = defineModel<string>({ default: '' });
</script>

<template>
  <textarea
    v-model="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :class="cn('textarea textarea-bordered w-full', error && 'textarea-error', props.class)"
  />
</template>
