import { defineCatalog } from '@json-render/core';
import { schema } from '@json-render/vue/schema';
// import { type } from 'arktype';
import { z } from 'zod';

export const catalog = defineCatalog(schema, {
  components: {
    Card: {
      props: z.object({
        title: z.string(),
        description: z.string().nullable(),
      }),
    },
    // Button: {},
  },
  actions: {},
});
