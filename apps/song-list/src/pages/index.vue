<script setup lang="ts">
import { BackToTop, TextInput } from '@viyuni/ui';
import { useMediaQuery } from '@vueuse/core';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

import Bg from '../bg.png';
import SongDesktopTable from '../components/SongDesktopTable.vue';
import SongListHeader from '../components/SongListHeader.vue';
import SongMobileCards from '../components/SongMobileCards.vue';
import StreamerProfile from '../components/StreamerProfile.vue';
import type { SongItem } from '../types/song';

const playlistTitle = 'Viyuni 歌单';
const liveRoomUrl = 'https://live.bilibili.com/';

const streamer = {
  avatar: 'https://i0.hdslb.com/bfs/face/member/noface.jpg',
  name: 'Viyuni',
  description: '点歌前可先搜索，支持按歌名/歌手/风格/语言',
};

const seedSongs = [
  { name: '晴天', artist: '周杰伦', style: '流行', language: '中文', requirement: '礼物' },
  {
    name: 'Fly Me to the Moon',
    artist: 'Frank Sinatra',
    style: 'Jazz',
    language: '英文',
    requirement: 'SuperChat',
  },
  { name: 'Lemon', artist: '米津玄师', style: 'J-Pop', language: '日文', requirement: '大航海' },
  {
    name: '夜空中最亮的星',
    artist: '逃跑计划',
    style: '摇滚',
    language: '中文',
    requirement: '礼物',
  },
  {
    name: 'APT.',
    artist: 'ROSÉ / Bruno Mars',
    style: '流行',
    language: '韩英',
    requirement: 'SuperChat',
  },
] as const;

const songs: SongItem[] = Array.from({ length: 10 }, (_, groupIndex) =>
  seedSongs.map((song, offset) => ({
    ...song,
    id: groupIndex * seedSongs.length + offset + 1,
    name: `${song.name} #${groupIndex + 1}`,
  })),
).flat();

const requirementClassMap: Record<string, string> = {
  SuperChat: 'badge badge-info badge-soft',
  礼物: 'badge badge-success badge-soft',
  大航海: 'badge badge-warning badge-soft',
};

const searchKeyword = ref('');
const loadBatchSize = 40;
const visibleCount = ref(loadBatchSize);
const sentinelRef = useTemplateRef('sentinelRef');
const isDesktop = useMediaQuery('(min-width: 768px)');

let observer: IntersectionObserver | null = null;

const indexedSongs = songs.map((song) => ({
  ...song,
  searchable:
    `${song.name} ${song.artist} ${song.style} ${song.language} ${song.requirement}`.toLowerCase(),
}));

const normalizedKeyword = computed(() => searchKeyword.value.trim().toLowerCase());

const filteredSongs = computed(() => {
  if (!normalizedKeyword.value) {
    return indexedSongs;
  }
  return indexedSongs.filter((song) => song.searchable.includes(normalizedKeyword.value));
});

const visibleSongs = computed(() => filteredSongs.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < filteredSongs.value.length);

const loadMore = () => {
  if (!hasMore.value) {
    return;
  }
  visibleCount.value = Math.min(visibleCount.value + loadBatchSize, filteredSongs.value.length);
};

watch(normalizedKeyword, () => {
  visibleCount.value = loadBatchSize;
});

watch(filteredSongs, async () => {
  await nextTick();
  if (!hasMore.value && observer && sentinelRef.value) {
    observer.unobserve(sentinelRef.value);
  }
  if (hasMore.value && observer && sentinelRef.value) {
    observer.observe(sentinelRef.value);
  }
});

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadMore();
      }
    },
    { rootMargin: '120px 0px' },
  );

  if (sentinelRef.value) {
    observer.observe(sentinelRef.value);
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <SongListHeader :title="playlistTitle" :live-room-url="liveRoomUrl" />

  <!-- 背景层 -->
  <div
    class="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
    :style="{ backgroundImage: `url(${Bg})` }"
  >
    <!-- 半透明遮罩，让内容在任何主题下都可见 -->
    <div class="h-full bg-base-100/50"></div>
  </div>

  <main class="mx-auto w-full max-w-6xl px-4 pb-6 pt-4 md:px-8 md:pb-10 md:pt-6">
    <section>
      <div class="space-y-5 p-3 md:p-5">
        <StreamerProfile
          :streamer="streamer"
          :total-songs="songs.length"
          :matched-songs="filteredSongs.length"
        />

        <TextInput
          v-model="searchKeyword"
          class="rounded-xl bg-base-100/60 backdrop-blur-sm"
          placeholder="按歌名 / 歌手 / 风格 / 语言 / 要求"
          aria-label="本地搜索歌曲"
        />

        <SongDesktopTable
          v-if="isDesktop"
          :songs="visibleSongs"
          :requirement-class-map="requirementClassMap"
        />

        <SongMobileCards
          v-else
          :songs="visibleSongs"
          :requirement-class-map="requirementClassMap"
        />

        <div v-if="hasMore" ref="sentinelRef" class="flex justify-center py-2">
          <span class="loading loading-dots loading-md" aria-label="正在加载更多歌曲"></span>
        </div>
        <p
          v-else-if="visibleSongs.length > 0"
          class="text-base-content/60 py-2 text-center text-sm"
        >
          已展示全部歌曲
        </p>
      </div>
    </section>
  </main>

  <BackToTop />
</template>
