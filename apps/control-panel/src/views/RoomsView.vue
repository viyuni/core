<script setup lang="ts">
import { RoomClientStatus, type Room, type RoomWithClient } from '@viyuni/bevent-relay/types';
import { toProxyUrl } from '@viyuni/shared';
import { Modal } from '@viyuni/ui';
import {
  Play,
  Square,
  Trash2,
  Plus,
  RefreshCw,
  CircleHelp,
  ExternalLink,
  User,
} from 'lucide-vue-next';
import { ref } from 'vue';

import { useRooms } from '../composables/useRooms';

const {
  rooms,
  isLoading,
  createRoom,
  deleteRoom,
  startRoom,
  stopRoom,
  refreshRoomInfo,
  updateRoom,
  isMutating,
  refetch,
} = useRooms();


const isAdding = ref(false);
const formData = ref({
  roomId: 0,
});


const confirmModal = ref({
  isOpen: false,
  title: '',
  message: '',
  action: null as (() => Promise<void>) | null,
});


function openAddModal() {
  formData.value = { roomId: 0 };
  isAdding.value = true;
}


async function handleSave() {
  try {
    await createRoom({ roomId: formData.value.roomId });
    isAdding.value = false;
  } catch (err) {
    console.error('Failed to add room:', err);
  }
}


function confirmDelete(roomId: number) {
  confirmModal.value = {
    isOpen: true,
    title: '确认删除',
    message: `确定要删除该房间吗? (ID: ${roomId})。删除后将停止所有相关监听器。`,
    action: async () => {
      try {
        await deleteRoom(roomId);
      } catch (err) {
        console.error('Failed to delete room:', err);
      }
    },
  };
}


function confirmStop(roomId: number) {
  confirmModal.value = {
    isOpen: true,
    title: '确认停止',
    message: `确定要停止该房间的监听吗? (ID: ${roomId})。停止后将不再接收事件。`,
    action: async () => {
      try {
        await stopRoom(roomId);
      } catch (err) {
        console.error('Failed to stop room:', err);
      }
    },
  };
}


async function executeConfirm() {
  if (confirmModal.value.action) {
    await confirmModal.value.action();
  }
  confirmModal.value.isOpen = false;
}


async function handleDelete(roomId: number) {
  confirmDelete(roomId);
}


async function handleStart(roomId: number) {
  try {
    await startRoom(roomId);
  } catch (err) {
    console.error('Failed to start room:', err);
  }
}


async function handleStop(roomId: number) {
  // Now using confirmStop
  confirmStop(roomId);
}


async function handleRefreshInfo(roomId: number) {
  try {
    await refreshRoomInfo(roomId);
  } catch (err) {
    console.error('Failed to refresh room info:', err);
  }
}


async function toggleEnabled(room: any, e: Event) {
  const target = e.target as HTMLInputElement;
  try {
    await updateRoom({ roomId: room.roomId, enabled: target.checked });
  } catch (err) {
    console.error('Failed to toggle room:', err);
    target.checked = !target.checked; // Revert on error
  }
}


const canStart = (room: RoomWithClient) =>
  !room.enabled ||
  room.clientStatus === RoomClientStatus.Connected ||
  room.clientStatus === RoomClientStatus.Reconnecting ||
  room.clientStatus === RoomClientStatus.Connecting;


const canStop = (room: RoomWithClient) =>
  !room.enabled || room.clientStatus == RoomClientStatus.Stopped;


const clientStatusStyle = {
  [RoomClientStatus.Connected]: 'badge-success',
  [RoomClientStatus.Connecting]: 'badge-info',
  [RoomClientStatus.Idle]: 'badge-ghost',
  [RoomClientStatus.Reconnecting]: 'badge-warning',
  [RoomClientStatus.Stopped]: 'badge-error',
};
</script>

