import { createSharedComposable } from '@vueuse/core';
import { createHighlighter, type Highlighter } from 'shiki';
import { shallowRef } from 'vue';

export const useHighlight = createSharedComposable(() => {
  const highlighter = shallowRef<Highlighter>();

  createHighlighter({
    themes: ['vitesse-dark'],
    langs: ['json'],
  })
    .then((h) => {
      highlighter.value = h;
    })
    .catch((err) => {
      console.error('Failed to create highlighter:', err);
    });

  const highlightJson = (content: any, theme = 'vitesse-dark') => {
    if (!highlighter.value) return JSON.stringify(content);
    return highlighter.value.codeToHtml(JSON.stringify(content, null, 2), {
      lang: 'json',
      theme,
    });
  };

  return {
    highlighter,
    highlightJson,
  };
});
