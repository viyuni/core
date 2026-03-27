import { createSharedComposable } from '@vueuse/core';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

export type ThemeMode = 'system' | 'light' | 'dark';

export const useTheme = createSharedComposable(() => {
  const themeMode = ref<ThemeMode>('system');
  const STORAGE_KEY = 'viyuni-theme-mode';

  let colorSchemeQueryList: MediaQueryList | null = null;
  let colorSchemeHandler: ((event: MediaQueryListEvent) => void) | null = null;

  const applyThemeMode = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
      }
      return;
    }
    root.setAttribute('data-theme', mode);
  };

  const cycleThemeMode = () => {
    if (themeMode.value === 'system') {
      themeMode.value = 'light';
      return;
    }
    if (themeMode.value === 'light') {
      themeMode.value = 'dark';
      return;
    }
    themeMode.value = 'system';
  };

  watch(themeMode, (mode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    applyThemeMode(mode);
  });

  onMounted(() => {
    const savedThemeMode = localStorage.getItem(STORAGE_KEY);
    if (savedThemeMode === 'light' || savedThemeMode === 'dark' || savedThemeMode === 'system') {
      themeMode.value = savedThemeMode as ThemeMode;
    }
    applyThemeMode(themeMode.value);

    colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeHandler = () => {
      if (themeMode.value === 'system') {
        applyThemeMode('system');
      }
    };
    colorSchemeQueryList.addEventListener('change', colorSchemeHandler);
  });

  onBeforeUnmount(() => {
    if (colorSchemeQueryList && colorSchemeHandler) {
      colorSchemeQueryList.removeEventListener('change', colorSchemeHandler);
    }
  });

  return {
    themeMode,
    cycleThemeMode,
  };
});
