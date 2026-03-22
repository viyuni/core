import { PiniaColada, PiniaColadaQueryHooksPlugin } from '@pinia/colada';
import { PiniaColadaAutoRefetch } from '@pinia/colada-plugin-auto-refetch';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { router } from './router';

import './style.css';

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.use(PiniaColada, {
  plugins: [
    PiniaColadaAutoRefetch({
      autoRefetch: 3000,
    }),
    PiniaColadaQueryHooksPlugin({}),
  ],
});

app.mount('#app');
