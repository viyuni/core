import { Elysia } from 'elysia';

const app = new Elysia();

app.get('/api', () => 'Elysia with Nitro!');

export default app.compile();
