import { useQuery } from '@pinia/colada';
import { ref } from 'vue';

import { useApiClient } from './useApiClient';

export function useRooms() {
  const { client } = useApiClient();

  const {
    data: rooms,
    isLoading,
    refetch,
  } = useQuery({
    key: () => ['rooms'],
    autoRefetch: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    async query() {
      const res = await client.value.api.room.get();
      if (res.error) throw res.error;
      return res.data;
    },
  });

  const isMutating = ref(false);

  async function createRoom(data: { roomId: number; name?: string }) {
    try {
      isMutating.value = true;
      const res = await client.value.api.room.post(data);
      if (res.error) throw res.error;
      refetch();
      return res.data;
    } finally {
      isMutating.value = false;
    }
  }

  async function updateRoom({
    roomId,
    ...data
  }: {
    roomId: number;
    enabled?: boolean;
    name?: string;
  }) {
    try {
      isMutating.value = true;
      const res = await client.value.api.room({ roomId }).put(data);
      if (res.error) throw res.error;
      refetch();
      return res.data;
    } finally {
      isMutating.value = false;
    }
  }

  async function deleteRoom(roomId: number) {
    try {
      isMutating.value = true;
      const res = await client.value.api.room({ roomId }).delete();
      if (res.error) throw res.error;
      refetch();
      return res.data;
    } finally {
      isMutating.value = false;
    }
  }

  async function startRoom(roomId: number) {
    try {
      isMutating.value = true;
      const res = await client.value.api.room({ roomId }).start.post();
      if (res.error) throw res.error;
      return res.data;
    } finally {
      isMutating.value = false;
    }
  }

  async function stopRoom(roomId: number) {
    try {
      isMutating.value = true;
      const res = await client.value.api.room({ roomId }).stop.post();
      if (res.error) throw res.error;
      return res.data;
    } finally {
      isMutating.value = false;
    }
  }

  async function refreshRoomInfo(roomId: number) {
    try {
      isMutating.value = true;
      const res = await client.value.api.room({ roomId }).refreshInfo.post();
      if (res.error) throw res.error;
      refetch();
      return res.data;
    } finally {
      isMutating.value = false;
    }
  }

  return {
    rooms,
    isLoading,
    refetch,
    createRoom,
    updateRoom,
    deleteRoom,
    startRoom,
    stopRoom,
    refreshRoomInfo,
    isMutating,
  };
}
