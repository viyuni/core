import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/events',
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventsView.vue'),
    },
    {
      path: '/other-events',
      name: 'otherEvents',
      component: () => import('../views/OtherEventsView.vue'),
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: () => import('../views/RoomsView.vue'),
    },
  ],
});
