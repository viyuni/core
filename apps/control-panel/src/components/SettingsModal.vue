<script setup lang="ts">
import { Modal } from '@viyuni/ui';
import { ref, watch } from 'vue';

import { useAuth } from '../composables/useAuth';

const { isOpen } = defineProps<{ isOpen: boolean }>();


const emit = defineEmits<{
  close: [];
}>();


const { baseURL, token, setAuth } = useAuth();


const localBaseURL = ref(baseURL.value ?? '');
const localToken = ref(token.value ?? '');


watch(
  () => isOpen,
  (isOpen) => {
    if (isOpen) {
      localBaseURL.value = baseURL.value ?? '';
      localToken.value = token.value ?? '';
    }
  },
);


function handleSave() {
  setAuth(localBaseURL.value, localToken.value || null);
  emit('close');
}


function handleClose() {
  emit('close');
}
</script>

<template>
  <Modal :open="isOpen" @close="handleClose">
    <template #title>
      <h3 class="font-bold text-lg">设置</h3>
    </template>

    <div class="space-y-4">
      <div class="form-control">
        <label class="label mb-1">
          <span class="label-text">API URL</span>
        </label>
        <input
          v-model="localBaseURL"
          type="text"
          placeholder="http://localhost:6300"
          class="input input-bordered w-full"
        />
      </div>

      <div class="form-control">
        <label class="label mb-1">
          <span class="label-text">Access Token</span>
        </label>
        <input
          v-model="localToken"
          type="password"
          placeholder="Bearer Token"
          class="input input-bordered w-full"
        />
      </div>
    </div>

    <template #footer>
      <button class="btn" @click="handleClose">取消</button>
      <button class="btn btn-primary" @click="handleSave">保存</button>
    </template>
  </Modal>
</template>
