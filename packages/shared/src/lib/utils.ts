import type { StandardSchemaV1 } from '@standard-schema/spec';
export function validate<T extends StandardSchemaV1>(schema: T, data: unknown) {
  const result = schema['~standard'].validate(data);

  if (result instanceof Promise) {
    throw new Error('Standard Schema: Async validation not supported');
  }

  if ('issues' in result && result.issues) {
    return { success: false, data: null, issues: result.issues };
  }
  return { success: true, data: result.value as StandardSchemaV1.InferOutput<T>, issues: null };
}
