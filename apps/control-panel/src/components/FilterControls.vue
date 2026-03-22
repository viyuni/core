<script setup lang="ts">
import { DebouncedInput } from '@viyuni/ui';

defineProps<{
  cmd?: string | null;
}>();

const emit = defineEmits<{
  'update:cmd': [value: string];
}>();
</script>

<template>
  <div class="flex gap-2">
    <DebouncedInput
      :model-value="cmd ?? ''"
      placeholder="CMD"
      class="input input-sm"
      @update:model-value="emit('update:cmd', $event)"
    />
  </div>
</template>
