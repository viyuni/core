<script setup lang="ts">
import { JsonEditor } from '@visual-json/vue';
import { Modal } from '@viyuni/ui';
import { useClipboard } from '@vueuse/core';
import { Copy } from 'lucide-vue-next';

const props = defineProps<{
  open: boolean;
  data: any;
}>();


const emit = defineEmits<{
  close: [];
}>();


const { copy } = useClipboard();


function copyObject(obj: unknown) {
  copy(JSON.stringify(obj));
}


function handleClose() {
  emit('close');
}
</script>

<template>
  <Modal :open class="overflow-hidden w-11/12 max-w-400" @close="handleClose">
    <template #title>
      <h3 class="font-bold text-lg">JSON Detail</h3>
    </template>
    <template #close-btn="{ onClose }">
      <div class="flex gap-1">
        <button class="btn btn-sm btn-circle btn-ghost" @click="copyObject(data ?? '')">
          <Copy :size="16"></Copy>
        </button>
        <button class="btn btn-sm btn-circle btn-ghost" @click="onClose">✕</button>
      </div>
    </template>
    <div class="-m-4">
      <JsonEditor
        :value="data"
        :readOnly="true"
        :tree-show-values="true"
        :tree-show-counts="true"
        :editorShowCounts="true"
        :editor-show-descriptions="true"
        :sidebar-open="true"
        :height="680"
        :style="{
          '--vj-bg': 'var(--color-base-100)',
          '--vj-text': 'var(--color-base-content)',
          '--vj-border': 'var(--color-base-200)',
          '--vj-bg-selected': 'var(--selection-background)',
          '--vj-bg-panel': 'var(--color-base-200)',
          '--vj-font': '\'Fira Code\', monospace',
          '--vj-bg-hover': 'var(--selection-background)',
          '--vj-bg-selected-muted': 'var(--color-base-200)',
        }"
      >
      </JsonEditor>
    </div>
  </Modal>
</template>