<template>
  <div>
    <Teleport to="#header-actions">
      <div class="flex gap-2">
        <button class="btn btn-sm gap-1" @click="openAddModal">
          <Plus :size="16" />
          添加房间
        </button>

        <button class="btn btn-sm btn-square" :disabled="isLoading" @click="() => refetch()">
          <RefreshCw :size="16" />
        </button>
      </div>
    </Teleport>

    <div v-if="isLoading" class="flex justify-center p-8">
      <div class="loading loading-spinner loading-lg" />
    </div>

    <div v-else class="overflow-x-auto w-full">
      <table class="table table-zebra table-sm w-full table-pin-rows">
        <thead>
          <tr class="text-xs">
            <th class="w-16">ID</th>
            <th>INFO</th>
            <th class="w-24 text-center">直播状态</th>
            <th class="w-24 text-center">监听器状态</th>
            <th class="w-64 text-right px-4">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id" class="hover">
            <td class="font-mono text-xs opacity-50">{{ room.id }}</td>

            <td class="py-3">
              <div class="flex items-center gap-3">
                <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12 border border-base-200 shadow-sm">
                    <img :src="toProxyUrl(room.face)" alt="avatar" />
                  </div>
                </div>

                <div class="grid gap-2">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-base leading-none text-base-content">{{
                      room.uname
                    }}</span>
                    <span
                      v-if="room.shortRoomId && room.shortRoomId !== room.roomId"
                      class="badge badge-ghost badge-xs text-info font-mono"
                    >
                      Short: {{ room.shortRoomId }}
                    </span>
                  </div>

                  <div
                    class="flex items-center gap-3 text-[10px] uppercase tracking-wider font-medium opacity-60"
                  >
                    <div class="flex items-center gap-1">
                      <span class="opacity-50">ROOM</span>
                      <span class="font-mono text-base-content">{{ room.roomId }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="opacity-50">UID</span>
                      <span class="font-mono text-base-content">{{ room.uid }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>

            <td class="py3 text-center">
              <span v-if="room.status === 0" class="badge badge-sm badge-warning"> 未开播 </span>
              <span v-else-if="room.status === 1" class="badge badge-sm badge-primary">直播中</span>
              <span v-else class="badge badge-sm badge-info">录播</span>
            </td>

            <td>
              <span
                class="badge badge-sm uppercase"
                :class="room.clientStatus && clientStatusStyle[room.clientStatus]"
              >
                {{ room.clientStatus }}
              </span>
            </td>

            <td class="px-4">
              <div class="flex gap-2 justify-end">
                <a
                  :href="`https://live.bilibili.com/${room.roomId}`"
                  target="_blank"
                  class="btn btn-sm btn-ghost btn-square"
                  title="进入直播间"
                >
                  <ExternalLink :size="16" />
                </a>
                <a
                  :href="`https://space.bilibili.com/${room.uid}`"
                  target="_blank"
                  class="btn btn-sm btn-ghost btn-square"
                  title="个人主页"
                >
                  <User :size="16" />
                </a>
                <button
                  class="btn btn-sm btn-ghost btn-square"
                  :disabled="isMutating"
                  title="刷新信息"
                  @click="handleRefreshInfo(room.roomId)"
                >
                  <RefreshCw :size="16" />
                </button>
                <button
                  class="btn btn-sm btn-ghost btn-square"
                  :disabled="canStart(room)"
                  title="启动监听"
                  @click="handleStart(room.roomId)"
                >
                  <Play :size="16" />
                </button>
                <button
                  class="btn btn-sm btn-ghost btn-square btn-error"
                  :disabled="canStop(room)"
                  title="停止监听"
                  @click="handleStop(room.roomId)"
                >
                  <Square :size="16" />
                </button>
                <div class="divider divider-horizontal mx-0 h-4 self-center opacity-20" />
                <div class="flex items-center px-1">
                  <input
                    type="checkbox"
                    class="toggle toggle-sm toggle-success"
                    :checked="room.enabled"
                    @change="toggleEnabled(room, $event)"
                  />
                </div>
                <div class="divider divider-horizontal mx-0 h-4 self-center opacity-20" />
                <button
                  class="btn btn-sm btn-ghost text-error btn-square"
                  :disabled="isMutating"
                  title="删除"
                  @click="handleDelete(room.roomId)"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!rooms?.length">
            <td colspan="6" class="text-center p-12 opacity-50">暂无房间数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Modal -->
    <Modal v-model:open="isAdding" class="shadow-2xl shadow-black w-11/12 max-w-lg">
      <template #title>
        <h3 class="font-bold text-lg">添加房间</h3>
      </template>
      <div class="space-y-4">
        <div class="form-control">
          <label class="label mb-1">
            <span class="label-text text-sm opacity-70">房间 ID</span>
          </label>
          <input
            v-model.number="formData.roomId"
            type="number"
            class="input input-bordered w-full"
            placeholder="请输入 B 站直播间 ID"
          />
        </div>
      </div>
      <template #footer>
        <button class="btn" @click="isAdding = false">取消</button>
        <button class="btn btn-primary" @click="handleSave">确认添加</button>
      </template>
    </Modal>

    <!-- Confirmation Modal -->
    <Modal v-model:open="confirmModal.isOpen" class="shadow-2xl shadow-black w-11/12 max-w-md">
      <template #title>
        <h3 class="font-bold text-lg">{{ confirmModal.title }}</h3>
      </template>
      <div class="flex gap-4 items-start py-2">
        <div class="text-warning mt-1">
          <CircleHelp :size="32" />
        </div>
        <div>
          <p class="opacity-70">{{ confirmModal.message }}</p>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-sm" @click="confirmModal.isOpen = false">取消</button>
        <button class="btn btn-sm btn-primary" @click="executeConfirm">确认</button>
      </template>
    </Modal>
  </div>
</template>
