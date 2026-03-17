<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';

defineProps<{
  cmd?: string | null;
}>();

const emit = defineEmits<{
  'update:cmd': [value: string];
}>();

const handleCmdInput = useDebounceFn((event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:cmd', value);
}, 300);
</script>

<template>
  <div class="flex gap-2">
    <div>
      <input
        type="text"
        placeholder="CMD"
        class="input input-sm"
        :value="cmd"
        @input="handleCmdInput($event)"
      />
    </div>
  </div>
</template>
