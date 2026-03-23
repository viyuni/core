import type { StandardSchemaV1 } from '@standard-schema/spec';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { validate } from '../lib/utils';

export function useValidatedParams<T extends StandardSchemaV1>(schema: T) {
  const route = useRoute();

  const validated = computed(() => validate(schema, route.params));

  return {
    params: computed(() => validated.value.data),
    errors: computed(() => validated.value.issues),
    isValid: computed(() => validated.value.success),
  };
}
