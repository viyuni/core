<script setup lang="ts">
import { cn } from '../../lib/utils';

const props = withDefaults(
  defineProps<{
    error?: boolean;
    disabled?: boolean;
    class?: string;
  }>(),
  {
    class: '',
  },
);


const modelValue = defineModel<boolean>({ default: false });
</script>

<template>
  <input
    v-model="modelValue"
    type="checkbox"
    :disabled="disabled"
    :class="cn('toggle toggle-success', error && 'input-error', props.class)"
  />
</template>
