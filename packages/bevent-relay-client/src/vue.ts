import { watch, onBeforeUnmount, toValue, type MaybeRefOrGetter } from 'vue';

import { createBeventClient, createSharedBeventClient, type BeventClientOptions } from '.';

type BeventClient = ReturnType<typeof createBeventClient>;
type SharedClient = ReturnType<typeof createSharedBeventClient>;
type AnyClient = BeventClient | SharedClient;

export const useBeventClient = (
  options: MaybeRefOrGetter<BeventClientOptions & { shared?: boolean }>,
) => {
  let client: AnyClient | null = null;

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
    (newOptions) => {
      console.log(`[BeventRelayClient] Client options changed, reconnecting...`);
      stopClient();

      client = newOptions.shared
        ? createSharedBeventClient(newOptions)
        : createBeventClient(newOptions);

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
    get instance() {
      return client;
    },
  };
};
