<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuth } from '../compositions/useAuth';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { baseURL, token, setAuth } = useAuth();

const localBaseURL = ref(baseURL.value ?? '');
const localToken = ref(token.value ?? '');

watch(
  () => props.isOpen,
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
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': props.isOpen }">
    <div class="modal-box border-2 border-base-200 shadow-2xl shadow-black w-11/12 max-w-lg">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-lg">设置</h3>
        <button class="btn btn-sm btn-circle btn-ghost" @click="emit('close')">✕</button>
      </div>

      <div class="py-4 space-y-4">
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

      <div class="modal-action">
        <button class="btn" @click="emit('close')">取消</button>
        <button class="btn btn-primary" @click="handleSave">保存</button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop" @click="emit('close')">
      <button>close</button>
    </form>
  </dialog>
</template>
