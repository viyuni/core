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
        <h3 class="font-bold text-lg pb-4">JSON Detail</h3>
        <button class="btn btn-sm btn-circle btn-ghost" @click="emit('close')">✕</button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="p-4">
          <div
            class="font-medium text-xs uppercase tracking-wider flex justify-between items-center"
          >
            <h2>原始数据</h2>

            <button class="btn btn-sm btn-square" @click="copyObject(rawData ?? '')">
              <Copy :size="16"></Copy>
            </button>
          </div>

          <div>
            <JsonEditor
              :value="rawData"
              :readOnly="true"
              :tree-show-values="true"
              :tree-show-counts="true"
              :editorShowCounts="true"
              :editor-show-descriptions="true"
              :sidebar-open="false"
              :height="1000"
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
        </div>

        <div>
          <div
            class="font-medium text-xs uppercase tracking-wider flex justify-between items-center"
          >
            <h2>解析数据</h2>

            <button class="btn btn-sm btn-square" @click="copyObject(parsedData ?? '')">
              <Copy :size="16"></Copy>
            </button>
          </div>

          <div class="overflow-auto p-4 max-h-200">
            <JsonEditor
              v-if="parsedData"
              :value="parsedData"
              :readOnly="true"
              :tree-show-values="true"
              :tree-show-counts="true"
              :editorShowCounts="true"
              :editor-show-descriptions="true"
              :sidebar-open="false"
              :height="1000"
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
            <div v-else class="text-base-content/50 italic text-sm">暂无解析数据</div>
          </div>
        </div>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop" @click="emit('close')">
      <button>close</button>
    </form>
  </dialog>
</template>
