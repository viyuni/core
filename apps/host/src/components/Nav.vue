<script setup lang="ts">
import { BiliIcon } from '@viyuni/ui';

interface Menu {
  label: string;
  to: string;
  subs?: Omit<Menu, 'subs'>[];
  desc?: string;
}

const menus = [
  { label: '歌单', to: '/' },
  { label: '舰长积分', to: '/' },
  {
    label: '工具',
    to: '/',
    subs: [
      { label: '弹幕姬', to: '/' },
      { label: '礼物记录', to: '/', 'desc': '可以挂在直播界面展示喵' },
      { label: '弹幕日志', to: '/', desc: '查看收录到的历史弹幕捏' },
      { label: '奇怪的动画', to: '/', desc: '各种奇怪的的动画' },
      { label: '谐音梗', to: '/', desc: '谐音梗' },
      { label: 'BMusic', to: '/', desc: 'B站音乐播放器' },
      { label: 'VTS Helper', to: '/', desc: 'VTS 辅助工具' },
      { label: 'OBS Clock', to: '/', desc: 'OBS 时钟' },
      { label: 'Login Sync', to: '/', desc: '登录状态同步工具' },
    ],
  },
  // { label: '文档', to: '/' },
] satisfies Menu[];
</script>
<template>
  <nav class="container border-x border-b border-base-300 mx-auto py-5 px-5 flex justify-between items-center">
    <picture>
      <source srcset="https://assets.viyuni.top/viyuni-light.svg" media="(prefers-color-scheme: dark)" />

      <img width="120" class="select-none" draggable="false" src="https://assets.viyuni.top/viyuni-dark.svg"
        alt="Viyuni logo" />
    </picture>

    <div class="flex items-center gap-2">
      <div class="hidden md:block">
        <template v-for="menu in menus">
          <a v-if="!menu.subs" class="btn btn-ghost btn-sm" :href="menu.to">
            {{ menu.label }}
          </a>
          <div v-else class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-sm">{{ menu.label }}</div>
            <ul tabindex="-1"
              class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm border border-base-300 mt-2">
              <li v-for="sub in menu.subs">
                <a :href="sub.to">{{ sub.label }}</a>
              </li>
            </ul>
          </div>
        </template>
      </div>

      <div class="dropdown dropdown-end md:hidden">
        <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-square">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            class="inline-block h-5 w-5 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </div>
        <ul tabindex="-1"
          class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm border border-base-300 mt-2">
          <li v-for="menu in menus">
            <a :href="menu.subs ? undefined : menu.to">{{ menu.label }}</a>
            <ul v-if="menu.subs">
              <li v-for="sub in menu.subs">
                <a :href="sub.to">{{ sub.label }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <a href="https://space.bilibili.com/263135375" target="_blank" class="btn btn-ghost btn-sm btn-square">
        <BiliIcon width="18" height="18" />
      </a>
    </div>
  </nav>
</template>
