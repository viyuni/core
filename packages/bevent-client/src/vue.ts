import { watch, onBeforeUnmount, toValue, type MaybeRefOrGetter } from 'vue';

import { createBeventClient, type BeventClientOptions } from '.';

export const useBeventClient = (options: MaybeRefOrGetter<BeventClientOptions>) => {
  let client: ReturnType<typeof createBeventClient> | null = null;

  // 核心停止逻辑
  const stopClient = () => {
    if (client) {
      client.stop();
      client = null;
    }
  };

  // 监听参数变化，自动重连
  watch(
    () => toValue(options),
    (newOptions, _oldOptions) => {
      console.log(`[BeventClient] Client options changed, reconnecting...`);
      stopClient();

      client = createBeventClient(newOptions);

      client.start();
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    stopClient();
  });

  return {
    start: () => client?.start(),
    stop: stopClient,
    // 获取当前实例（只读）
    instance: () => client,
  };
};
