<script setup lang="ts">
import type { SongItem } from '../types/song';

const props = defineProps<{
  songs: SongItem[];
  requirementClassMap: Record<string, string>;
}>();
</script>

<template>
  <section class="grid gap-3">
    <article
      v-for="song in props.songs"
      :key="song.id"
      class="card border border-base-300/50 bg-base-100/40 backdrop-blur-sm"
    >
      <div class="card-body gap-2 p-4">
        <h3 class="card-title text-base">{{ song.name }}</h3>
        <p class="text-sm text-base-content/80">歌手：{{ song.artist }}</p>
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <span class="badge badge-ghost">风格 {{ song.style }}</span>
          <span class="badge badge-ghost">语言 {{ song.language }}</span>
          <span
            :class="props.requirementClassMap[song.requirement] ?? 'badge badge-neutral badge-soft'"
          >
            {{ song.requirement }}
          </span>
        </div>
      </div>
    </article>
    <p v-if="props.songs.length === 0" class="text-base-content/60 py-6 text-center">
      没有匹配的歌曲
    </p>
  </section>
</template>
