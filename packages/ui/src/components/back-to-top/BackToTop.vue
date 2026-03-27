<script setup lang="ts">
import { useScroll } from '@vueuse/core';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    threshold?: number;
    class?: string;
  }>(),
  {
    threshold: 300,
    class: '',
  },
);

const { y } = useScroll(window, { behavior: 'smooth' });

const isVisible = computed(() => y.value > props.threshold);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4 scale-90"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-90"
  >
    <button
      v-if="isVisible"
      :class="props.class"
      class="btn btn-circle btn-primary fixed bottom-8 right-8 z-50 shadow-lg"
      aria-label="返回顶部"
      @click="scrollToTop"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        class="h-5 w-5 stroke-current"
      >
        <path
          d="M7 11l5-5m0 0l5 5m-5-5v12"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </Transition>
</template>
