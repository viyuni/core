import { type } from 'arktype';

export { default as App } from './App.vue';

export const schema = type({
  name: 'string',
  description: 'string?',
  author: 'string?',
  version: 'string?',
});
