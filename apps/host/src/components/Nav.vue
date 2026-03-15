<script setup lang="ts">
import { BiliIcon } from '@viyuni/ui';
</script>
<template>
  <nav
    class="container border-x border-b border-base-300 mx-auto py-5 px-5 flex justify-between items-center"
  >
    <img
      src="https://assets.viyuni.top/viyuni-light.svg"
      width="120"
      class="select-none"
      draggable="false"
    />

    <div>
      <button class="btn btn-ghost btn-sm">歌单</button>
      <button class="btn btn-ghost btn-sm">舰长积分</button>
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-sm">工具</div>
        <ul
          tabindex="-1"
          class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm border border-base-300 mt-2"
        >
          <li><a>弹幕姬</a></li>
          <li><a>礼物记录</a></li>
          <li><a>弹幕日志</a></li>
        </ul>
      </div>
      <a href="https://space.bilibili.com/263135375" target="_blank" class="btn btn-ghost btn-sm">
        <BiliIcon width="18" height="18" />
      </a>
    </div>
  </nav>
</template>
