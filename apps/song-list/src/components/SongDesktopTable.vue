<script setup lang="ts">
import type { SongItem } from '../types/song';

const props = defineProps<{
  songs: SongItem[];
  requirementClassMap: Record<string, string>;
}>();
</script>

<template>
  <section>
    <div
      class="overflow-x-auto rounded-xl border border-base-300/50 bg-base-100/40 backdrop-blur-sm"
    >
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>歌名</th>
            <th>歌手</th>
            <th>风格</th>
            <th>语言</th>
            <th>要求</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="song in props.songs" :key="song.id">
            <td class="font-medium">{{ song.name }}</td>
            <td>{{ song.artist }}</td>
            <td>{{ song.style }}</td>
            <td>{{ song.language }}</td>
            <td>
              <span
                :class="
                  props.requirementClassMap[song.requirement] ?? 'badge badge-neutral badge-soft'
                "
              >
                {{ song.requirement }}
              </span>
            </td>
          </tr>
          <tr v-if="props.songs.length === 0">
            <td colspan="5" class="text-base-content/60 py-6 text-center">没有匹配的歌曲</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
@reference "../style.css";

/* 覆盖 DaisyUI 斑马线默认颜色，添加透明度 */
:deep(.table-zebra tbody tr:nth-child(even)) {
  @apply bg-base-200/40;
}

:deep(.table-zebra tbody tr:hover) {
  @apply bg-base-200/60;
}
</style>
