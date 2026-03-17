import { PiniaColada } from '@pinia/colada';
import { PiniaColadaAutoRefetch } from '@pinia/colada-plugin-auto-refetch';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';

import './style.css';

const app = createApp(App);

app.use(createPinia());

app.use(PiniaColada, {
  plugins: [
    PiniaColadaAutoRefetch({
      autoRefetch: 3000,
    }),
  ],
});

app.mount('#app');
