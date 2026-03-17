<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';

defineProps<{
  range: [number, number]
  total: number
  limit?: number
  offset?: number
}>()

const emit = defineEmits<{
  prevPage: []
  nextPage: []
  'update:limit': [value: number]
  'update:offset': [value: number]
}>()

const handleLimitChange = useDebounceFn((value: number) => {
  emit('update:limit', value)
}, 300)

const handleOffsetChange = useDebounceFn((value: number) => {
  emit('update:offset', value)
}, 300)
</script>

<template>
  <div class="join">
    <button class="join-item btn btn-sm" @click="emit('prevPage')">«</button>

    <button class="join-item btn btn-sm" popovertarget="popover-offset-limit" style="anchor-name:--anchor-offset-limit">
      {{ range[0] }} - {{ range[1] }}
      of {{ total ?? 0 }}
    </button>

    <div class="dropdown dropdown-center bg-base-100 border border-base-200 rounded-box z-1 w-52 p-4 shadow-sm mt-1"
      popover id="popover-offset-limit" style="position-anchor:--anchor-offset-limit">
      <div class="flex gap-2">
        <div>
          <label class="label text-xs">
            <span class="label-text">Limit</span>
          </label>
          <input class="input input-xs rounded-md text-center" type="number" min="0" :value="limit"
            @input="handleLimitChange(Number(($event.target as HTMLInputElement).value))" />
        </div>

        <div>
          <label class="label text-xs">
            <span class="label-text">Offset</span>
          </label>
          <input class="input input-xs rounded-md text-center" type="number" min="0" :value="offset"
            @input="handleOffsetChange(Number(($event.target as HTMLInputElement).value))" />
        </div>
      </div>
    </div>

    <button class="join-item btn btn-sm" @click="emit('nextPage')">»</button>
  </div>
</template>
