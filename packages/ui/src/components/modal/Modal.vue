<script setup lang="ts">
import { cn } from '../../lib/utils';

const props = defineProps<{
  class?: string;
}>();

const isOpen = defineModel<boolean>('open', { default: false });

const emit = defineEmits<{
  close: [];
}>();

function handleClose() {
  isOpen.value = false;
  emit('close');
}

function handleBackdropClick() {
  handleClose();
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div :class="cn('modal-box border-2 border-base-200', props.class)">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <slot name="title">
          <h3 class="font-bold text-lg">
            <slot name="title-text" />
          </h3>
        </slot>
        <slot name="close-btn" :on-close="handleClose">
          <button class="btn btn-sm btn-circle btn-ghost" @click="handleClose">✕</button>
        </slot>
      </div>

      <!-- Content -->
      <div class="py-4">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="$slots.footer" class="modal-action">
        <slot name="footer" />
      </div>
    </div>

    <form method="dialog" class="modal-backdrop" @click="handleBackdropClick">
      <button>close</button>
    </form>
  </dialog>
</template>
