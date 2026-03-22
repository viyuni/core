import type { StandardSchemaV1 } from '@standard-schema/spec';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { validate } from '../lib/utils';

export function useValidatedQuery<T extends StandardSchemaV1>(schema: T) {
  const route = useRoute();

  const validated = computed(() => validate(schema, route.query));

  return {
    query: computed(() => validated.value.data),
    errors: computed(() => validated.value.issues),
    isValid: computed(() => validated.value.success),
  };
}
