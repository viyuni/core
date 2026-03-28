<script setup lang="ts" vapor>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <main class="app">
    <h1>You did it!</h1>
    <p>
      Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
      documentation
    </p>
    <button @click="count++">count is: {{ count }}</button>
  </main>
</template>

<style scoped>
.app {
  display: flex;
}
</style>
