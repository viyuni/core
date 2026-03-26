<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { ref, watch } from 'vue';

const emit = defineEmits<{
  'update:gift1Speed': [value: number];
  'update:gift2Speed': [value: number];
  'update:guardSpeed': [value: number];
  pause: [];
  resume: [];
}>();

const gift1Speed = useLocalStorage('gift1-speed', 200);
const gift2Speed = useLocalStorage('gift2-speed', 200);
const guardSpeed = useLocalStorage('guard-speed', 200);

watch(gift1Speed, (v) => emit('update:gift1Speed', v));
watch(gift2Speed, (v) => emit('update:gift2Speed', v));
watch(guardSpeed, (v) => emit('update:guardSpeed', v));

const isOpen = ref(true);
const presetSpeeds = [50, 100, 200, 500, 1000];

function pauseAll() {
  emit('pause');
}

function resumeAll() {
  emit('resume');
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 w-f">
    <div
      v-if="isOpen"
      class="bg-base-200/95 backdrop-blur rounded-lg shadow-xl p-4 w-64 border border-base-200"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-sm">速度控制</h3>
        <button class="btn btn-ghost btn-xs" @click="isOpen = false">✕</button>
      </div>

      <div class="space-y-4">
        <!-- Gift 1 Speed -->
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span>礼物流1</span>
            <span class="font-mono">{{ gift1Speed }}ms</span>
          </div>
          <input
            v-model.number="gift1Speed"
            type="range"
            min="50"
            max="2000"
            step="50"
            class="range range-xs range-primary w-full"
          />
          <div class="flex gap-1 mt-1">
            <button
              v-for="preset in presetSpeeds"
              :key="preset"
              class="btn btn-ghost btn-xs flex-1"
              @click="gift1Speed = preset"
            >
              {{ preset }}
            </button>
          </div>
        </div>

        <!-- Gift 2 Speed -->
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span>礼物流2</span>
            <span class="font-mono">{{ gift2Speed }}ms</span>
          </div>
          <input
            v-model.number="gift2Speed"
            type="range"
            min="50"
            max="2000"
            step="50"
            class="range range-xs range-secondary w-full"
          />
          <div class="flex gap-1 mt-1">
            <button
              v-for="preset in presetSpeeds"
              :key="preset"
              class="btn btn-ghost btn-xs flex-1"
              @click="gift2Speed = preset"
            >
              {{ preset }}
            </button>
          </div>
        </div>

        <!-- Guard Speed -->
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span>舰长</span>
            <span class="font-mono">{{ guardSpeed }}ms</span>
          </div>
          <input
            v-model.number="guardSpeed"
            type="range"
            min="50"
            max="2000"
            step="50"
            class="range range-xs range-accent w-full"
          />
          <div class="flex gap-1 mt-1">
            <button
              v-for="preset in presetSpeeds"
              :key="preset"
              class="btn btn-ghost btn-xs flex-1"
              @click="guardSpeed = preset"
            >
              {{ preset }}
            </button>
          </div>
        </div>

        <!-- Pause/Resume -->
        <div class="flex gap-2 pt-2 border-t border-base-300">
          <button class="btn btn-error btn-sm flex-1" @click="pauseAll">暂停</button>
          <button class="btn btn-success btn-sm flex-1" @click="resumeAll">继续</button>
        </div>
      </div>
    </div>

    <!-- Toggle Button (collapsed) -->
    <button v-else class="btn btn-primary btn-circle shadow-xl" @click="isOpen = true">⚡</button>
  </div>
</template>
