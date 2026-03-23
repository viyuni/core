import { createApp, vaporInteropPlugin } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';

import App from './App.vue';

import './normal.css';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(vaporInteropPlugin);
app.use(router);

app.mount('#app');

if (import.meta.hot) {
  handleHotUpdate(router);
}
