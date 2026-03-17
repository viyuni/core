<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import EventList from './components/EventList.vue';
import SettingsModal from './components/SettingsModal.vue';
import { useEvents } from './compositions/useEvents';
import { useHighlight } from './compositions/useHighlight';

const { data, range, refetch, nextPage, prevPage, isLoading, cmdFilter, limit, offset } =
  useEvents();

const isSettingsOpen = ref(false);
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] h-screen text-[14px]">
    <AppHeader
      :range="range as [number, number]"
      :total="data?.total ?? 0"
      :is-loading="isLoading"
      :cmd="cmdFilter"
      :limit
      :offset
      @refetch="refetch()"
      @prev-page="prevPage()"
      @next-page="nextPage()"
      @setting="isSettingsOpen = true"
      @update:cmd="(v) => (cmdFilter = v)"
      @update:limit="(v) => (limit = v)"
      @update:offset="(v) => (offset = v)"
    />

    <EventList :events="data?.data ?? []" />

    <SettingsModal :is-open="isSettingsOpen" @close="isSettingsOpen = false" />
  </div>
</template>
