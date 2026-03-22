import { onUnmounted, ref } from 'vue';

export interface EventTimersOptions {
  onGift1Event: () => void;
  onGift2Event: () => void;
  onGuardEvent: () => void;
}

export function useEventTimers(options: EventTimersOptions) {
  const { onGift1Event, onGift2Event, onGuardEvent } = options;

  // 速度状态
  const gift1Speed = ref(2000);
  const gift2Speed = ref(2000);
  const guardSpeed = ref(2000);

  // 定时器引用
  let gift1Timer: ReturnType<typeof setInterval> | null = null;
  let gift2Timer: ReturnType<typeof setInterval> | null = null;
  let guardTimer: ReturnType<typeof setInterval> | null = null;

  // 清除所有定时器
  function clearTimers() {
    if (gift1Timer) clearInterval(gift1Timer);
    if (gift2Timer) clearInterval(gift2Timer);
    if (guardTimer) clearInterval(guardTimer);
  }

  // 启动定时器
  function startTimers() {
    clearTimers();
    gift1Timer = setInterval(() => {
      onGift1Event();
    }, gift1Speed.value);
    gift2Timer = setInterval(() => {
      onGift2Event();
    }, gift2Speed.value);
    guardTimer = setInterval(() => {
      onGuardEvent();
    }, guardSpeed.value);
  }

  // 更新速度并重启定时器
  function updateGift1Speed(value: number) {
    gift1Speed.value = value;
    startTimers();
  }
  function updateGift2Speed(value: number) {
    gift2Speed.value = value;
    startTimers();
  }
  function updateGuardSpeed(value: number) {
    guardSpeed.value = value;
    startTimers();
  }

  // 暂停
  function pause() {
    clearTimers();
  }

  // 继续
  function resume() {
    startTimers();
  }

  // 初始启动
  startTimers();

  onUnmounted(() => {
    clearTimers();
  });

  return {
    gift1Speed,
    gift2Speed,
    guardSpeed,
    updateGift1Speed,
    updateGift2Speed,
    updateGuardSpeed,
    pause,
    resume,
  };
}
