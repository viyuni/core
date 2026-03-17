import { PiniaColada } from '@pinia/colada';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';

import './style.css';

const app = createApp(App);

app.use(createPinia());

app.use(PiniaColada, {});

app.mount('#app');
