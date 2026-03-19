<script setup lang="ts">
import { Copy } from 'lucide-vue-next';
import { useClipboard } from '@vueuse/core';
import { useTemplateRef, watchEffect } from 'vue';
import { JsonEditor, type JsonValue } from '@visual-json/vue';

const props = defineProps<{
  isOpen: boolean;
  rawData: JsonValue;
  parsedData?: JsonValue;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { copy } = useClipboard();

function copyObject(obj: unknown) {
  copy(JSON.stringify(obj));
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box border-2 border-base-200 overflow-hidden w-11/12 max-w-400">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-lg">JSON Detail</h3>
        <div>
          <button class="btn btn-sm btn-circle btn-ghost" @click="copyObject(rawData ?? '')">
            <Copy :size="16"></Copy>
          </button>
          <button class="btn btn-sm btn-circle btn-ghost" @click="emit('close')">✕</button>
        </div>
      </div>
      <JsonEditor
        :value="rawData"
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

    <form method="dialog" class="modal-backdrop" @click="emit('close')">
      <button>close</button>
    </form>
  </dialog>
</template>
