import { createApp, vaporInteropPlugin } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';

import './normal.css';

const app = createApp(App);
// app.use(vaporInteropPlugin);
app.use(
  createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        component: () => import('./pages/index.vue'),
      },
      {
        path: '/show',
        component: () => import('./pages/show.vue'),
      },
    ],
  }),
);
app.mount('#app');
