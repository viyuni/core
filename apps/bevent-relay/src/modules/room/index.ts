import { type } from 'arktype';
import { Elysia, status } from 'elysia';

import { roomInsertSchema, roomUpdateSchema } from '../../db/schema';
import { RoomService } from './service';

const roomParamsSchema = type({
  roomId: 'string.numeric.parse',
});

export const room = new Elysia()
  .get('/room', async () => {
    return RoomService.getAll();
  })
  .post(
    '/room',
    async ({ body, status }) => {
      const room = await RoomService.create(body);

      if (!room) {
        return status('Conflict');
      }

      return room;
    },
    {
      body: roomInsertSchema,
    },
  )
  .put(
    '/room/:roomId',
    async ({ params: { roomId }, body }) => {
      const has = await RoomService.update(roomId, { enabled: body.enabled });
      if (!has) return status(404);
    },
    {
      body: roomUpdateSchema,
      params: roomParamsSchema,
    },
  )
  .delete(
    '/room/:roomId',
    async ({ params: { roomId } }) => {
      const has = await RoomService.delete(roomId);
      if (!has) return status(404);
    },
    {
      params: roomParamsSchema,
    },
  )
  .post(
    '/room/:roomId/start',
    async ({ params: { roomId } }) => {
      await RoomService.start(roomId);
    },
    {
      params: roomParamsSchema,
    },
  )
  .post(
    '/room/:roomId/stop',
    async ({ params: { roomId } }) => {
      await RoomService.stop(roomId);
    },
    {
      params: roomParamsSchema,
    },
  )
  .post(
    '/room/:roomId/refreshInfo',
    async ({ params: { roomId } }) => {
      await RoomService.refreshInfo(roomId);
    },
    {
      params: roomParamsSchema,
    },
  );

export { RoomService } from './service';
