import { n as __exportAll } from '../_runtime.mjs';
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/guard/value.mjs
/** Returns true if this value is an async iterator */
function IsAsyncIterator$3(value) {
  return (
    IsObject$3(value) &&
    !IsArray$3(value) &&
    !IsUint8Array$3(value) &&
    Symbol.asyncIterator in value
  );
}
/** Returns true if this value is an array */
function IsArray$3(value) {
  return Array.isArray(value);
}
/** Returns true if this value is bigint */
function IsBigInt$3(value) {
  return typeof value === 'bigint';
}
/** Returns true if this value is a boolean */
function IsBoolean$3(value) {
  return typeof value === 'boolean';
}
/** Returns true if this value is a Date object */
function IsDate$3(value) {
  return value instanceof globalThis.Date;
}
/** Returns true if this value is a function */
function IsFunction$3(value) {
  return typeof value === 'function';
}
/** Returns true if this value is an iterator */
function IsIterator$3(value) {
  return (
    IsObject$3(value) && !IsArray$3(value) && !IsUint8Array$3(value) && Symbol.iterator in value
  );
}
/** Returns true if this value is null */
function IsNull$3(value) {
  return value === null;
}
/** Returns true if this value is number */
function IsNumber$3(value) {
  return typeof value === 'number';
}
/** Returns true if this value is an object */
function IsObject$3(value) {
  return typeof value === 'object' && value !== null;
}
/** Returns true if this value is RegExp */
function IsRegExp$2(value) {
  return value instanceof globalThis.RegExp;
}
/** Returns true if this value is string */
function IsString$3(value) {
  return typeof value === 'string';
}
/** Returns true if this value is symbol */
function IsSymbol$3(value) {
  return typeof value === 'symbol';
}
/** Returns true if this value is a Uint8Array */
function IsUint8Array$3(value) {
  return value instanceof globalThis.Uint8Array;
}
/** Returns true if this value is undefined */
function IsUndefined$3(value) {
  return value === void 0;
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/clone/value.mjs
function ArrayType$1(value) {
  return value.map((value) => Visit$11(value));
}
function DateType$1(value) {
  return new Date(value.getTime());
}
function Uint8ArrayType$1(value) {
  return new Uint8Array(value);
}
function RegExpType(value) {
  return new RegExp(value.source, value.flags);
}
function ObjectType$1(value) {
  const result = {};
  for (const key of Object.getOwnPropertyNames(value)) result[key] = Visit$11(value[key]);
  for (const key of Object.getOwnPropertySymbols(value)) result[key] = Visit$11(value[key]);
  return result;
}
function Visit$11(value) {
  return IsArray$3(value)
    ? ArrayType$1(value)
    : IsDate$3(value)
      ? DateType$1(value)
      : IsUint8Array$3(value)
        ? Uint8ArrayType$1(value)
        : IsRegExp$2(value)
          ? RegExpType(value)
          : IsObject$3(value)
            ? ObjectType$1(value)
            : value;
}
/** Clones a value */
function Clone$1(value) {
  return Visit$11(value);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/clone/type.mjs
/** Clones a Type */
function CloneType(schema, options) {
  return options === void 0
    ? Clone$1(schema)
    : Clone$1({
        ...options,
        ...schema,
      });
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/guard/guard.mjs
/** Returns true if this value is an async iterator */
function IsAsyncIterator$2(value) {
  return IsObject$2(value) && globalThis.Symbol.asyncIterator in value;
}
/** Returns true if this value is an iterator */
function IsIterator$2(value) {
  return IsObject$2(value) && globalThis.Symbol.iterator in value;
}
/** Returns true if this value is a Promise */
function IsPromise$2(value) {
  return value instanceof globalThis.Promise;
}
/** Returns true if this value is a Date */
function IsDate$2(value) {
  return value instanceof Date && globalThis.Number.isFinite(value.getTime());
}
/** Returns true if this value is an instance of Map<K, T> */
function IsMap(value) {
  return value instanceof globalThis.Map;
}
/** Returns true if this value is an instance of Set<T> */
function IsSet(value) {
  return value instanceof globalThis.Set;
}
/** Returns true if this value is a typed array */
function IsTypedArray(value) {
  return globalThis.ArrayBuffer.isView(value);
}
/** Returns true if the value is a Uint8Array */
function IsUint8Array$2(value) {
  return value instanceof globalThis.Uint8Array;
}
/** Returns true if this value has this property key */
function HasPropertyKey(value, key) {
  return key in value;
}
/** Returns true of this value is an object type */
function IsObject$2(value) {
  return value !== null && typeof value === 'object';
}
/** Returns true if this value is an array, but not a typed array */
function IsArray$2(value) {
  return globalThis.Array.isArray(value) && !globalThis.ArrayBuffer.isView(value);
}
/** Returns true if this value is an undefined */
function IsUndefined$2(value) {
  return value === void 0;
}
/** Returns true if this value is an null */
function IsNull$2(value) {
  return value === null;
}
/** Returns true if this value is an boolean */
function IsBoolean$2(value) {
  return typeof value === 'boolean';
}
/** Returns true if this value is an number */
function IsNumber$2(value) {
  return typeof value === 'number';
}
/** Returns true if this value is an integer */
function IsInteger$2(value) {
  return globalThis.Number.isInteger(value);
}
/** Returns true if this value is bigint */
function IsBigInt$2(value) {
  return typeof value === 'bigint';
}
/** Returns true if this value is string */
function IsString$2(value) {
  return typeof value === 'string';
}
/** Returns true if this value is a function */
function IsFunction$2(value) {
  return typeof value === 'function';
}
/** Returns true if this value is a symbol */
function IsSymbol$2(value) {
  return typeof value === 'symbol';
}
/** Returns true if this value is a value type such as number, string, boolean */
function IsValueType(value) {
  return (
    IsBigInt$2(value) ||
    IsBoolean$2(value) ||
    IsNull$2(value) ||
    IsNumber$2(value) ||
    IsString$2(value) ||
    IsSymbol$2(value) ||
    IsUndefined$2(value)
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/system/policy.mjs
var TypeSystemPolicy;
(function (TypeSystemPolicy) {
  /**
   * Configures the instantiation behavior of TypeBox types. The `default` option assigns raw JavaScript
   * references for embedded types, which may cause side effects if type properties are explicitly updated
   * outside the TypeBox type builder. The `clone` option creates copies of any shared types upon creation,
   * preventing unintended side effects. The `freeze` option applies `Object.freeze()` to the type, making
   * it fully readonly and immutable. Implementations should use `default` whenever possible, as it is the
   * fastest way to instantiate types. The default setting is `default`.
   */
  TypeSystemPolicy.InstanceMode = 'default';
  /** Sets whether TypeBox should assert optional properties using the TypeScript `exactOptionalPropertyTypes` assertion policy. The default is `false` */
  TypeSystemPolicy.ExactOptionalPropertyTypes = false;
  /** Sets whether arrays should be treated as a kind of objects. The default is `false` */
  TypeSystemPolicy.AllowArrayObject = false;
  /** Sets whether `NaN` or `Infinity` should be treated as valid numeric values. The default is `false` */
  TypeSystemPolicy.AllowNaN = false;
  /** Sets whether `null` should validate for void types. The default is `false` */
  TypeSystemPolicy.AllowNullVoid = false;
  /** Checks this value using the ExactOptionalPropertyTypes policy */
  function IsExactOptionalProperty(value, key) {
    return TypeSystemPolicy.ExactOptionalPropertyTypes ? key in value : value[key] !== void 0;
  }
  TypeSystemPolicy.IsExactOptionalProperty = IsExactOptionalProperty;
  /** Checks this value using the AllowArrayObjects policy */
  function IsObjectLike(value) {
    const isObject = IsObject$2(value);
    return TypeSystemPolicy.AllowArrayObject ? isObject : isObject && !IsArray$2(value);
  }
  TypeSystemPolicy.IsObjectLike = IsObjectLike;
  /** Checks this value as a record using the AllowArrayObjects policy */
  function IsRecordLike(value) {
    return IsObjectLike(value) && !(value instanceof Date) && !(value instanceof Uint8Array);
  }
  TypeSystemPolicy.IsRecordLike = IsRecordLike;
  /** Checks this value using the AllowNaN policy */
  function IsNumberLike(value) {
    return TypeSystemPolicy.AllowNaN ? IsNumber$2(value) : Number.isFinite(value);
  }
  TypeSystemPolicy.IsNumberLike = IsNumberLike;
  /** Checks this value using the AllowVoidNull policy */
  function IsVoidLike(value) {
    const isUndefined = IsUndefined$2(value);
    return TypeSystemPolicy.AllowNullVoid ? isUndefined || value === null : isUndefined;
  }
  TypeSystemPolicy.IsVoidLike = IsVoidLike;
})(TypeSystemPolicy || (TypeSystemPolicy = {}));
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/create/immutable.mjs
function ImmutableArray(value) {
  return globalThis.Object.freeze(value).map((value) => Immutable(value));
}
function ImmutableDate(value) {
  return value;
}
function ImmutableUint8Array(value) {
  return value;
}
function ImmutableRegExp(value) {
  return value;
}
function ImmutableObject(value) {
  const result = {};
  for (const key of Object.getOwnPropertyNames(value)) result[key] = Immutable(value[key]);
  for (const key of Object.getOwnPropertySymbols(value)) result[key] = Immutable(value[key]);
  return globalThis.Object.freeze(result);
}
/** Specialized deep immutable value. Applies freeze recursively to the given value */
function Immutable(value) {
  return IsArray$3(value)
    ? ImmutableArray(value)
    : IsDate$3(value)
      ? ImmutableDate(value)
      : IsUint8Array$3(value)
        ? ImmutableUint8Array(value)
        : IsRegExp$2(value)
          ? ImmutableRegExp(value)
          : IsObject$3(value)
            ? ImmutableObject(value)
            : value;
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/create/type.mjs
/** Creates TypeBox schematics using the configured InstanceMode */
function CreateType(schema, options) {
  const result =
    options !== void 0
      ? {
          ...options,
          ...schema,
        }
      : schema;
  switch (TypeSystemPolicy.InstanceMode) {
    case 'freeze':
      return Immutable(result);
    case 'clone':
      return Clone$1(result);
    default:
      return result;
  }
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/error/error.mjs
/** The base Error type thrown for all TypeBox exceptions  */
var TypeBoxError = class extends Error {
  constructor(message) {
    super(message);
  }
};
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/symbols/symbols.mjs
/** Symbol key applied to transform types */
var TransformKind = Symbol.for('TypeBox.Transform');
/** Symbol key applied to readonly types */
var ReadonlyKind = Symbol.for('TypeBox.Readonly');
/** Symbol key applied to optional types */
var OptionalKind = Symbol.for('TypeBox.Optional');
/** Symbol key applied to types */
var Hint = Symbol.for('TypeBox.Hint');
/** Symbol key applied to types */
var Kind = Symbol.for('TypeBox.Kind');
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/guard/kind.mjs
/** `[Kind-Only]` Returns true if this value has a Readonly symbol */
function IsReadonly(value) {
  return IsObject$3(value) && value[ReadonlyKind] === 'Readonly';
}
/** `[Kind-Only]` Returns true if this value has a Optional symbol */
function IsOptional$1(value) {
  return IsObject$3(value) && value[OptionalKind] === 'Optional';
}
/** `[Kind-Only]` Returns true if the given value is TAny */
function IsAny$1(value) {
  return IsKindOf$1(value, 'Any');
}
/** `[Kind-Only]` Returns true if the given value is TArgument */
function IsArgument$1(value) {
  return IsKindOf$1(value, 'Argument');
}
/** `[Kind-Only]` Returns true if the given value is TArray */
function IsArray$1(value) {
  return IsKindOf$1(value, 'Array');
}
/** `[Kind-Only]` Returns true if the given value is TAsyncIterator */
function IsAsyncIterator$1(value) {
  return IsKindOf$1(value, 'AsyncIterator');
}
/** `[Kind-Only]` Returns true if the given value is TBigInt */
function IsBigInt$1(value) {
  return IsKindOf$1(value, 'BigInt');
}
/** `[Kind-Only]` Returns true if the given value is TBoolean */
function IsBoolean$1(value) {
  return IsKindOf$1(value, 'Boolean');
}
/** `[Kind-Only]` Returns true if the given value is TComputed */
function IsComputed$1(value) {
  return IsKindOf$1(value, 'Computed');
}
/** `[Kind-Only]` Returns true if the given value is TConstructor */
function IsConstructor$1(value) {
  return IsKindOf$1(value, 'Constructor');
}
/** `[Kind-Only]` Returns true if the given value is TDate */
function IsDate$1(value) {
  return IsKindOf$1(value, 'Date');
}
/** `[Kind-Only]` Returns true if the given value is TFunction */
function IsFunction$1(value) {
  return IsKindOf$1(value, 'Function');
}
/** `[Kind-Only]` Returns true if the given value is TInteger */
function IsInteger$1(value) {
  return IsKindOf$1(value, 'Integer');
}
/** `[Kind-Only]` Returns true if the given value is TIntersect */
function IsIntersect$1(value) {
  return IsKindOf$1(value, 'Intersect');
}
/** `[Kind-Only]` Returns true if the given value is TIterator */
function IsIterator$1(value) {
  return IsKindOf$1(value, 'Iterator');
}
/** `[Kind-Only]` Returns true if the given value is a TKind with the given name. */
function IsKindOf$1(value, kind) {
  return IsObject$3(value) && Kind in value && value[Kind] === kind;
}
/** `[Kind-Only]` Returns true if the given value is TLiteralValue */
function IsLiteralValue$1(value) {
  return IsBoolean$3(value) || IsNumber$3(value) || IsString$3(value);
}
/** `[Kind-Only]` Returns true if the given value is TLiteral */
function IsLiteral$1(value) {
  return IsKindOf$1(value, 'Literal');
}
/** `[Kind-Only]` Returns true if the given value is a TMappedKey */
function IsMappedKey$1(value) {
  return IsKindOf$1(value, 'MappedKey');
}
/** `[Kind-Only]` Returns true if the given value is TMappedResult */
function IsMappedResult$1(value) {
  return IsKindOf$1(value, 'MappedResult');
}
/** `[Kind-Only]` Returns true if the given value is TNever */
function IsNever$1(value) {
  return IsKindOf$1(value, 'Never');
}
/** `[Kind-Only]` Returns true if the given value is TNot */
function IsNot$1(value) {
  return IsKindOf$1(value, 'Not');
}
/** `[Kind-Only]` Returns true if the given value is TNull */
function IsNull$1(value) {
  return IsKindOf$1(value, 'Null');
}
/** `[Kind-Only]` Returns true if the given value is TNumber */
function IsNumber$1(value) {
  return IsKindOf$1(value, 'Number');
}
/** `[Kind-Only]` Returns true if the given value is TObject */
function IsObject$1(value) {
  return IsKindOf$1(value, 'Object');
}
/** `[Kind-Only]` Returns true if the given value is TPromise */
function IsPromise$1(value) {
  return IsKindOf$1(value, 'Promise');
}
/** `[Kind-Only]` Returns true if the given value is TRecord */
function IsRecord$1(value) {
  return IsKindOf$1(value, 'Record');
}
/** `[Kind-Only]` Returns true if the given value is TRef */
function IsRef$1(value) {
  return IsKindOf$1(value, 'Ref');
}
/** `[Kind-Only]` Returns true if the given value is TRegExp */
function IsRegExp$1(value) {
  return IsKindOf$1(value, 'RegExp');
}
/** `[Kind-Only]` Returns true if the given value is TString */
function IsString$1(value) {
  return IsKindOf$1(value, 'String');
}
/** `[Kind-Only]` Returns true if the given value is TSymbol */
function IsSymbol$1(value) {
  return IsKindOf$1(value, 'Symbol');
}
/** `[Kind-Only]` Returns true if the given value is TTemplateLiteral */
function IsTemplateLiteral$1(value) {
  return IsKindOf$1(value, 'TemplateLiteral');
}
/** `[Kind-Only]` Returns true if the given value is TThis */
function IsThis$1(value) {
  return IsKindOf$1(value, 'This');
}
/** `[Kind-Only]` Returns true of this value is TTransform */
function IsTransform$1(value) {
  return IsObject$3(value) && TransformKind in value;
}
/** `[Kind-Only]` Returns true if the given value is TTuple */
function IsTuple$1(value) {
  return IsKindOf$1(value, 'Tuple');
}
/** `[Kind-Only]` Returns true if the given value is TUndefined */
function IsUndefined$1(value) {
  return IsKindOf$1(value, 'Undefined');
}
/** `[Kind-Only]` Returns true if the given value is TUnion */
function IsUnion$1(value) {
  return IsKindOf$1(value, 'Union');
}
/** `[Kind-Only]` Returns true if the given value is TUint8Array */
function IsUint8Array$1(value) {
  return IsKindOf$1(value, 'Uint8Array');
}
/** `[Kind-Only]` Returns true if the given value is TUnknown */
function IsUnknown$1(value) {
  return IsKindOf$1(value, 'Unknown');
}
/** `[Kind-Only]` Returns true if the given value is a raw TUnsafe */
function IsUnsafe$1(value) {
  return IsKindOf$1(value, 'Unsafe');
}
/** `[Kind-Only]` Returns true if the given value is TVoid */
function IsVoid$1(value) {
  return IsKindOf$1(value, 'Void');
}
/** `[Kind-Only]` Returns true if the given value is TKind */
function IsKind$1(value) {
  return IsObject$3(value) && Kind in value && IsString$3(value[Kind]);
}
/** `[Kind-Only]` Returns true if the given value is TSchema */
function IsSchema$1(value) {
  return (
    IsAny$1(value) ||
    IsArgument$1(value) ||
    IsArray$1(value) ||
    IsBoolean$1(value) ||
    IsBigInt$1(value) ||
    IsAsyncIterator$1(value) ||
    IsComputed$1(value) ||
    IsConstructor$1(value) ||
    IsDate$1(value) ||
    IsFunction$1(value) ||
    IsInteger$1(value) ||
    IsIntersect$1(value) ||
    IsIterator$1(value) ||
    IsLiteral$1(value) ||
    IsMappedKey$1(value) ||
    IsMappedResult$1(value) ||
    IsNever$1(value) ||
    IsNot$1(value) ||
    IsNull$1(value) ||
    IsNumber$1(value) ||
    IsObject$1(value) ||
    IsPromise$1(value) ||
    IsRecord$1(value) ||
    IsRef$1(value) ||
    IsRegExp$1(value) ||
    IsString$1(value) ||
    IsSymbol$1(value) ||
    IsTemplateLiteral$1(value) ||
    IsThis$1(value) ||
    IsTuple$1(value) ||
    IsUndefined$1(value) ||
    IsUnion$1(value) ||
    IsUint8Array$1(value) ||
    IsUnknown$1(value) ||
    IsUnsafe$1(value) ||
    IsVoid$1(value) ||
    IsKind$1(value)
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/guard/type.mjs
var KnownTypes = [
  'Argument',
  'Any',
  'Array',
  'AsyncIterator',
  'BigInt',
  'Boolean',
  'Computed',
  'Constructor',
  'Date',
  'Enum',
  'Function',
  'Integer',
  'Intersect',
  'Iterator',
  'Literal',
  'MappedKey',
  'MappedResult',
  'Not',
  'Null',
  'Number',
  'Object',
  'Promise',
  'Record',
  'Ref',
  'RegExp',
  'String',
  'Symbol',
  'TemplateLiteral',
  'This',
  'Tuple',
  'Undefined',
  'Union',
  'Uint8Array',
  'Unknown',
  'Void',
];
function IsPattern(value) {
  try {
    new RegExp(value);
    return true;
  } catch {
    return false;
  }
}
function IsControlCharacterFree(value) {
  if (!IsString$3(value)) return false;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if ((code >= 7 && code <= 13) || code === 27 || code === 127) return false;
  }
  return true;
}
function IsAdditionalProperties(value) {
  return IsOptionalBoolean(value) || IsSchema(value);
}
function IsOptionalBigInt(value) {
  return IsUndefined$3(value) || IsBigInt$3(value);
}
function IsOptionalNumber(value) {
  return IsUndefined$3(value) || IsNumber$3(value);
}
function IsOptionalBoolean(value) {
  return IsUndefined$3(value) || IsBoolean$3(value);
}
function IsOptionalString(value) {
  return IsUndefined$3(value) || IsString$3(value);
}
function IsOptionalPattern(value) {
  return (
    IsUndefined$3(value) || (IsString$3(value) && IsControlCharacterFree(value) && IsPattern(value))
  );
}
function IsOptionalFormat(value) {
  return IsUndefined$3(value) || (IsString$3(value) && IsControlCharacterFree(value));
}
function IsOptionalSchema(value) {
  return IsUndefined$3(value) || IsSchema(value);
}
/** Returns true if this value has a Optional symbol */
function IsOptional(value) {
  return IsObject$3(value) && value[OptionalKind] === 'Optional';
}
/** Returns true if the given value is TAny */
function IsAny(value) {
  return IsKindOf(value, 'Any') && IsOptionalString(value.$id);
}
/** Returns true if the given value is TArgument */
function IsArgument(value) {
  return IsKindOf(value, 'Argument') && IsNumber$3(value.index);
}
/** Returns true if the given value is TArray */
function IsArray(value) {
  return (
    IsKindOf(value, 'Array') &&
    value.type === 'array' &&
    IsOptionalString(value.$id) &&
    IsSchema(value.items) &&
    IsOptionalNumber(value.minItems) &&
    IsOptionalNumber(value.maxItems) &&
    IsOptionalBoolean(value.uniqueItems) &&
    IsOptionalSchema(value.contains) &&
    IsOptionalNumber(value.minContains) &&
    IsOptionalNumber(value.maxContains)
  );
}
/** Returns true if the given value is TAsyncIterator */
function IsAsyncIterator(value) {
  return (
    IsKindOf(value, 'AsyncIterator') &&
    value.type === 'AsyncIterator' &&
    IsOptionalString(value.$id) &&
    IsSchema(value.items)
  );
}
/** Returns true if the given value is TBigInt */
function IsBigInt(value) {
  return (
    IsKindOf(value, 'BigInt') &&
    value.type === 'bigint' &&
    IsOptionalString(value.$id) &&
    IsOptionalBigInt(value.exclusiveMaximum) &&
    IsOptionalBigInt(value.exclusiveMinimum) &&
    IsOptionalBigInt(value.maximum) &&
    IsOptionalBigInt(value.minimum) &&
    IsOptionalBigInt(value.multipleOf)
  );
}
/** Returns true if the given value is TBoolean */
function IsBoolean(value) {
  return IsKindOf(value, 'Boolean') && value.type === 'boolean' && IsOptionalString(value.$id);
}
/** Returns true if the given value is TComputed */
function IsComputed(value) {
  return (
    IsKindOf(value, 'Computed') &&
    IsString$3(value.target) &&
    IsArray$3(value.parameters) &&
    value.parameters.every((schema) => IsSchema(schema))
  );
}
/** Returns true if the given value is TConstructor */
function IsConstructor(value) {
  return (
    IsKindOf(value, 'Constructor') &&
    value.type === 'Constructor' &&
    IsOptionalString(value.$id) &&
    IsArray$3(value.parameters) &&
    value.parameters.every((schema) => IsSchema(schema)) &&
    IsSchema(value.returns)
  );
}
/** Returns true if the given value is TDate */
function IsDate(value) {
  return (
    IsKindOf(value, 'Date') &&
    value.type === 'Date' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.exclusiveMaximumTimestamp) &&
    IsOptionalNumber(value.exclusiveMinimumTimestamp) &&
    IsOptionalNumber(value.maximumTimestamp) &&
    IsOptionalNumber(value.minimumTimestamp) &&
    IsOptionalNumber(value.multipleOfTimestamp)
  );
}
/** Returns true if the given value is TFunction */
function IsFunction(value) {
  return (
    IsKindOf(value, 'Function') &&
    value.type === 'Function' &&
    IsOptionalString(value.$id) &&
    IsArray$3(value.parameters) &&
    value.parameters.every((schema) => IsSchema(schema)) &&
    IsSchema(value.returns)
  );
}
/** Returns true if the given value is TInteger */
function IsInteger(value) {
  return (
    IsKindOf(value, 'Integer') &&
    value.type === 'integer' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.exclusiveMaximum) &&
    IsOptionalNumber(value.exclusiveMinimum) &&
    IsOptionalNumber(value.maximum) &&
    IsOptionalNumber(value.minimum) &&
    IsOptionalNumber(value.multipleOf)
  );
}
/** Returns true if the given schema is TProperties */
function IsProperties(value) {
  return (
    IsObject$3(value) &&
    Object.entries(value).every(([key, schema]) => IsControlCharacterFree(key) && IsSchema(schema))
  );
}
/** Returns true if the given value is TIntersect */
function IsIntersect(value) {
  return (
    IsKindOf(value, 'Intersect') &&
    (IsString$3(value.type) && value.type !== 'object' ? false : true) &&
    IsArray$3(value.allOf) &&
    value.allOf.every((schema) => IsSchema(schema) && !IsTransform(schema)) &&
    IsOptionalString(value.type) &&
    (IsOptionalBoolean(value.unevaluatedProperties) ||
      IsOptionalSchema(value.unevaluatedProperties)) &&
    IsOptionalString(value.$id)
  );
}
/** Returns true if the given value is TIterator */
function IsIterator(value) {
  return (
    IsKindOf(value, 'Iterator') &&
    value.type === 'Iterator' &&
    IsOptionalString(value.$id) &&
    IsSchema(value.items)
  );
}
/** Returns true if the given value is a TKind with the given name. */
function IsKindOf(value, kind) {
  return IsObject$3(value) && Kind in value && value[Kind] === kind;
}
/** Returns true if the given value is TLiteral<string> */
function IsLiteralString(value) {
  return IsLiteral(value) && IsString$3(value.const);
}
/** Returns true if the given value is TLiteral<number> */
function IsLiteralNumber(value) {
  return IsLiteral(value) && IsNumber$3(value.const);
}
/** Returns true if the given value is TLiteral<boolean> */
function IsLiteralBoolean(value) {
  return IsLiteral(value) && IsBoolean$3(value.const);
}
/** Returns true if the given value is TLiteral */
function IsLiteral(value) {
  return IsKindOf(value, 'Literal') && IsOptionalString(value.$id) && IsLiteralValue(value.const);
}
/** Returns true if the given value is a TLiteralValue */
function IsLiteralValue(value) {
  return IsBoolean$3(value) || IsNumber$3(value) || IsString$3(value);
}
/** Returns true if the given value is a TMappedKey */
function IsMappedKey(value) {
  return (
    IsKindOf(value, 'MappedKey') &&
    IsArray$3(value.keys) &&
    value.keys.every((key) => IsNumber$3(key) || IsString$3(key))
  );
}
/** Returns true if the given value is TMappedResult */
function IsMappedResult(value) {
  return IsKindOf(value, 'MappedResult') && IsProperties(value.properties);
}
/** Returns true if the given value is TNever */
function IsNever(value) {
  return (
    IsKindOf(value, 'Never') &&
    IsObject$3(value.not) &&
    Object.getOwnPropertyNames(value.not).length === 0
  );
}
/** Returns true if the given value is TNot */
function IsNot(value) {
  return IsKindOf(value, 'Not') && IsSchema(value.not);
}
/** Returns true if the given value is TNull */
function IsNull(value) {
  return IsKindOf(value, 'Null') && value.type === 'null' && IsOptionalString(value.$id);
}
/** Returns true if the given value is TNumber */
function IsNumber(value) {
  return (
    IsKindOf(value, 'Number') &&
    value.type === 'number' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.exclusiveMaximum) &&
    IsOptionalNumber(value.exclusiveMinimum) &&
    IsOptionalNumber(value.maximum) &&
    IsOptionalNumber(value.minimum) &&
    IsOptionalNumber(value.multipleOf)
  );
}
/** Returns true if the given value is TObject */
function IsObject(value) {
  return (
    IsKindOf(value, 'Object') &&
    value.type === 'object' &&
    IsOptionalString(value.$id) &&
    IsProperties(value.properties) &&
    IsAdditionalProperties(value.additionalProperties) &&
    IsOptionalNumber(value.minProperties) &&
    IsOptionalNumber(value.maxProperties)
  );
}
/** Returns true if the given value is TPromise */
function IsPromise(value) {
  return (
    IsKindOf(value, 'Promise') &&
    value.type === 'Promise' &&
    IsOptionalString(value.$id) &&
    IsSchema(value.item)
  );
}
/** Returns true if the given value is TRecord */
function IsRecord(value) {
  return (
    IsKindOf(value, 'Record') &&
    value.type === 'object' &&
    IsOptionalString(value.$id) &&
    IsAdditionalProperties(value.additionalProperties) &&
    IsObject$3(value.patternProperties) &&
    ((schema) => {
      const keys = Object.getOwnPropertyNames(schema.patternProperties);
      return (
        keys.length === 1 &&
        IsPattern(keys[0]) &&
        IsObject$3(schema.patternProperties) &&
        IsSchema(schema.patternProperties[keys[0]])
      );
    })(value)
  );
}
/** Returns true if the given value is TRef */
function IsRef(value) {
  return IsKindOf(value, 'Ref') && IsOptionalString(value.$id) && IsString$3(value.$ref);
}
/** Returns true if the given value is TRegExp */
function IsRegExp(value) {
  return (
    IsKindOf(value, 'RegExp') &&
    IsOptionalString(value.$id) &&
    IsString$3(value.source) &&
    IsString$3(value.flags) &&
    IsOptionalNumber(value.maxLength) &&
    IsOptionalNumber(value.minLength)
  );
}
/** Returns true if the given value is TString */
function IsString(value) {
  return (
    IsKindOf(value, 'String') &&
    value.type === 'string' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.minLength) &&
    IsOptionalNumber(value.maxLength) &&
    IsOptionalPattern(value.pattern) &&
    IsOptionalFormat(value.format)
  );
}
/** Returns true if the given value is TSymbol */
function IsSymbol(value) {
  return IsKindOf(value, 'Symbol') && value.type === 'symbol' && IsOptionalString(value.$id);
}
/** Returns true if the given value is TTemplateLiteral */
function IsTemplateLiteral(value) {
  return (
    IsKindOf(value, 'TemplateLiteral') &&
    value.type === 'string' &&
    IsString$3(value.pattern) &&
    value.pattern[0] === '^' &&
    value.pattern[value.pattern.length - 1] === '$'
  );
}
/** Returns true if the given value is TThis */
function IsThis(value) {
  return IsKindOf(value, 'This') && IsOptionalString(value.$id) && IsString$3(value.$ref);
}
/** Returns true of this value is TTransform */
function IsTransform(value) {
  return IsObject$3(value) && TransformKind in value;
}
/** Returns true if the given value is TTuple */
function IsTuple(value) {
  return (
    IsKindOf(value, 'Tuple') &&
    value.type === 'array' &&
    IsOptionalString(value.$id) &&
    IsNumber$3(value.minItems) &&
    IsNumber$3(value.maxItems) &&
    value.minItems === value.maxItems &&
    ((IsUndefined$3(value.items) && IsUndefined$3(value.additionalItems) && value.minItems === 0) ||
      (IsArray$3(value.items) && value.items.every((schema) => IsSchema(schema))))
  );
}
/** Returns true if the given value is TUndefined */
function IsUndefined(value) {
  return IsKindOf(value, 'Undefined') && value.type === 'undefined' && IsOptionalString(value.$id);
}
/** Returns true if the given value is TUnion */
function IsUnion(value) {
  return (
    IsKindOf(value, 'Union') &&
    IsOptionalString(value.$id) &&
    IsObject$3(value) &&
    IsArray$3(value.anyOf) &&
    value.anyOf.every((schema) => IsSchema(schema))
  );
}
/** Returns true if the given value is TUint8Array */
function IsUint8Array(value) {
  return (
    IsKindOf(value, 'Uint8Array') &&
    value.type === 'Uint8Array' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.minByteLength) &&
    IsOptionalNumber(value.maxByteLength)
  );
}
/** Returns true if the given value is TUnknown */
function IsUnknown(value) {
  return IsKindOf(value, 'Unknown') && IsOptionalString(value.$id);
}
/** Returns true if the given value is a raw TUnsafe */
function IsUnsafe(value) {
  return IsKindOf(value, 'Unsafe');
}
/** Returns true if the given value is TVoid */
function IsVoid(value) {
  return IsKindOf(value, 'Void') && value.type === 'void' && IsOptionalString(value.$id);
}
/** Returns true if the given value is TKind */
function IsKind(value) {
  return (
    IsObject$3(value) &&
    Kind in value &&
    IsString$3(value[Kind]) &&
    !KnownTypes.includes(value[Kind])
  );
}
/** Returns true if the given value is TSchema */
function IsSchema(value) {
  return (
    IsObject$3(value) &&
    (IsAny(value) ||
      IsArgument(value) ||
      IsArray(value) ||
      IsBoolean(value) ||
      IsBigInt(value) ||
      IsAsyncIterator(value) ||
      IsComputed(value) ||
      IsConstructor(value) ||
      IsDate(value) ||
      IsFunction(value) ||
      IsInteger(value) ||
      IsIntersect(value) ||
      IsIterator(value) ||
      IsLiteral(value) ||
      IsMappedKey(value) ||
      IsMappedResult(value) ||
      IsNever(value) ||
      IsNot(value) ||
      IsNull(value) ||
      IsNumber(value) ||
      IsObject(value) ||
      IsPromise(value) ||
      IsRecord(value) ||
      IsRef(value) ||
      IsRegExp(value) ||
      IsString(value) ||
      IsSymbol(value) ||
      IsTemplateLiteral(value) ||
      IsThis(value) ||
      IsTuple(value) ||
      IsUndefined(value) ||
      IsUnion(value) ||
      IsUint8Array(value) ||
      IsUnknown(value) ||
      IsUnsafe(value) ||
      IsVoid(value) ||
      IsKind(value))
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/patterns/patterns.mjs
var PatternBoolean = '(true|false)';
var PatternNumber = '(0|[1-9][0-9]*)';
var PatternString = '(.*)';
var PatternNever = '(?!.*)';
`${PatternBoolean}`;
var PatternNumberExact = `^${PatternNumber}$`;
var PatternStringExact = `^${PatternString}$`;
var PatternNeverExact = `^${PatternNever}$`;
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/registry/format.mjs
/** A registry for user defined string formats */
var map$1 = /* @__PURE__ */ new Map();
/** Returns true if the user defined string format exists */
function Has$1(format) {
  return map$1.has(format);
}
/** Sets a validation function for a user defined string format */
function Set$2(format, func) {
  map$1.set(format, func);
}
/** Gets a validation function for a user defined string format */
function Get$1(format) {
  return map$1.get(format);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/registry/type.mjs
/** A registry for user defined types */
var map = /* @__PURE__ */ new Map();
/** Returns true if this registry contains this kind */
function Has(kind) {
  return map.has(kind);
}
/** Sets a validation function for a user defined type */
function Set$1(kind, func) {
  map.set(kind, func);
}
/** Gets a custom validation function for a user defined type */
function Get(kind) {
  return map.get(kind);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/sets/set.mjs
/** Returns true if element right is in the set of left */
function SetIncludes(T, S) {
  return T.includes(S);
}
/** Returns a distinct set of elements */
function SetDistinct(T) {
  return [...new Set(T)];
}
/** Returns the Intersect of the given sets */
function SetIntersect(T, S) {
  return T.filter((L) => S.includes(L));
}
function SetIntersectManyResolve(T, Init) {
  return T.reduce((Acc, L) => {
    return SetIntersect(Acc, L);
  }, Init);
}
function SetIntersectMany(T) {
  return T.length === 1 ? T[0] : T.length > 1 ? SetIntersectManyResolve(T.slice(1), T[0]) : [];
}
/** Returns the Union of multiple sets */
function SetUnionMany(T) {
  const Acc = [];
  for (const L of T) Acc.push(...L);
  return Acc;
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/any/any.mjs
/** `[Json]` Creates an Any type */
function Any(options) {
  return CreateType({ [Kind]: 'Any' }, options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/array/array.mjs
/** `[Json]` Creates an Array type */
function Array$1(items, options) {
  return CreateType(
    {
      [Kind]: 'Array',
      type: 'array',
      items,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/argument/argument.mjs
/** `[JavaScript]` Creates an Argument Type. */
function Argument(index) {
  return CreateType({
    [Kind]: 'Argument',
    index,
  });
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/async-iterator/async-iterator.mjs
/** `[JavaScript]` Creates a AsyncIterator type */
function AsyncIterator(items, options) {
  return CreateType(
    {
      [Kind]: 'AsyncIterator',
      type: 'AsyncIterator',
      items,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/computed/computed.mjs
/** `[Internal]` Creates a deferred computed type. This type is used exclusively in modules to defer resolution of computable types that contain interior references  */
function Computed(target, parameters, options) {
  return CreateType(
    {
      [Kind]: 'Computed',
      target,
      parameters,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/discard/discard.mjs
function DiscardKey(value, key) {
  const { [key]: _, ...rest } = value;
  return rest;
}
/** Discards property keys from the given value. This function returns a shallow Clone. */
function Discard(value, keys) {
  return keys.reduce((acc, key) => DiscardKey(acc, key), value);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/never/never.mjs
/** `[Json]` Creates a Never type */
function Never(options) {
  return CreateType(
    {
      [Kind]: 'Never',
      not: {},
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/mapped/mapped-result.mjs
function MappedResult(properties) {
  return CreateType({
    [Kind]: 'MappedResult',
    properties,
  });
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/constructor/constructor.mjs
/** `[JavaScript]` Creates a Constructor type */
function Constructor(parameters, returns, options) {
  return CreateType(
    {
      [Kind]: 'Constructor',
      type: 'Constructor',
      parameters,
      returns,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/function/function.mjs
/** `[JavaScript]` Creates a Function type */
function Function(parameters, returns, options) {
  return CreateType(
    {
      [Kind]: 'Function',
      type: 'Function',
      parameters,
      returns,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/union/union-create.mjs
function UnionCreate(T, options) {
  return CreateType(
    {
      [Kind]: 'Union',
      anyOf: T,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/union/union-evaluated.mjs
function IsUnionOptional(types) {
  return types.some((type) => IsOptional$1(type));
}
function RemoveOptionalFromRest$1(types) {
  return types.map((left) => (IsOptional$1(left) ? RemoveOptionalFromType$1(left) : left));
}
function RemoveOptionalFromType$1(T) {
  return Discard(T, [OptionalKind]);
}
function ResolveUnion(types, options) {
  return IsUnionOptional(types)
    ? Optional(UnionCreate(RemoveOptionalFromRest$1(types), options))
    : UnionCreate(RemoveOptionalFromRest$1(types), options);
}
/** `[Json]` Creates an evaluated Union type */
function UnionEvaluated(T, options) {
  return T.length === 1
    ? CreateType(T[0], options)
    : T.length === 0
      ? Never(options)
      : ResolveUnion(T, options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/union/union.mjs
/** `[Json]` Creates a Union type */
function Union$1(types, options) {
  return types.length === 0
    ? Never(options)
    : types.length === 1
      ? CreateType(types[0], options)
      : UnionCreate(types, options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/template-literal/parse.mjs
var TemplateLiteralParserError = class extends TypeBoxError {};
function Unescape(pattern) {
  return pattern
    .replace(/\\\$/g, '$')
    .replace(/\\\*/g, '*')
    .replace(/\\\^/g, '^')
    .replace(/\\\|/g, '|')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')');
}
function IsNonEscaped(pattern, index, char) {
  return pattern[index] === char && pattern.charCodeAt(index - 1) !== 92;
}
function IsOpenParen(pattern, index) {
  return IsNonEscaped(pattern, index, '(');
}
function IsCloseParen(pattern, index) {
  return IsNonEscaped(pattern, index, ')');
}
function IsSeparator(pattern, index) {
  return IsNonEscaped(pattern, index, '|');
}
function IsGroup(pattern) {
  if (!(IsOpenParen(pattern, 0) && IsCloseParen(pattern, pattern.length - 1))) return false;
  let count = 0;
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index)) count += 1;
    if (IsCloseParen(pattern, index)) count -= 1;
    if (count === 0 && index !== pattern.length - 1) return false;
  }
  return true;
}
function InGroup(pattern) {
  return pattern.slice(1, pattern.length - 1);
}
function IsPrecedenceOr(pattern) {
  let count = 0;
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index)) count += 1;
    if (IsCloseParen(pattern, index)) count -= 1;
    if (IsSeparator(pattern, index) && count === 0) return true;
  }
  return false;
}
function IsPrecedenceAnd(pattern) {
  for (let index = 0; index < pattern.length; index++) if (IsOpenParen(pattern, index)) return true;
  return false;
}
function Or(pattern) {
  let [count, start] = [0, 0];
  const expressions = [];
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index)) count += 1;
    if (IsCloseParen(pattern, index)) count -= 1;
    if (IsSeparator(pattern, index) && count === 0) {
      const range = pattern.slice(start, index);
      if (range.length > 0) expressions.push(TemplateLiteralParse(range));
      start = index + 1;
    }
  }
  const range = pattern.slice(start);
  if (range.length > 0) expressions.push(TemplateLiteralParse(range));
  if (expressions.length === 0)
    return {
      type: 'const',
      const: '',
    };
  if (expressions.length === 1) return expressions[0];
  return {
    type: 'or',
    expr: expressions,
  };
}
function And(pattern) {
  function Group(value, index) {
    if (!IsOpenParen(value, index))
      throw new TemplateLiteralParserError(
        `TemplateLiteralParser: Index must point to open parens`,
      );
    let count = 0;
    for (let scan = index; scan < value.length; scan++) {
      if (IsOpenParen(value, scan)) count += 1;
      if (IsCloseParen(value, scan)) count -= 1;
      if (count === 0) return [index, scan];
    }
    throw new TemplateLiteralParserError(
      `TemplateLiteralParser: Unclosed group parens in expression`,
    );
  }
  function Range(pattern, index) {
    for (let scan = index; scan < pattern.length; scan++)
      if (IsOpenParen(pattern, scan)) return [index, scan];
    return [index, pattern.length];
  }
  const expressions = [];
  for (let index = 0; index < pattern.length; index++)
    if (IsOpenParen(pattern, index)) {
      const [start, end] = Group(pattern, index);
      const range = pattern.slice(start, end + 1);
      expressions.push(TemplateLiteralParse(range));
      index = end;
    } else {
      const [start, end] = Range(pattern, index);
      const range = pattern.slice(start, end);
      if (range.length > 0) expressions.push(TemplateLiteralParse(range));
      index = end - 1;
    }
  return expressions.length === 0
    ? {
        type: 'const',
        const: '',
      }
    : expressions.length === 1
      ? expressions[0]
      : {
          type: 'and',
          expr: expressions,
        };
}
/** Parses a pattern and returns an expression tree */
function TemplateLiteralParse(pattern) {
  return IsGroup(pattern)
    ? TemplateLiteralParse(InGroup(pattern))
    : IsPrecedenceOr(pattern)
      ? Or(pattern)
      : IsPrecedenceAnd(pattern)
        ? And(pattern)
        : {
            type: 'const',
            const: Unescape(pattern),
          };
}
/** Parses a pattern and strips forward and trailing ^ and $ */
function TemplateLiteralParseExact(pattern) {
  return TemplateLiteralParse(pattern.slice(1, pattern.length - 1));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/template-literal/finite.mjs
var TemplateLiteralFiniteError = class extends TypeBoxError {};
function IsNumberExpression(expression) {
  return (
    expression.type === 'or' &&
    expression.expr.length === 2 &&
    expression.expr[0].type === 'const' &&
    expression.expr[0].const === '0' &&
    expression.expr[1].type === 'const' &&
    expression.expr[1].const === '[1-9][0-9]*'
  );
}
function IsBooleanExpression(expression) {
  return (
    expression.type === 'or' &&
    expression.expr.length === 2 &&
    expression.expr[0].type === 'const' &&
    expression.expr[0].const === 'true' &&
    expression.expr[1].type === 'const' &&
    expression.expr[1].const === 'false'
  );
}
function IsStringExpression(expression) {
  return expression.type === 'const' && expression.const === '.*';
}
function IsTemplateLiteralExpressionFinite(expression) {
  return IsNumberExpression(expression) || IsStringExpression(expression)
    ? false
    : IsBooleanExpression(expression)
      ? true
      : expression.type === 'and'
        ? expression.expr.every((expr) => IsTemplateLiteralExpressionFinite(expr))
        : expression.type === 'or'
          ? expression.expr.every((expr) => IsTemplateLiteralExpressionFinite(expr))
          : expression.type === 'const'
            ? true
            : (() => {
                throw new TemplateLiteralFiniteError(`Unknown expression type`);
              })();
}
/** Returns true if this TemplateLiteral resolves to a finite set of values */
function IsTemplateLiteralFinite(schema) {
  return IsTemplateLiteralExpressionFinite(TemplateLiteralParseExact(schema.pattern));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/template-literal/generate.mjs
var TemplateLiteralGenerateError = class extends TypeBoxError {};
function* GenerateReduce(buffer) {
  if (buffer.length === 1) return yield* buffer[0];
  for (const left of buffer[0])
    for (const right of GenerateReduce(buffer.slice(1))) yield `${left}${right}`;
}
function* GenerateAnd(expression) {
  return yield* GenerateReduce(
    expression.expr.map((expr) => [...TemplateLiteralExpressionGenerate(expr)]),
  );
}
function* GenerateOr(expression) {
  for (const expr of expression.expr) yield* TemplateLiteralExpressionGenerate(expr);
}
function* GenerateConst(expression) {
  return yield expression.const;
}
function* TemplateLiteralExpressionGenerate(expression) {
  return expression.type === 'and'
    ? yield* GenerateAnd(expression)
    : expression.type === 'or'
      ? yield* GenerateOr(expression)
      : expression.type === 'const'
        ? yield* GenerateConst(expression)
        : (() => {
            throw new TemplateLiteralGenerateError('Unknown expression');
          })();
}
/** Generates a tuple of strings from the given TemplateLiteral. Returns an empty tuple if infinite. */
function TemplateLiteralGenerate(schema) {
  const expression = TemplateLiteralParseExact(schema.pattern);
  return IsTemplateLiteralExpressionFinite(expression)
    ? [...TemplateLiteralExpressionGenerate(expression)]
    : [];
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/literal/literal.mjs
/** `[Json]` Creates a Literal type */
function Literal(value, options) {
  return CreateType(
    {
      [Kind]: 'Literal',
      const: value,
      type: typeof value,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/boolean/boolean.mjs
/** `[Json]` Creates a Boolean type */
function Boolean(options) {
  return CreateType(
    {
      [Kind]: 'Boolean',
      type: 'boolean',
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/bigint/bigint.mjs
/** `[JavaScript]` Creates a BigInt type */
function BigInt$1(options) {
  return CreateType(
    {
      [Kind]: 'BigInt',
      type: 'bigint',
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/number/number.mjs
/** `[Json]` Creates a Number type */
function Number$1(options) {
  return CreateType(
    {
      [Kind]: 'Number',
      type: 'number',
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/string/string.mjs
/** `[Json]` Creates a String type */
function String(options) {
  return CreateType(
    {
      [Kind]: 'String',
      type: 'string',
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/template-literal/syntax.mjs
function* FromUnion$17(syntax) {
  const trim = syntax.trim().replace(/"|'/g, '');
  return trim === 'boolean'
    ? yield Boolean()
    : trim === 'number'
      ? yield Number$1()
      : trim === 'bigint'
        ? yield BigInt$1()
        : trim === 'string'
          ? yield String()
          : yield (() => {
              const literals = trim.split('|').map((literal) => Literal(literal.trim()));
              return literals.length === 0
                ? Never()
                : literals.length === 1
                  ? literals[0]
                  : UnionEvaluated(literals);
            })();
}
function* FromTerminal(syntax) {
  if (syntax[1] !== '{') return yield* [Literal('$'), ...FromSyntax(syntax.slice(1))];
  for (let i = 2; i < syntax.length; i++)
    if (syntax[i] === '}') {
      const L = FromUnion$17(syntax.slice(2, i));
      const R = FromSyntax(syntax.slice(i + 1));
      return yield* [...L, ...R];
    }
  yield Literal(syntax);
}
function* FromSyntax(syntax) {
  for (let i = 0; i < syntax.length; i++)
    if (syntax[i] === '$')
      return yield* [Literal(syntax.slice(0, i)), ...FromTerminal(syntax.slice(i))];
  yield Literal(syntax);
}
/** Parses TemplateLiteralSyntax and returns a tuple of TemplateLiteralKinds */
function TemplateLiteralSyntax(syntax) {
  return [...FromSyntax(syntax)];
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/template-literal/pattern.mjs
var TemplateLiteralPatternError = class extends TypeBoxError {};
function Escape(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function Visit$10(schema, acc) {
  return IsTemplateLiteral$1(schema)
    ? schema.pattern.slice(1, schema.pattern.length - 1)
    : IsUnion$1(schema)
      ? `(${schema.anyOf.map((schema) => Visit$10(schema, acc)).join('|')})`
      : IsNumber$1(schema)
        ? `${acc}${PatternNumber}`
        : IsInteger$1(schema)
          ? `${acc}${PatternNumber}`
          : IsBigInt$1(schema)
            ? `${acc}${PatternNumber}`
            : IsString$1(schema)
              ? `${acc}${PatternString}`
              : IsLiteral$1(schema)
                ? `${acc}${Escape(schema.const.toString())}`
                : IsBoolean$1(schema)
                  ? `${acc}${PatternBoolean}`
                  : (() => {
                      throw new TemplateLiteralPatternError(`Unexpected Kind '${schema[Kind]}'`);
                    })();
}
function TemplateLiteralPattern(kinds) {
  return `^${kinds.map((schema) => Visit$10(schema, '')).join('')}\$`;
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/template-literal/union.mjs
/** Returns a Union from the given TemplateLiteral */
function TemplateLiteralToUnion(schema) {
  return UnionEvaluated(TemplateLiteralGenerate(schema).map((S) => Literal(S)));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/template-literal/template-literal.mjs
/** `[Json]` Creates a TemplateLiteral type */
function TemplateLiteral(unresolved, options) {
  const pattern = IsString$3(unresolved)
    ? TemplateLiteralPattern(TemplateLiteralSyntax(unresolved))
    : TemplateLiteralPattern(unresolved);
  return CreateType(
    {
      [Kind]: 'TemplateLiteral',
      type: 'string',
      pattern,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/indexed/indexed-property-keys.mjs
function FromTemplateLiteral$5(templateLiteral) {
  return TemplateLiteralGenerate(templateLiteral).map((key) => key.toString());
}
function FromUnion$16(types) {
  const result = [];
  for (const type of types) result.push(...IndexPropertyKeys(type));
  return result;
}
function FromLiteral$4(literalValue) {
  return [literalValue.toString()];
}
/** Returns a tuple of PropertyKeys derived from the given TSchema */
function IndexPropertyKeys(type) {
  return [
    ...new Set(
      IsTemplateLiteral$1(type)
        ? FromTemplateLiteral$5(type)
        : IsUnion$1(type)
          ? FromUnion$16(type.anyOf)
          : IsLiteral$1(type)
            ? FromLiteral$4(type.const)
            : IsNumber$1(type)
              ? ['[number]']
              : IsInteger$1(type)
                ? ['[number]']
                : [],
    ),
  ];
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/indexed/indexed-from-mapped-result.mjs
function FromProperties$18(type, properties, options) {
  const result = {};
  for (const K2 of Object.getOwnPropertyNames(properties))
    result[K2] = Index(type, IndexPropertyKeys(properties[K2]), options);
  return result;
}
function FromMappedResult$11(type, mappedResult, options) {
  return FromProperties$18(type, mappedResult.properties, options);
}
function IndexFromMappedResult(type, mappedResult, options) {
  return MappedResult(FromMappedResult$11(type, mappedResult, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/indexed/indexed.mjs
function FromRest$6(types, key) {
  return types.map((type) => IndexFromPropertyKey(type, key));
}
function FromIntersectRest(types) {
  return types.filter((type) => !IsNever$1(type));
}
function FromIntersect$15(types, key) {
  return IntersectEvaluated(FromIntersectRest(FromRest$6(types, key)));
}
function FromUnionRest(types) {
  return types.some((L) => IsNever$1(L)) ? [] : types;
}
function FromUnion$15(types, key) {
  return UnionEvaluated(FromUnionRest(FromRest$6(types, key)));
}
function FromTuple$12(types, key) {
  return key in types ? types[key] : key === '[number]' ? UnionEvaluated(types) : Never();
}
function FromArray$14(type, key) {
  return key === '[number]' ? type : Never();
}
function FromProperty$2(properties, propertyKey) {
  return propertyKey in properties ? properties[propertyKey] : Never();
}
function IndexFromPropertyKey(type, propertyKey) {
  return IsIntersect$1(type)
    ? FromIntersect$15(type.allOf, propertyKey)
    : IsUnion$1(type)
      ? FromUnion$15(type.anyOf, propertyKey)
      : IsTuple$1(type)
        ? FromTuple$12(type.items ?? [], propertyKey)
        : IsArray$1(type)
          ? FromArray$14(type.items, propertyKey)
          : IsObject$1(type)
            ? FromProperty$2(type.properties, propertyKey)
            : Never();
}
function IndexFromPropertyKeys(type, propertyKeys) {
  return propertyKeys.map((propertyKey) => IndexFromPropertyKey(type, propertyKey));
}
function FromSchema(type, propertyKeys) {
  return UnionEvaluated(IndexFromPropertyKeys(type, propertyKeys));
}
/** `[Json]` Returns an Indexed property type for the given keys */
function Index(type, key, options) {
  if (IsRef$1(type) || IsRef$1(key)) {
    const error = `Index types using Ref parameters require both Type and Key to be of TSchema`;
    if (!IsSchema$1(type) || !IsSchema$1(key)) throw new TypeBoxError(error);
    return Computed('Index', [type, key]);
  }
  if (IsMappedResult$1(key)) return IndexFromMappedResult(type, key, options);
  if (IsMappedKey$1(key)) return IndexFromMappedKey(type, key, options);
  return CreateType(
    IsSchema$1(key) ? FromSchema(type, IndexPropertyKeys(key)) : FromSchema(type, key),
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/indexed/indexed-from-mapped-key.mjs
function MappedIndexPropertyKey(type, key, options) {
  return { [key]: Index(type, [key], Clone$1(options)) };
}
function MappedIndexPropertyKeys(type, propertyKeys, options) {
  return propertyKeys.reduce((result, left) => {
    return {
      ...result,
      ...MappedIndexPropertyKey(type, left, options),
    };
  }, {});
}
function MappedIndexProperties(type, mappedKey, options) {
  return MappedIndexPropertyKeys(type, mappedKey.keys, options);
}
function IndexFromMappedKey(type, mappedKey, options) {
  return MappedResult(MappedIndexProperties(type, mappedKey, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/iterator/iterator.mjs
/** `[JavaScript]` Creates an Iterator type */
function Iterator(items, options) {
  return CreateType(
    {
      [Kind]: 'Iterator',
      type: 'Iterator',
      items,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/object/object.mjs
/** Creates a RequiredArray derived from the given TProperties value. */
function RequiredArray(properties) {
  return globalThis.Object.keys(properties).filter((key) => !IsOptional$1(properties[key]));
}
/** `[Json]` Creates an Object type */
function _Object(properties, options) {
  const required = RequiredArray(properties);
  return CreateType(
    required.length > 0
      ? {
          [Kind]: 'Object',
          type: 'object',
          required,
          properties,
        }
      : {
          [Kind]: 'Object',
          type: 'object',
          properties,
        },
    options,
  );
}
/** `[Json]` Creates an Object type */
var Object$1 = _Object;
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/promise/promise.mjs
/** `[JavaScript]` Creates a Promise type */
function Promise$1(item, options) {
  return CreateType(
    {
      [Kind]: 'Promise',
      type: 'Promise',
      item,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/readonly/readonly.mjs
function RemoveReadonly(schema) {
  return CreateType(Discard(schema, [ReadonlyKind]));
}
function AddReadonly(schema) {
  return CreateType({
    ...schema,
    [ReadonlyKind]: 'Readonly',
  });
}
function ReadonlyWithFlag(schema, F) {
  return F === false ? RemoveReadonly(schema) : AddReadonly(schema);
}
/** `[Json]` Creates a Readonly property */
function Readonly(schema, enable) {
  const F = enable ?? true;
  return IsMappedResult$1(schema)
    ? ReadonlyFromMappedResult(schema, F)
    : ReadonlyWithFlag(schema, F);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/readonly/readonly-from-mapped-result.mjs
function FromProperties$17(K, F) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(K)) Acc[K2] = Readonly(K[K2], F);
  return Acc;
}
function FromMappedResult$10(R, F) {
  return FromProperties$17(R.properties, F);
}
function ReadonlyFromMappedResult(R, F) {
  return MappedResult(FromMappedResult$10(R, F));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/tuple/tuple.mjs
/** `[Json]` Creates a Tuple type */
function Tuple(types, options) {
  return CreateType(
    types.length > 0
      ? {
          [Kind]: 'Tuple',
          type: 'array',
          items: types,
          additionalItems: false,
          minItems: types.length,
          maxItems: types.length,
        }
      : {
          [Kind]: 'Tuple',
          type: 'array',
          minItems: types.length,
          maxItems: types.length,
        },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/mapped/mapped.mjs
function FromMappedResult$9(K, P) {
  return K in P ? FromSchemaType(K, P[K]) : MappedResult(P);
}
function MappedKeyToKnownMappedResultProperties(K) {
  return { [K]: Literal(K) };
}
function MappedKeyToUnknownMappedResultProperties(P) {
  const Acc = {};
  for (const L of P) Acc[L] = Literal(L);
  return Acc;
}
function MappedKeyToMappedResultProperties(K, P) {
  return SetIncludes(P, K)
    ? MappedKeyToKnownMappedResultProperties(K)
    : MappedKeyToUnknownMappedResultProperties(P);
}
function FromMappedKey$3(K, P) {
  return FromMappedResult$9(K, MappedKeyToMappedResultProperties(K, P));
}
function FromRest$5(K, T) {
  return T.map((L) => FromSchemaType(K, L));
}
function FromProperties$16(K, T) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(T)) Acc[K2] = FromSchemaType(K, T[K2]);
  return Acc;
}
function FromSchemaType(K, T) {
  const options = { ...T };
  return IsOptional$1(T)
    ? Optional(FromSchemaType(K, Discard(T, [OptionalKind])))
    : IsReadonly(T)
      ? Readonly(FromSchemaType(K, Discard(T, [ReadonlyKind])))
      : IsMappedResult$1(T)
        ? FromMappedResult$9(K, T.properties)
        : IsMappedKey$1(T)
          ? FromMappedKey$3(K, T.keys)
          : IsConstructor$1(T)
            ? Constructor(FromRest$5(K, T.parameters), FromSchemaType(K, T.returns), options)
            : IsFunction$1(T)
              ? Function(FromRest$5(K, T.parameters), FromSchemaType(K, T.returns), options)
              : IsAsyncIterator$1(T)
                ? AsyncIterator(FromSchemaType(K, T.items), options)
                : IsIterator$1(T)
                  ? Iterator(FromSchemaType(K, T.items), options)
                  : IsIntersect$1(T)
                    ? Intersect$1(FromRest$5(K, T.allOf), options)
                    : IsUnion$1(T)
                      ? Union$1(FromRest$5(K, T.anyOf), options)
                      : IsTuple$1(T)
                        ? Tuple(FromRest$5(K, T.items ?? []), options)
                        : IsObject$1(T)
                          ? Object$1(FromProperties$16(K, T.properties), options)
                          : IsArray$1(T)
                            ? Array$1(FromSchemaType(K, T.items), options)
                            : IsPromise$1(T)
                              ? Promise$1(FromSchemaType(K, T.item), options)
                              : T;
}
function MappedFunctionReturnType(K, T) {
  const Acc = {};
  for (const L of K) Acc[L] = FromSchemaType(L, T);
  return Acc;
}
/** `[Json]` Creates a Mapped object type */
function Mapped(key, map, options) {
  const K = IsSchema$1(key) ? IndexPropertyKeys(key) : key;
  return Object$1(
    MappedFunctionReturnType(
      K,
      map({
        [Kind]: 'MappedKey',
        keys: K,
      }),
    ),
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/optional/optional.mjs
function RemoveOptional(schema) {
  return CreateType(Discard(schema, [OptionalKind]));
}
function AddOptional(schema) {
  return CreateType({
    ...schema,
    [OptionalKind]: 'Optional',
  });
}
function OptionalWithFlag(schema, F) {
  return F === false ? RemoveOptional(schema) : AddOptional(schema);
}
/** `[Json]` Creates a Optional property */
function Optional(schema, enable) {
  const F = enable ?? true;
  return IsMappedResult$1(schema)
    ? OptionalFromMappedResult(schema, F)
    : OptionalWithFlag(schema, F);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/optional/optional-from-mapped-result.mjs
function FromProperties$15(P, F) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(P)) Acc[K2] = Optional(P[K2], F);
  return Acc;
}
function FromMappedResult$8(R, F) {
  return FromProperties$15(R.properties, F);
}
function OptionalFromMappedResult(R, F) {
  return MappedResult(FromMappedResult$8(R, F));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/intersect/intersect-create.mjs
function IntersectCreate(T, options = {}) {
  const allObjects = T.every((schema) => IsObject$1(schema));
  const clonedUnevaluatedProperties = IsSchema$1(options.unevaluatedProperties)
    ? { unevaluatedProperties: options.unevaluatedProperties }
    : {};
  return CreateType(
    options.unevaluatedProperties === false ||
      IsSchema$1(options.unevaluatedProperties) ||
      allObjects
      ? {
          ...clonedUnevaluatedProperties,
          [Kind]: 'Intersect',
          type: 'object',
          allOf: T,
        }
      : {
          ...clonedUnevaluatedProperties,
          [Kind]: 'Intersect',
          allOf: T,
        },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/intersect/intersect-evaluated.mjs
function IsIntersectOptional(types) {
  return types.every((left) => IsOptional$1(left));
}
function RemoveOptionalFromType(type) {
  return Discard(type, [OptionalKind]);
}
function RemoveOptionalFromRest(types) {
  return types.map((left) => (IsOptional$1(left) ? RemoveOptionalFromType(left) : left));
}
function ResolveIntersect(types, options) {
  return IsIntersectOptional(types)
    ? Optional(IntersectCreate(RemoveOptionalFromRest(types), options))
    : IntersectCreate(RemoveOptionalFromRest(types), options);
}
/** `[Json]` Creates an evaluated Intersect type */
function IntersectEvaluated(types, options = {}) {
  if (types.length === 1) return CreateType(types[0], options);
  if (types.length === 0) return Never(options);
  if (types.some((schema) => IsTransform$1(schema)))
    throw new Error('Cannot intersect transform types');
  return ResolveIntersect(types, options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/intersect/intersect.mjs
/** `[Json]` Creates an evaluated Intersect type */
function Intersect$1(types, options) {
  if (types.length === 1) return CreateType(types[0], options);
  if (types.length === 0) return Never(options);
  if (types.some((schema) => IsTransform$1(schema)))
    throw new Error('Cannot intersect transform types');
  return IntersectCreate(types, options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/ref/ref.mjs
/** `[Json]` Creates a Ref type. The referenced type must contain a $id */
function Ref(...args) {
  const [$ref, options] = typeof args[0] === 'string' ? [args[0], args[1]] : [args[0].$id, args[1]];
  if (typeof $ref !== 'string') throw new TypeBoxError('Ref: $ref must be a string');
  return CreateType(
    {
      [Kind]: 'Ref',
      $ref,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/awaited/awaited.mjs
function FromComputed$4(target, parameters) {
  return Computed('Awaited', [Computed(target, parameters)]);
}
function FromRef$11($ref) {
  return Computed('Awaited', [Ref($ref)]);
}
function FromIntersect$14(types) {
  return Intersect$1(FromRest$4(types));
}
function FromUnion$14(types) {
  return Union$1(FromRest$4(types));
}
function FromPromise$6(type) {
  return Awaited(type);
}
function FromRest$4(types) {
  return types.map((type) => Awaited(type));
}
/** `[JavaScript]` Constructs a type by recursively unwrapping Promise types */
function Awaited(type, options) {
  return CreateType(
    IsComputed$1(type)
      ? FromComputed$4(type.target, type.parameters)
      : IsIntersect$1(type)
        ? FromIntersect$14(type.allOf)
        : IsUnion$1(type)
          ? FromUnion$14(type.anyOf)
          : IsPromise$1(type)
            ? FromPromise$6(type.item)
            : IsRef$1(type)
              ? FromRef$11(type.$ref)
              : type,
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/keyof/keyof-property-keys.mjs
function FromRest$3(types) {
  const result = [];
  for (const L of types) result.push(KeyOfPropertyKeys(L));
  return result;
}
function FromIntersect$13(types) {
  return SetUnionMany(FromRest$3(types));
}
function FromUnion$13(types) {
  return SetIntersectMany(FromRest$3(types));
}
function FromTuple$11(types) {
  return types.map((_, indexer) => indexer.toString());
}
function FromArray$13(_) {
  return ['[number]'];
}
function FromProperties$14(T) {
  return globalThis.Object.getOwnPropertyNames(T);
}
function FromPatternProperties(patternProperties) {
  if (!includePatternProperties) return [];
  return globalThis.Object.getOwnPropertyNames(patternProperties).map((key) => {
    return key[0] === '^' && key[key.length - 1] === '$' ? key.slice(1, key.length - 1) : key;
  });
}
/** Returns a tuple of PropertyKeys derived from the given TSchema. */
function KeyOfPropertyKeys(type) {
  return IsIntersect$1(type)
    ? FromIntersect$13(type.allOf)
    : IsUnion$1(type)
      ? FromUnion$13(type.anyOf)
      : IsTuple$1(type)
        ? FromTuple$11(type.items ?? [])
        : IsArray$1(type)
          ? FromArray$13(type.items)
          : IsObject$1(type)
            ? FromProperties$14(type.properties)
            : IsRecord$1(type)
              ? FromPatternProperties(type.patternProperties)
              : [];
}
var includePatternProperties = false;
/** Returns a regular expression pattern derived from the given TSchema */
function KeyOfPattern(schema) {
  includePatternProperties = true;
  const keys = KeyOfPropertyKeys(schema);
  includePatternProperties = false;
  return `^(${keys.map((key) => `(${key})`).join('|')})$`;
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/keyof/keyof.mjs
function FromComputed$3(target, parameters) {
  return Computed('KeyOf', [Computed(target, parameters)]);
}
function FromRef$10($ref) {
  return Computed('KeyOf', [Ref($ref)]);
}
function KeyOfFromType(type, options) {
  return CreateType(UnionEvaluated(KeyOfPropertyKeysToRest(KeyOfPropertyKeys(type))), options);
}
function KeyOfPropertyKeysToRest(propertyKeys) {
  return propertyKeys.map((L) => (L === '[number]' ? Number$1() : Literal(L)));
}
/** `[Json]` Creates a KeyOf type */
function KeyOf(type, options) {
  return IsComputed$1(type)
    ? FromComputed$3(type.target, type.parameters)
    : IsRef$1(type)
      ? FromRef$10(type.$ref)
      : IsMappedResult$1(type)
        ? KeyOfFromMappedResult(type, options)
        : KeyOfFromType(type, options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/keyof/keyof-from-mapped-result.mjs
function FromProperties$13(properties, options) {
  const result = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(properties))
    result[K2] = KeyOf(properties[K2], Clone$1(options));
  return result;
}
function FromMappedResult$7(mappedResult, options) {
  return FromProperties$13(mappedResult.properties, options);
}
function KeyOfFromMappedResult(mappedResult, options) {
  return MappedResult(FromMappedResult$7(mappedResult, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/keyof/keyof-property-entries.mjs
/**
 * `[Utility]` Resolves an array of keys and schemas from the given schema. This method is faster
 * than obtaining the keys and resolving each individually via indexing. This method was written
 * accellerate Intersect and Union encoding.
 */
function KeyOfPropertyEntries(schema) {
  const keys = KeyOfPropertyKeys(schema);
  const schemas = IndexFromPropertyKeys(schema, keys);
  return keys.map((_, index) => [keys[index], schemas[index]]);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/composite/composite.mjs
function CompositeKeys(T) {
  const Acc = [];
  for (const L of T) Acc.push(...KeyOfPropertyKeys(L));
  return SetDistinct(Acc);
}
function FilterNever(T) {
  return T.filter((L) => !IsNever$1(L));
}
function CompositeProperty(T, K) {
  const Acc = [];
  for (const L of T) Acc.push(...IndexFromPropertyKeys(L, [K]));
  return FilterNever(Acc);
}
function CompositeProperties(T, K) {
  const Acc = {};
  for (const L of K) Acc[L] = IntersectEvaluated(CompositeProperty(T, L));
  return Acc;
}
function Composite(T, options) {
  return Object$1(CompositeProperties(T, CompositeKeys(T)), options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/date/date.mjs
/** `[JavaScript]` Creates a Date type */
function Date$1(options) {
  return CreateType(
    {
      [Kind]: 'Date',
      type: 'Date',
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/null/null.mjs
/** `[Json]` Creates a Null type */
function Null(options) {
  return CreateType(
    {
      [Kind]: 'Null',
      type: 'null',
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/symbol/symbol.mjs
/** `[JavaScript]` Creates a Symbol type */
function Symbol$1(options) {
  return CreateType(
    {
      [Kind]: 'Symbol',
      type: 'symbol',
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/undefined/undefined.mjs
/** `[JavaScript]` Creates a Undefined type */
function Undefined(options) {
  return CreateType(
    {
      [Kind]: 'Undefined',
      type: 'undefined',
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/uint8array/uint8array.mjs
/** `[JavaScript]` Creates a Uint8Array type */
function Uint8Array$1(options) {
  return CreateType(
    {
      [Kind]: 'Uint8Array',
      type: 'Uint8Array',
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/unknown/unknown.mjs
/** `[Json]` Creates an Unknown type */
function Unknown(options) {
  return CreateType({ [Kind]: 'Unknown' }, options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/const/const.mjs
function FromArray$12(T) {
  return T.map((L) => FromValue$1(L, false));
}
function FromProperties$12(value) {
  const Acc = {};
  for (const K of globalThis.Object.getOwnPropertyNames(value))
    Acc[K] = Readonly(FromValue$1(value[K], false));
  return Acc;
}
function ConditionalReadonly(T, root) {
  return root === true ? T : Readonly(T);
}
function FromValue$1(value, root) {
  return IsAsyncIterator$3(value)
    ? ConditionalReadonly(Any(), root)
    : IsIterator$3(value)
      ? ConditionalReadonly(Any(), root)
      : IsArray$3(value)
        ? Readonly(Tuple(FromArray$12(value)))
        : IsUint8Array$3(value)
          ? Uint8Array$1()
          : IsDate$3(value)
            ? Date$1()
            : IsObject$3(value)
              ? ConditionalReadonly(Object$1(FromProperties$12(value)), root)
              : IsFunction$3(value)
                ? ConditionalReadonly(Function([], Unknown()), root)
                : IsUndefined$3(value)
                  ? Undefined()
                  : IsNull$3(value)
                    ? Null()
                    : IsSymbol$3(value)
                      ? Symbol$1()
                      : IsBigInt$3(value)
                        ? BigInt$1()
                        : IsNumber$3(value)
                          ? Literal(value)
                          : IsBoolean$3(value)
                            ? Literal(value)
                            : IsString$3(value)
                              ? Literal(value)
                              : Object$1({});
}
/** `[JavaScript]` Creates a readonly const type from the given value. */
function Const(T, options) {
  return CreateType(FromValue$1(T, true), options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/constructor-parameters/constructor-parameters.mjs
/** `[JavaScript]` Extracts the ConstructorParameters from the given Constructor type */
function ConstructorParameters(schema, options) {
  return IsConstructor$1(schema) ? Tuple(schema.parameters, options) : Never(options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/enum/enum.mjs
/** `[Json]` Creates a Enum type */
function Enum(item, options) {
  if (IsUndefined$3(item)) throw new Error('Enum undefined or empty');
  const values1 = globalThis.Object.getOwnPropertyNames(item)
    .filter((key) => isNaN(key))
    .map((key) => item[key]);
  return Union$1(
    [...new Set(values1)].map((value) => Literal(value)),
    {
      ...options,
      [Hint]: 'Enum',
    },
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/extends/extends-check.mjs
var ExtendsResolverError = class extends TypeBoxError {};
var ExtendsResult;
(function (ExtendsResult) {
  ExtendsResult[(ExtendsResult['Union'] = 0)] = 'Union';
  ExtendsResult[(ExtendsResult['True'] = 1)] = 'True';
  ExtendsResult[(ExtendsResult['False'] = 2)] = 'False';
})(ExtendsResult || (ExtendsResult = {}));
function IntoBooleanResult(result) {
  return result === ExtendsResult.False ? result : ExtendsResult.True;
}
function Throw(message) {
  throw new ExtendsResolverError(message);
}
function IsStructuralRight(right) {
  return IsNever(right) || IsIntersect(right) || IsUnion(right) || IsUnknown(right) || IsAny(right);
}
function StructuralRight(left, right) {
  return IsNever(right)
    ? FromNeverRight(left, right)
    : IsIntersect(right)
      ? FromIntersectRight(left, right)
      : IsUnion(right)
        ? FromUnionRight(left, right)
        : IsUnknown(right)
          ? FromUnknownRight(left, right)
          : IsAny(right)
            ? FromAnyRight(left, right)
            : Throw('StructuralRight');
}
function FromAnyRight(left, right) {
  return ExtendsResult.True;
}
function FromAny$3(left, right) {
  return IsIntersect(right)
    ? FromIntersectRight(left, right)
    : IsUnion(right) && right.anyOf.some((schema) => IsAny(schema) || IsUnknown(schema))
      ? ExtendsResult.True
      : IsUnion(right)
        ? ExtendsResult.Union
        : IsUnknown(right)
          ? ExtendsResult.True
          : IsAny(right)
            ? ExtendsResult.True
            : ExtendsResult.Union;
}
function FromArrayRight(left, right) {
  return IsUnknown(left)
    ? ExtendsResult.False
    : IsAny(left)
      ? ExtendsResult.Union
      : IsNever(left)
        ? ExtendsResult.True
        : ExtendsResult.False;
}
function FromArray$11(left, right) {
  return IsObject(right) && IsObjectArrayLike(right)
    ? ExtendsResult.True
    : IsStructuralRight(right)
      ? StructuralRight(left, right)
      : !IsArray(right)
        ? ExtendsResult.False
        : IntoBooleanResult(Visit$9(left.items, right.items));
}
function FromAsyncIterator$6(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : !IsAsyncIterator(right)
      ? ExtendsResult.False
      : IntoBooleanResult(Visit$9(left.items, right.items));
}
function FromBigInt$3(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : IsRecord(right)
        ? FromRecordRight(left, right)
        : IsBigInt(right)
          ? ExtendsResult.True
          : ExtendsResult.False;
}
function FromBooleanRight(left, right) {
  return IsLiteralBoolean(left)
    ? ExtendsResult.True
    : IsBoolean(left)
      ? ExtendsResult.True
      : ExtendsResult.False;
}
function FromBoolean$3(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : IsRecord(right)
        ? FromRecordRight(left, right)
        : IsBoolean(right)
          ? ExtendsResult.True
          : ExtendsResult.False;
}
function FromConstructor$6(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : !IsConstructor(right)
        ? ExtendsResult.False
        : left.parameters.length > right.parameters.length
          ? ExtendsResult.False
          : !left.parameters.every(
                (schema, index) =>
                  IntoBooleanResult(Visit$9(right.parameters[index], schema)) ===
                  ExtendsResult.True,
              )
            ? ExtendsResult.False
            : IntoBooleanResult(Visit$9(left.returns, right.returns));
}
function FromDate$5(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : IsRecord(right)
        ? FromRecordRight(left, right)
        : IsDate(right)
          ? ExtendsResult.True
          : ExtendsResult.False;
}
function FromFunction$6(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : !IsFunction(right)
        ? ExtendsResult.False
        : left.parameters.length > right.parameters.length
          ? ExtendsResult.False
          : !left.parameters.every(
                (schema, index) =>
                  IntoBooleanResult(Visit$9(right.parameters[index], schema)) ===
                  ExtendsResult.True,
              )
            ? ExtendsResult.False
            : IntoBooleanResult(Visit$9(left.returns, right.returns));
}
function FromIntegerRight(left, right) {
  return IsLiteral(left) && IsNumber$3(left.const)
    ? ExtendsResult.True
    : IsNumber(left) || IsInteger(left)
      ? ExtendsResult.True
      : ExtendsResult.False;
}
function FromInteger$3(left, right) {
  return IsInteger(right) || IsNumber(right)
    ? ExtendsResult.True
    : IsStructuralRight(right)
      ? StructuralRight(left, right)
      : IsObject(right)
        ? FromObjectRight(left, right)
        : IsRecord(right)
          ? FromRecordRight(left, right)
          : ExtendsResult.False;
}
function FromIntersectRight(left, right) {
  return right.allOf.every((schema) => Visit$9(left, schema) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False;
}
function FromIntersect$12(left, right) {
  return left.allOf.some((schema) => Visit$9(schema, right) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False;
}
function FromIterator$6(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : !IsIterator(right)
      ? ExtendsResult.False
      : IntoBooleanResult(Visit$9(left.items, right.items));
}
function FromLiteral$3(left, right) {
  return IsLiteral(right) && right.const === left.const
    ? ExtendsResult.True
    : IsStructuralRight(right)
      ? StructuralRight(left, right)
      : IsObject(right)
        ? FromObjectRight(left, right)
        : IsRecord(right)
          ? FromRecordRight(left, right)
          : IsString(right)
            ? FromStringRight(left, right)
            : IsNumber(right)
              ? FromNumberRight(left, right)
              : IsInteger(right)
                ? FromIntegerRight(left, right)
                : IsBoolean(right)
                  ? FromBooleanRight(left, right)
                  : ExtendsResult.False;
}
function FromNeverRight(left, right) {
  return ExtendsResult.False;
}
function FromNever$3(left, right) {
  return ExtendsResult.True;
}
function UnwrapTNot(schema) {
  let [current, depth] = [schema, 0];
  while (true) {
    if (!IsNot(current)) break;
    current = current.not;
    depth += 1;
  }
  return depth % 2 === 0 ? current : Unknown();
}
function FromNot$6(left, right) {
  return IsNot(left)
    ? Visit$9(UnwrapTNot(left), right)
    : IsNot(right)
      ? Visit$9(left, UnwrapTNot(right))
      : Throw('Invalid fallthrough for Not');
}
function FromNull$3(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : IsRecord(right)
        ? FromRecordRight(left, right)
        : IsNull(right)
          ? ExtendsResult.True
          : ExtendsResult.False;
}
function FromNumberRight(left, right) {
  return IsLiteralNumber(left)
    ? ExtendsResult.True
    : IsNumber(left) || IsInteger(left)
      ? ExtendsResult.True
      : ExtendsResult.False;
}
function FromNumber$3(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : IsRecord(right)
        ? FromRecordRight(left, right)
        : IsInteger(right) || IsNumber(right)
          ? ExtendsResult.True
          : ExtendsResult.False;
}
function IsObjectPropertyCount(schema, count) {
  return Object.getOwnPropertyNames(schema.properties).length === count;
}
function IsObjectStringLike(schema) {
  return IsObjectArrayLike(schema);
}
function IsObjectSymbolLike(schema) {
  return (
    IsObjectPropertyCount(schema, 0) ||
    (IsObjectPropertyCount(schema, 1) &&
      'description' in schema.properties &&
      IsUnion(schema.properties.description) &&
      schema.properties.description.anyOf.length === 2 &&
      ((IsString(schema.properties.description.anyOf[0]) &&
        IsUndefined(schema.properties.description.anyOf[1])) ||
        (IsString(schema.properties.description.anyOf[1]) &&
          IsUndefined(schema.properties.description.anyOf[0]))))
  );
}
function IsObjectNumberLike(schema) {
  return IsObjectPropertyCount(schema, 0);
}
function IsObjectBooleanLike(schema) {
  return IsObjectPropertyCount(schema, 0);
}
function IsObjectBigIntLike(schema) {
  return IsObjectPropertyCount(schema, 0);
}
function IsObjectDateLike(schema) {
  return IsObjectPropertyCount(schema, 0);
}
function IsObjectUint8ArrayLike(schema) {
  return IsObjectArrayLike(schema);
}
function IsObjectFunctionLike(schema) {
  const length = Number$1();
  return (
    IsObjectPropertyCount(schema, 0) ||
    (IsObjectPropertyCount(schema, 1) &&
      'length' in schema.properties &&
      IntoBooleanResult(Visit$9(schema.properties['length'], length)) === ExtendsResult.True)
  );
}
function IsObjectConstructorLike(schema) {
  return IsObjectPropertyCount(schema, 0);
}
function IsObjectArrayLike(schema) {
  const length = Number$1();
  return (
    IsObjectPropertyCount(schema, 0) ||
    (IsObjectPropertyCount(schema, 1) &&
      'length' in schema.properties &&
      IntoBooleanResult(Visit$9(schema.properties['length'], length)) === ExtendsResult.True)
  );
}
function IsObjectPromiseLike(schema) {
  const then = Function([Any()], Any());
  return (
    IsObjectPropertyCount(schema, 0) ||
    (IsObjectPropertyCount(schema, 1) &&
      'then' in schema.properties &&
      IntoBooleanResult(Visit$9(schema.properties['then'], then)) === ExtendsResult.True)
  );
}
function Property(left, right) {
  return Visit$9(left, right) === ExtendsResult.False
    ? ExtendsResult.False
    : IsOptional(left) && !IsOptional(right)
      ? ExtendsResult.False
      : ExtendsResult.True;
}
function FromObjectRight(left, right) {
  return IsUnknown(left)
    ? ExtendsResult.False
    : IsAny(left)
      ? ExtendsResult.Union
      : IsNever(left) ||
          (IsLiteralString(left) && IsObjectStringLike(right)) ||
          (IsLiteralNumber(left) && IsObjectNumberLike(right)) ||
          (IsLiteralBoolean(left) && IsObjectBooleanLike(right)) ||
          (IsSymbol(left) && IsObjectSymbolLike(right)) ||
          (IsBigInt(left) && IsObjectBigIntLike(right)) ||
          (IsString(left) && IsObjectStringLike(right)) ||
          (IsSymbol(left) && IsObjectSymbolLike(right)) ||
          (IsNumber(left) && IsObjectNumberLike(right)) ||
          (IsInteger(left) && IsObjectNumberLike(right)) ||
          (IsBoolean(left) && IsObjectBooleanLike(right)) ||
          (IsUint8Array(left) && IsObjectUint8ArrayLike(right)) ||
          (IsDate(left) && IsObjectDateLike(right)) ||
          (IsConstructor(left) && IsObjectConstructorLike(right)) ||
          (IsFunction(left) && IsObjectFunctionLike(right))
        ? ExtendsResult.True
        : IsRecord(left) && IsString(RecordKey$1(left))
          ? right[Hint] === 'Record'
            ? ExtendsResult.True
            : ExtendsResult.False
          : IsRecord(left) && IsNumber(RecordKey$1(left))
            ? IsObjectPropertyCount(right, 0)
              ? ExtendsResult.True
              : ExtendsResult.False
            : ExtendsResult.False;
}
function FromObject$15(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsRecord(right)
      ? FromRecordRight(left, right)
      : !IsObject(right)
        ? ExtendsResult.False
        : (() => {
            for (const key of Object.getOwnPropertyNames(right.properties)) {
              if (!(key in left.properties) && !IsOptional(right.properties[key]))
                return ExtendsResult.False;
              if (IsOptional(right.properties[key])) return ExtendsResult.True;
              if (Property(left.properties[key], right.properties[key]) === ExtendsResult.False)
                return ExtendsResult.False;
            }
            return ExtendsResult.True;
          })();
}
function FromPromise$5(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right) && IsObjectPromiseLike(right)
      ? ExtendsResult.True
      : !IsPromise(right)
        ? ExtendsResult.False
        : IntoBooleanResult(Visit$9(left.item, right.item));
}
function RecordKey$1(schema) {
  return PatternNumberExact in schema.patternProperties
    ? Number$1()
    : PatternStringExact in schema.patternProperties
      ? String()
      : Throw('Unknown record key pattern');
}
function RecordValue$1(schema) {
  return PatternNumberExact in schema.patternProperties
    ? schema.patternProperties[PatternNumberExact]
    : PatternStringExact in schema.patternProperties
      ? schema.patternProperties[PatternStringExact]
      : Throw('Unable to get record value schema');
}
function FromRecordRight(left, right) {
  const [Key, Value] = [RecordKey$1(right), RecordValue$1(right)];
  return IsLiteralString(left) &&
    IsNumber(Key) &&
    IntoBooleanResult(Visit$9(left, Value)) === ExtendsResult.True
    ? ExtendsResult.True
    : IsUint8Array(left) && IsNumber(Key)
      ? Visit$9(left, Value)
      : IsString(left) && IsNumber(Key)
        ? Visit$9(left, Value)
        : IsArray(left) && IsNumber(Key)
          ? Visit$9(left, Value)
          : IsObject(left)
            ? (() => {
                for (const key of Object.getOwnPropertyNames(left.properties))
                  if (Property(Value, left.properties[key]) === ExtendsResult.False)
                    return ExtendsResult.False;
                return ExtendsResult.True;
              })()
            : ExtendsResult.False;
}
function FromRecord$10(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : !IsRecord(right)
        ? ExtendsResult.False
        : Visit$9(RecordValue$1(left), RecordValue$1(right));
}
function FromRegExp$3(left, right) {
  return Visit$9(IsRegExp(left) ? String() : left, IsRegExp(right) ? String() : right);
}
function FromStringRight(left, right) {
  return IsLiteral(left) && IsString$3(left.const)
    ? ExtendsResult.True
    : IsString(left)
      ? ExtendsResult.True
      : ExtendsResult.False;
}
function FromString$3(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : IsRecord(right)
        ? FromRecordRight(left, right)
        : IsString(right)
          ? ExtendsResult.True
          : ExtendsResult.False;
}
function FromSymbol$3(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : IsRecord(right)
        ? FromRecordRight(left, right)
        : IsSymbol(right)
          ? ExtendsResult.True
          : ExtendsResult.False;
}
function FromTemplateLiteral$4(left, right) {
  return IsTemplateLiteral(left)
    ? Visit$9(TemplateLiteralToUnion(left), right)
    : IsTemplateLiteral(right)
      ? Visit$9(left, TemplateLiteralToUnion(right))
      : Throw('Invalid fallthrough for TemplateLiteral');
}
function IsArrayOfTuple(left, right) {
  return (
    IsArray(right) &&
    left.items !== void 0 &&
    left.items.every((schema) => Visit$9(schema, right.items) === ExtendsResult.True)
  );
}
function FromTupleRight(left, right) {
  return IsNever(left)
    ? ExtendsResult.True
    : IsUnknown(left)
      ? ExtendsResult.False
      : IsAny(left)
        ? ExtendsResult.Union
        : ExtendsResult.False;
}
function FromTuple$10(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right) && IsObjectArrayLike(right)
      ? ExtendsResult.True
      : IsArray(right) && IsArrayOfTuple(left, right)
        ? ExtendsResult.True
        : !IsTuple(right)
          ? ExtendsResult.False
          : (IsUndefined$3(left.items) && !IsUndefined$3(right.items)) ||
              (!IsUndefined$3(left.items) && IsUndefined$3(right.items))
            ? ExtendsResult.False
            : IsUndefined$3(left.items) && !IsUndefined$3(right.items)
              ? ExtendsResult.True
              : left.items.every(
                    (schema, index) => Visit$9(schema, right.items[index]) === ExtendsResult.True,
                  )
                ? ExtendsResult.True
                : ExtendsResult.False;
}
function FromUint8Array$3(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : IsRecord(right)
        ? FromRecordRight(left, right)
        : IsUint8Array(right)
          ? ExtendsResult.True
          : ExtendsResult.False;
}
function FromUndefined$3(left, right) {
  return IsStructuralRight(right)
    ? StructuralRight(left, right)
    : IsObject(right)
      ? FromObjectRight(left, right)
      : IsRecord(right)
        ? FromRecordRight(left, right)
        : IsVoid(right)
          ? FromVoidRight(left, right)
          : IsUndefined(right)
            ? ExtendsResult.True
            : ExtendsResult.False;
}
function FromUnionRight(left, right) {
  return right.anyOf.some((schema) => Visit$9(left, schema) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False;
}
function FromUnion$12(left, right) {
  return left.anyOf.every((schema) => Visit$9(schema, right) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False;
}
function FromUnknownRight(left, right) {
  return ExtendsResult.True;
}
function FromUnknown$3(left, right) {
  return IsNever(right)
    ? FromNeverRight(left, right)
    : IsIntersect(right)
      ? FromIntersectRight(left, right)
      : IsUnion(right)
        ? FromUnionRight(left, right)
        : IsAny(right)
          ? FromAnyRight(left, right)
          : IsString(right)
            ? FromStringRight(left, right)
            : IsNumber(right)
              ? FromNumberRight(left, right)
              : IsInteger(right)
                ? FromIntegerRight(left, right)
                : IsBoolean(right)
                  ? FromBooleanRight(left, right)
                  : IsArray(right)
                    ? FromArrayRight(left, right)
                    : IsTuple(right)
                      ? FromTupleRight(left, right)
                      : IsObject(right)
                        ? FromObjectRight(left, right)
                        : IsUnknown(right)
                          ? ExtendsResult.True
                          : ExtendsResult.False;
}
function FromVoidRight(left, right) {
  return IsUndefined(left)
    ? ExtendsResult.True
    : IsUndefined(left)
      ? ExtendsResult.True
      : ExtendsResult.False;
}
function FromVoid$3(left, right) {
  return IsIntersect(right)
    ? FromIntersectRight(left, right)
    : IsUnion(right)
      ? FromUnionRight(left, right)
      : IsUnknown(right)
        ? FromUnknownRight(left, right)
        : IsAny(right)
          ? FromAnyRight(left, right)
          : IsObject(right)
            ? FromObjectRight(left, right)
            : IsVoid(right)
              ? ExtendsResult.True
              : ExtendsResult.False;
}
function Visit$9(left, right) {
  return IsTemplateLiteral(left) || IsTemplateLiteral(right)
    ? FromTemplateLiteral$4(left, right)
    : IsRegExp(left) || IsRegExp(right)
      ? FromRegExp$3(left, right)
      : IsNot(left) || IsNot(right)
        ? FromNot$6(left, right)
        : IsAny(left)
          ? FromAny$3(left, right)
          : IsArray(left)
            ? FromArray$11(left, right)
            : IsBigInt(left)
              ? FromBigInt$3(left, right)
              : IsBoolean(left)
                ? FromBoolean$3(left, right)
                : IsAsyncIterator(left)
                  ? FromAsyncIterator$6(left, right)
                  : IsConstructor(left)
                    ? FromConstructor$6(left, right)
                    : IsDate(left)
                      ? FromDate$5(left, right)
                      : IsFunction(left)
                        ? FromFunction$6(left, right)
                        : IsInteger(left)
                          ? FromInteger$3(left, right)
                          : IsIntersect(left)
                            ? FromIntersect$12(left, right)
                            : IsIterator(left)
                              ? FromIterator$6(left, right)
                              : IsLiteral(left)
                                ? FromLiteral$3(left, right)
                                : IsNever(left)
                                  ? FromNever$3(left, right)
                                  : IsNull(left)
                                    ? FromNull$3(left, right)
                                    : IsNumber(left)
                                      ? FromNumber$3(left, right)
                                      : IsObject(left)
                                        ? FromObject$15(left, right)
                                        : IsRecord(left)
                                          ? FromRecord$10(left, right)
                                          : IsString(left)
                                            ? FromString$3(left, right)
                                            : IsSymbol(left)
                                              ? FromSymbol$3(left, right)
                                              : IsTuple(left)
                                                ? FromTuple$10(left, right)
                                                : IsPromise(left)
                                                  ? FromPromise$5(left, right)
                                                  : IsUint8Array(left)
                                                    ? FromUint8Array$3(left, right)
                                                    : IsUndefined(left)
                                                      ? FromUndefined$3(left, right)
                                                      : IsUnion(left)
                                                        ? FromUnion$12(left, right)
                                                        : IsUnknown(left)
                                                          ? FromUnknown$3(left, right)
                                                          : IsVoid(left)
                                                            ? FromVoid$3(left, right)
                                                            : Throw(
                                                                `Unknown left type operand '${left[Kind]}'`,
                                                              );
}
function ExtendsCheck(left, right) {
  return Visit$9(left, right);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/extends/extends-from-mapped-result.mjs
function FromProperties$11(P, Right, True, False, options) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(P))
    Acc[K2] = Extends(P[K2], Right, True, False, Clone$1(options));
  return Acc;
}
function FromMappedResult$6(Left, Right, True, False, options) {
  return FromProperties$11(Left.properties, Right, True, False, options);
}
function ExtendsFromMappedResult(Left, Right, True, False, options) {
  return MappedResult(FromMappedResult$6(Left, Right, True, False, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/extends/extends.mjs
function ExtendsResolve(left, right, trueType, falseType) {
  const R = ExtendsCheck(left, right);
  return R === ExtendsResult.Union
    ? Union$1([trueType, falseType])
    : R === ExtendsResult.True
      ? trueType
      : falseType;
}
/** `[Json]` Creates a Conditional type */
function Extends(L, R, T, F, options) {
  return IsMappedResult$1(L)
    ? ExtendsFromMappedResult(L, R, T, F, options)
    : IsMappedKey$1(L)
      ? CreateType(ExtendsFromMappedKey(L, R, T, F, options))
      : CreateType(ExtendsResolve(L, R, T, F), options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/extends/extends-from-mapped-key.mjs
function FromPropertyKey$2(K, U, L, R, options) {
  return { [K]: Extends(Literal(K), U, L, R, Clone$1(options)) };
}
function FromPropertyKeys$2(K, U, L, R, options) {
  return K.reduce((Acc, LK) => {
    return {
      ...Acc,
      ...FromPropertyKey$2(LK, U, L, R, options),
    };
  }, {});
}
function FromMappedKey$2(K, U, L, R, options) {
  return FromPropertyKeys$2(K.keys, U, L, R, options);
}
function ExtendsFromMappedKey(T, U, L, R, options) {
  return MappedResult(FromMappedKey$2(T, U, L, R, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/extends/extends-undefined.mjs
/** Fast undefined check used for properties of type undefined */
function Intersect(schema) {
  return schema.allOf.every((schema) => ExtendsUndefinedCheck(schema));
}
function Union(schema) {
  return schema.anyOf.some((schema) => ExtendsUndefinedCheck(schema));
}
function Not$1(schema) {
  return !ExtendsUndefinedCheck(schema.not);
}
/** Fast undefined check used for properties of type undefined */
function ExtendsUndefinedCheck(schema) {
  return schema[Kind] === 'Intersect'
    ? Intersect(schema)
    : schema[Kind] === 'Union'
      ? Union(schema)
      : schema[Kind] === 'Not'
        ? Not$1(schema)
        : schema[Kind] === 'Undefined'
          ? true
          : false;
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/exclude/exclude-from-template-literal.mjs
function ExcludeFromTemplateLiteral(L, R) {
  return Exclude(TemplateLiteralToUnion(L), R);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/exclude/exclude.mjs
function ExcludeRest(L, R) {
  const excluded = L.filter((inner) => ExtendsCheck(inner, R) === ExtendsResult.False);
  return excluded.length === 1 ? excluded[0] : Union$1(excluded);
}
/** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
function Exclude(L, R, options = {}) {
  if (IsTemplateLiteral$1(L)) return CreateType(ExcludeFromTemplateLiteral(L, R), options);
  if (IsMappedResult$1(L)) return CreateType(ExcludeFromMappedResult(L, R), options);
  return CreateType(
    IsUnion$1(L)
      ? ExcludeRest(L.anyOf, R)
      : ExtendsCheck(L, R) !== ExtendsResult.False
        ? Never()
        : L,
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/exclude/exclude-from-mapped-result.mjs
function FromProperties$10(P, U) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(P)) Acc[K2] = Exclude(P[K2], U);
  return Acc;
}
function FromMappedResult$5(R, T) {
  return FromProperties$10(R.properties, T);
}
function ExcludeFromMappedResult(R, T) {
  return MappedResult(FromMappedResult$5(R, T));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/extract/extract-from-template-literal.mjs
function ExtractFromTemplateLiteral(L, R) {
  return Extract(TemplateLiteralToUnion(L), R);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/extract/extract.mjs
function ExtractRest(L, R) {
  const extracted = L.filter((inner) => ExtendsCheck(inner, R) !== ExtendsResult.False);
  return extracted.length === 1 ? extracted[0] : Union$1(extracted);
}
/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
function Extract(L, R, options) {
  if (IsTemplateLiteral$1(L)) return CreateType(ExtractFromTemplateLiteral(L, R), options);
  if (IsMappedResult$1(L)) return CreateType(ExtractFromMappedResult(L, R), options);
  return CreateType(
    IsUnion$1(L)
      ? ExtractRest(L.anyOf, R)
      : ExtendsCheck(L, R) !== ExtendsResult.False
        ? L
        : Never(),
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/extract/extract-from-mapped-result.mjs
function FromProperties$9(P, T) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(P)) Acc[K2] = Extract(P[K2], T);
  return Acc;
}
function FromMappedResult$4(R, T) {
  return FromProperties$9(R.properties, T);
}
function ExtractFromMappedResult(R, T) {
  return MappedResult(FromMappedResult$4(R, T));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/instance-type/instance-type.mjs
/** `[JavaScript]` Extracts the InstanceType from the given Constructor type */
function InstanceType(schema, options) {
  return IsConstructor$1(schema) ? CreateType(schema.returns, options) : Never(options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/readonly-optional/readonly-optional.mjs
/** `[Json]` Creates a Readonly and Optional property */
function ReadonlyOptional(schema) {
  return Readonly(Optional(schema));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/record/record.mjs
function RecordCreateFromPattern(pattern, T, options) {
  return CreateType(
    {
      [Kind]: 'Record',
      type: 'object',
      patternProperties: { [pattern]: T },
    },
    options,
  );
}
function RecordCreateFromKeys(K, T, options) {
  const result = {};
  for (const K2 of K) result[K2] = T;
  return Object$1(result, {
    ...options,
    [Hint]: 'Record',
  });
}
function FromTemplateLiteralKey(K, T, options) {
  return IsTemplateLiteralFinite(K)
    ? RecordCreateFromKeys(IndexPropertyKeys(K), T, options)
    : RecordCreateFromPattern(K.pattern, T, options);
}
function FromUnionKey(key, type, options) {
  return RecordCreateFromKeys(IndexPropertyKeys(Union$1(key)), type, options);
}
function FromLiteralKey(key, type, options) {
  return RecordCreateFromKeys([key.toString()], type, options);
}
function FromRegExpKey(key, type, options) {
  return RecordCreateFromPattern(key.source, type, options);
}
function FromStringKey(key, type, options) {
  return RecordCreateFromPattern(
    IsUndefined$3(key.pattern) ? PatternStringExact : key.pattern,
    type,
    options,
  );
}
function FromAnyKey(_, type, options) {
  return RecordCreateFromPattern(PatternStringExact, type, options);
}
function FromNeverKey(_key, type, options) {
  return RecordCreateFromPattern(PatternNeverExact, type, options);
}
function FromBooleanKey(_key, type, options) {
  return Object$1(
    {
      true: type,
      false: type,
    },
    options,
  );
}
function FromIntegerKey(_key, type, options) {
  return RecordCreateFromPattern(PatternNumberExact, type, options);
}
function FromNumberKey(_, type, options) {
  return RecordCreateFromPattern(PatternNumberExact, type, options);
}
/** `[Json]` Creates a Record type */
function Record(key, type, options = {}) {
  return IsUnion$1(key)
    ? FromUnionKey(key.anyOf, type, options)
    : IsTemplateLiteral$1(key)
      ? FromTemplateLiteralKey(key, type, options)
      : IsLiteral$1(key)
        ? FromLiteralKey(key.const, type, options)
        : IsBoolean$1(key)
          ? FromBooleanKey(key, type, options)
          : IsInteger$1(key)
            ? FromIntegerKey(key, type, options)
            : IsNumber$1(key)
              ? FromNumberKey(key, type, options)
              : IsRegExp$1(key)
                ? FromRegExpKey(key, type, options)
                : IsString$1(key)
                  ? FromStringKey(key, type, options)
                  : IsAny$1(key)
                    ? FromAnyKey(key, type, options)
                    : IsNever$1(key)
                      ? FromNeverKey(key, type, options)
                      : Never(options);
}
/** Gets the Records Pattern */
function RecordPattern(record) {
  return globalThis.Object.getOwnPropertyNames(record.patternProperties)[0];
}
/** Gets the Records Key Type */
function RecordKey(type) {
  const pattern = RecordPattern(type);
  return pattern === PatternStringExact
    ? String()
    : pattern === PatternNumberExact
      ? Number$1()
      : String({ pattern });
}
/** Gets a Record Value Type */
function RecordValue(type) {
  return type.patternProperties[RecordPattern(type)];
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/instantiate/instantiate.mjs
function FromConstructor$5(args, type) {
  type.parameters = FromTypes$1(args, type.parameters);
  type.returns = FromType$1(args, type.returns);
  return type;
}
function FromFunction$5(args, type) {
  type.parameters = FromTypes$1(args, type.parameters);
  type.returns = FromType$1(args, type.returns);
  return type;
}
function FromIntersect$11(args, type) {
  type.allOf = FromTypes$1(args, type.allOf);
  return type;
}
function FromUnion$11(args, type) {
  type.anyOf = FromTypes$1(args, type.anyOf);
  return type;
}
function FromTuple$9(args, type) {
  if (IsUndefined$3(type.items)) return type;
  type.items = FromTypes$1(args, type.items);
  return type;
}
function FromArray$10(args, type) {
  type.items = FromType$1(args, type.items);
  return type;
}
function FromAsyncIterator$5(args, type) {
  type.items = FromType$1(args, type.items);
  return type;
}
function FromIterator$5(args, type) {
  type.items = FromType$1(args, type.items);
  return type;
}
function FromPromise$4(args, type) {
  type.item = FromType$1(args, type.item);
  return type;
}
function FromObject$14(args, type) {
  const mappedProperties = FromProperties$8(args, type.properties);
  return {
    ...type,
    ...Object$1(mappedProperties),
  };
}
function FromRecord$9(args, type) {
  const result = Record(FromType$1(args, RecordKey(type)), FromType$1(args, RecordValue(type)));
  return {
    ...type,
    ...result,
  };
}
function FromArgument$3(args, argument) {
  return argument.index in args ? args[argument.index] : Unknown();
}
function FromProperty$1(args, type) {
  const isReadonly = IsReadonly(type);
  const isOptional = IsOptional$1(type);
  const mapped = FromType$1(args, type);
  return isReadonly && isOptional
    ? ReadonlyOptional(mapped)
    : isReadonly && !isOptional
      ? Readonly(mapped)
      : !isReadonly && isOptional
        ? Optional(mapped)
        : mapped;
}
function FromProperties$8(args, properties) {
  return globalThis.Object.getOwnPropertyNames(properties).reduce((result, key) => {
    return {
      ...result,
      [key]: FromProperty$1(args, properties[key]),
    };
  }, {});
}
function FromTypes$1(args, types) {
  return types.map((type) => FromType$1(args, type));
}
function FromType$1(args, type) {
  return IsConstructor$1(type)
    ? FromConstructor$5(args, type)
    : IsFunction$1(type)
      ? FromFunction$5(args, type)
      : IsIntersect$1(type)
        ? FromIntersect$11(args, type)
        : IsUnion$1(type)
          ? FromUnion$11(args, type)
          : IsTuple$1(type)
            ? FromTuple$9(args, type)
            : IsArray$1(type)
              ? FromArray$10(args, type)
              : IsAsyncIterator$1(type)
                ? FromAsyncIterator$5(args, type)
                : IsIterator$1(type)
                  ? FromIterator$5(args, type)
                  : IsPromise$1(type)
                    ? FromPromise$4(args, type)
                    : IsObject$1(type)
                      ? FromObject$14(args, type)
                      : IsRecord$1(type)
                        ? FromRecord$9(args, type)
                        : IsArgument$1(type)
                          ? FromArgument$3(args, type)
                          : type;
}
/** `[JavaScript]` Instantiates a type with the given parameters */
function Instantiate(type, args) {
  return FromType$1(args, CloneType(type));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/integer/integer.mjs
/** `[Json]` Creates an Integer type */
function Integer(options) {
  return CreateType(
    {
      [Kind]: 'Integer',
      type: 'integer',
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/intrinsic/intrinsic-from-mapped-key.mjs
function MappedIntrinsicPropertyKey(K, M, options) {
  return { [K]: Intrinsic(Literal(K), M, Clone$1(options)) };
}
function MappedIntrinsicPropertyKeys(K, M, options) {
  return K.reduce((Acc, L) => {
    return {
      ...Acc,
      ...MappedIntrinsicPropertyKey(L, M, options),
    };
  }, {});
}
function MappedIntrinsicProperties(T, M, options) {
  return MappedIntrinsicPropertyKeys(T['keys'], M, options);
}
function IntrinsicFromMappedKey(T, M, options) {
  return MappedResult(MappedIntrinsicProperties(T, M, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/intrinsic/intrinsic.mjs
function ApplyUncapitalize(value) {
  const [first, rest] = [value.slice(0, 1), value.slice(1)];
  return [first.toLowerCase(), rest].join('');
}
function ApplyCapitalize(value) {
  const [first, rest] = [value.slice(0, 1), value.slice(1)];
  return [first.toUpperCase(), rest].join('');
}
function ApplyUppercase(value) {
  return value.toUpperCase();
}
function ApplyLowercase(value) {
  return value.toLowerCase();
}
function FromTemplateLiteral$3(schema, mode, options) {
  const expression = TemplateLiteralParseExact(schema.pattern);
  if (!IsTemplateLiteralExpressionFinite(expression))
    return {
      ...schema,
      pattern: FromLiteralValue(schema.pattern, mode),
    };
  return TemplateLiteral(
    [
      Union$1(
        FromRest$2(
          [...TemplateLiteralExpressionGenerate(expression)].map((value) => Literal(value)),
          mode,
        ),
      ),
    ],
    options,
  );
}
function FromLiteralValue(value, mode) {
  return typeof value === 'string'
    ? mode === 'Uncapitalize'
      ? ApplyUncapitalize(value)
      : mode === 'Capitalize'
        ? ApplyCapitalize(value)
        : mode === 'Uppercase'
          ? ApplyUppercase(value)
          : mode === 'Lowercase'
            ? ApplyLowercase(value)
            : value
    : value.toString();
}
function FromRest$2(T, M) {
  return T.map((L) => Intrinsic(L, M));
}
/** Applies an intrinsic string manipulation to the given type. */
function Intrinsic(schema, mode, options = {}) {
  return IsMappedKey$1(schema)
    ? IntrinsicFromMappedKey(schema, mode, options)
    : IsTemplateLiteral$1(schema)
      ? FromTemplateLiteral$3(schema, mode, options)
      : IsUnion$1(schema)
        ? Union$1(FromRest$2(schema.anyOf, mode), options)
        : IsLiteral$1(schema)
          ? Literal(FromLiteralValue(schema.const, mode), options)
          : CreateType(schema, options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/intrinsic/capitalize.mjs
/** `[Json]` Intrinsic function to Capitalize LiteralString types */
function Capitalize(T, options = {}) {
  return Intrinsic(T, 'Capitalize', options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/intrinsic/lowercase.mjs
/** `[Json]` Intrinsic function to Lowercase LiteralString types */
function Lowercase(T, options = {}) {
  return Intrinsic(T, 'Lowercase', options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/intrinsic/uncapitalize.mjs
/** `[Json]` Intrinsic function to Uncapitalize LiteralString types */
function Uncapitalize(T, options = {}) {
  return Intrinsic(T, 'Uncapitalize', options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/intrinsic/uppercase.mjs
/** `[Json]` Intrinsic function to Uppercase LiteralString types */
function Uppercase(T, options = {}) {
  return Intrinsic(T, 'Uppercase', options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/omit/omit-from-mapped-result.mjs
function FromProperties$7(properties, propertyKeys, options) {
  const result = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(properties))
    result[K2] = Omit(properties[K2], propertyKeys, Clone$1(options));
  return result;
}
function FromMappedResult$3(mappedResult, propertyKeys, options) {
  return FromProperties$7(mappedResult.properties, propertyKeys, options);
}
function OmitFromMappedResult(mappedResult, propertyKeys, options) {
  return MappedResult(FromMappedResult$3(mappedResult, propertyKeys, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/omit/omit.mjs
function FromIntersect$10(types, propertyKeys) {
  return types.map((type) => OmitResolve(type, propertyKeys));
}
function FromUnion$10(types, propertyKeys) {
  return types.map((type) => OmitResolve(type, propertyKeys));
}
function FromProperty(properties, key) {
  const { [key]: _, ...R } = properties;
  return R;
}
function FromProperties$6(properties, propertyKeys) {
  return propertyKeys.reduce((T, K2) => FromProperty(T, K2), properties);
}
function FromObject$13(type, propertyKeys, properties) {
  const options = Discard(type, [TransformKind, '$id', 'required', 'properties']);
  return Object$1(FromProperties$6(properties, propertyKeys), options);
}
function UnionFromPropertyKeys$1(propertyKeys) {
  return Union$1(
    propertyKeys.reduce(
      (result, key) => (IsLiteralValue$1(key) ? [...result, Literal(key)] : result),
      [],
    ),
  );
}
function OmitResolve(type, propertyKeys) {
  return IsIntersect$1(type)
    ? Intersect$1(FromIntersect$10(type.allOf, propertyKeys))
    : IsUnion$1(type)
      ? Union$1(FromUnion$10(type.anyOf, propertyKeys))
      : IsObject$1(type)
        ? FromObject$13(type, propertyKeys, type.properties)
        : Object$1({});
}
/** `[Json]` Constructs a type whose keys are picked from the given type */
function Omit(type, key, options) {
  const typeKey = IsArray$3(key) ? UnionFromPropertyKeys$1(key) : key;
  const propertyKeys = IsSchema$1(key) ? IndexPropertyKeys(key) : key;
  const isTypeRef = IsRef$1(type);
  const isKeyRef = IsRef$1(key);
  return IsMappedResult$1(type)
    ? OmitFromMappedResult(type, propertyKeys, options)
    : IsMappedKey$1(key)
      ? OmitFromMappedKey(type, key, options)
      : isTypeRef && isKeyRef
        ? Computed('Omit', [type, typeKey], options)
        : !isTypeRef && isKeyRef
          ? Computed('Omit', [type, typeKey], options)
          : isTypeRef && !isKeyRef
            ? Computed('Omit', [type, typeKey], options)
            : CreateType({
                ...OmitResolve(type, propertyKeys),
                ...options,
              });
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/omit/omit-from-mapped-key.mjs
function FromPropertyKey$1(type, key, options) {
  return { [key]: Omit(type, [key], Clone$1(options)) };
}
function FromPropertyKeys$1(type, propertyKeys, options) {
  return propertyKeys.reduce((Acc, LK) => {
    return {
      ...Acc,
      ...FromPropertyKey$1(type, LK, options),
    };
  }, {});
}
function FromMappedKey$1(type, mappedKey, options) {
  return FromPropertyKeys$1(type, mappedKey.keys, options);
}
function OmitFromMappedKey(type, mappedKey, options) {
  return MappedResult(FromMappedKey$1(type, mappedKey, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/pick/pick-from-mapped-result.mjs
function FromProperties$5(properties, propertyKeys, options) {
  const result = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(properties))
    result[K2] = Pick(properties[K2], propertyKeys, Clone$1(options));
  return result;
}
function FromMappedResult$2(mappedResult, propertyKeys, options) {
  return FromProperties$5(mappedResult.properties, propertyKeys, options);
}
function PickFromMappedResult(mappedResult, propertyKeys, options) {
  return MappedResult(FromMappedResult$2(mappedResult, propertyKeys, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/pick/pick.mjs
function FromIntersect$9(types, propertyKeys) {
  return types.map((type) => PickResolve(type, propertyKeys));
}
function FromUnion$9(types, propertyKeys) {
  return types.map((type) => PickResolve(type, propertyKeys));
}
function FromProperties$4(properties, propertyKeys) {
  const result = {};
  for (const K2 of propertyKeys) if (K2 in properties) result[K2] = properties[K2];
  return result;
}
function FromObject$12(Type, keys, properties) {
  const options = Discard(Type, [TransformKind, '$id', 'required', 'properties']);
  return Object$1(FromProperties$4(properties, keys), options);
}
function UnionFromPropertyKeys(propertyKeys) {
  return Union$1(
    propertyKeys.reduce(
      (result, key) => (IsLiteralValue$1(key) ? [...result, Literal(key)] : result),
      [],
    ),
  );
}
function PickResolve(type, propertyKeys) {
  return IsIntersect$1(type)
    ? Intersect$1(FromIntersect$9(type.allOf, propertyKeys))
    : IsUnion$1(type)
      ? Union$1(FromUnion$9(type.anyOf, propertyKeys))
      : IsObject$1(type)
        ? FromObject$12(type, propertyKeys, type.properties)
        : Object$1({});
}
/** `[Json]` Constructs a type whose keys are picked from the given type */
function Pick(type, key, options) {
  const typeKey = IsArray$3(key) ? UnionFromPropertyKeys(key) : key;
  const propertyKeys = IsSchema$1(key) ? IndexPropertyKeys(key) : key;
  const isTypeRef = IsRef$1(type);
  const isKeyRef = IsRef$1(key);
  return IsMappedResult$1(type)
    ? PickFromMappedResult(type, propertyKeys, options)
    : IsMappedKey$1(key)
      ? PickFromMappedKey(type, key, options)
      : isTypeRef && isKeyRef
        ? Computed('Pick', [type, typeKey], options)
        : !isTypeRef && isKeyRef
          ? Computed('Pick', [type, typeKey], options)
          : isTypeRef && !isKeyRef
            ? Computed('Pick', [type, typeKey], options)
            : CreateType({
                ...PickResolve(type, propertyKeys),
                ...options,
              });
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/pick/pick-from-mapped-key.mjs
function FromPropertyKey(type, key, options) {
  return { [key]: Pick(type, [key], Clone$1(options)) };
}
function FromPropertyKeys(type, propertyKeys, options) {
  return propertyKeys.reduce((result, leftKey) => {
    return {
      ...result,
      ...FromPropertyKey(type, leftKey, options),
    };
  }, {});
}
function FromMappedKey(type, mappedKey, options) {
  return FromPropertyKeys(type, mappedKey.keys, options);
}
function PickFromMappedKey(type, mappedKey, options) {
  return MappedResult(FromMappedKey(type, mappedKey, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/partial/partial.mjs
function FromComputed$2(target, parameters) {
  return Computed('Partial', [Computed(target, parameters)]);
}
function FromRef$9($ref) {
  return Computed('Partial', [Ref($ref)]);
}
function FromProperties$3(properties) {
  const partialProperties = {};
  for (const K of globalThis.Object.getOwnPropertyNames(properties))
    partialProperties[K] = Optional(properties[K]);
  return partialProperties;
}
function FromObject$11(type, properties) {
  const options = Discard(type, [TransformKind, '$id', 'required', 'properties']);
  return Object$1(FromProperties$3(properties), options);
}
function FromRest$1(types) {
  return types.map((type) => PartialResolve(type));
}
function PartialResolve(type) {
  return IsComputed$1(type)
    ? FromComputed$2(type.target, type.parameters)
    : IsRef$1(type)
      ? FromRef$9(type.$ref)
      : IsIntersect$1(type)
        ? Intersect$1(FromRest$1(type.allOf))
        : IsUnion$1(type)
          ? Union$1(FromRest$1(type.anyOf))
          : IsObject$1(type)
            ? FromObject$11(type, type.properties)
            : IsBigInt$1(type)
              ? type
              : IsBoolean$1(type)
                ? type
                : IsInteger$1(type)
                  ? type
                  : IsLiteral$1(type)
                    ? type
                    : IsNull$1(type)
                      ? type
                      : IsNumber$1(type)
                        ? type
                        : IsString$1(type)
                          ? type
                          : IsSymbol$1(type)
                            ? type
                            : IsUndefined$1(type)
                              ? type
                              : Object$1({});
}
/** `[Json]` Constructs a type where all properties are optional */
function Partial(type, options) {
  if (IsMappedResult$1(type)) return PartialFromMappedResult(type, options);
  else
    return CreateType({
      ...PartialResolve(type),
      ...options,
    });
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/partial/partial-from-mapped-result.mjs
function FromProperties$2(K, options) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(K))
    Acc[K2] = Partial(K[K2], Clone$1(options));
  return Acc;
}
function FromMappedResult$1(R, options) {
  return FromProperties$2(R.properties, options);
}
function PartialFromMappedResult(R, options) {
  return MappedResult(FromMappedResult$1(R, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/required/required.mjs
function FromComputed$1(target, parameters) {
  return Computed('Required', [Computed(target, parameters)]);
}
function FromRef$8($ref) {
  return Computed('Required', [Ref($ref)]);
}
function FromProperties$1(properties) {
  const requiredProperties = {};
  for (const K of globalThis.Object.getOwnPropertyNames(properties))
    requiredProperties[K] = Discard(properties[K], [OptionalKind]);
  return requiredProperties;
}
function FromObject$10(type, properties) {
  const options = Discard(type, [TransformKind, '$id', 'required', 'properties']);
  return Object$1(FromProperties$1(properties), options);
}
function FromRest(types) {
  return types.map((type) => RequiredResolve(type));
}
function RequiredResolve(type) {
  return IsComputed$1(type)
    ? FromComputed$1(type.target, type.parameters)
    : IsRef$1(type)
      ? FromRef$8(type.$ref)
      : IsIntersect$1(type)
        ? Intersect$1(FromRest(type.allOf))
        : IsUnion$1(type)
          ? Union$1(FromRest(type.anyOf))
          : IsObject$1(type)
            ? FromObject$10(type, type.properties)
            : IsBigInt$1(type)
              ? type
              : IsBoolean$1(type)
                ? type
                : IsInteger$1(type)
                  ? type
                  : IsLiteral$1(type)
                    ? type
                    : IsNull$1(type)
                      ? type
                      : IsNumber$1(type)
                        ? type
                        : IsString$1(type)
                          ? type
                          : IsSymbol$1(type)
                            ? type
                            : IsUndefined$1(type)
                              ? type
                              : Object$1({});
}
/** `[Json]` Constructs a type where all properties are required */
function Required(type, options) {
  if (IsMappedResult$1(type)) return RequiredFromMappedResult(type, options);
  else
    return CreateType({
      ...RequiredResolve(type),
      ...options,
    });
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/required/required-from-mapped-result.mjs
function FromProperties(P, options) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(P)) Acc[K2] = Required(P[K2], options);
  return Acc;
}
function FromMappedResult(R, options) {
  return FromProperties(R.properties, options);
}
function RequiredFromMappedResult(R, options) {
  return MappedResult(FromMappedResult(R, options));
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/module/compute.mjs
function DereferenceParameters(moduleProperties, types) {
  return types.map((type) => {
    return IsRef$1(type)
      ? Dereference(moduleProperties, type.$ref)
      : FromType(moduleProperties, type);
  });
}
function Dereference(moduleProperties, ref) {
  return ref in moduleProperties
    ? IsRef$1(moduleProperties[ref])
      ? Dereference(moduleProperties, moduleProperties[ref].$ref)
      : FromType(moduleProperties, moduleProperties[ref])
    : Never();
}
function FromAwaited(parameters) {
  return Awaited(parameters[0]);
}
function FromIndex(parameters) {
  return Index(parameters[0], parameters[1]);
}
function FromKeyOf(parameters) {
  return KeyOf(parameters[0]);
}
function FromPartial(parameters) {
  return Partial(parameters[0]);
}
function FromOmit(parameters) {
  return Omit(parameters[0], parameters[1]);
}
function FromPick(parameters) {
  return Pick(parameters[0], parameters[1]);
}
function FromRequired(parameters) {
  return Required(parameters[0]);
}
function FromComputed(moduleProperties, target, parameters) {
  const dereferenced = DereferenceParameters(moduleProperties, parameters);
  return target === 'Awaited'
    ? FromAwaited(dereferenced)
    : target === 'Index'
      ? FromIndex(dereferenced)
      : target === 'KeyOf'
        ? FromKeyOf(dereferenced)
        : target === 'Partial'
          ? FromPartial(dereferenced)
          : target === 'Omit'
            ? FromOmit(dereferenced)
            : target === 'Pick'
              ? FromPick(dereferenced)
              : target === 'Required'
                ? FromRequired(dereferenced)
                : Never();
}
function FromArray$9(moduleProperties, type) {
  return Array$1(FromType(moduleProperties, type));
}
function FromAsyncIterator$4(moduleProperties, type) {
  return AsyncIterator(FromType(moduleProperties, type));
}
function FromConstructor$4(moduleProperties, parameters, instanceType) {
  return Constructor(
    FromTypes(moduleProperties, parameters),
    FromType(moduleProperties, instanceType),
  );
}
function FromFunction$4(moduleProperties, parameters, returnType) {
  return Function(FromTypes(moduleProperties, parameters), FromType(moduleProperties, returnType));
}
function FromIntersect$8(moduleProperties, types) {
  return Intersect$1(FromTypes(moduleProperties, types));
}
function FromIterator$4(moduleProperties, type) {
  return Iterator(FromType(moduleProperties, type));
}
function FromObject$9(moduleProperties, properties) {
  return Object$1(
    globalThis.Object.keys(properties).reduce((result, key) => {
      return {
        ...result,
        [key]: FromType(moduleProperties, properties[key]),
      };
    }, {}),
  );
}
function FromRecord$8(moduleProperties, type) {
  const [value, pattern] = [FromType(moduleProperties, RecordValue(type)), RecordPattern(type)];
  const result = CloneType(type);
  result.patternProperties[pattern] = value;
  return result;
}
function FromTransform(moduleProperties, transform) {
  return IsRef$1(transform)
    ? {
        ...Dereference(moduleProperties, transform.$ref),
        [TransformKind]: transform[TransformKind],
      }
    : transform;
}
function FromTuple$8(moduleProperties, types) {
  return Tuple(FromTypes(moduleProperties, types));
}
function FromUnion$8(moduleProperties, types) {
  return Union$1(FromTypes(moduleProperties, types));
}
function FromTypes(moduleProperties, types) {
  return types.map((type) => FromType(moduleProperties, type));
}
function FromType(moduleProperties, type) {
  return IsOptional$1(type)
    ? CreateType(FromType(moduleProperties, Discard(type, [OptionalKind])), type)
    : IsReadonly(type)
      ? CreateType(FromType(moduleProperties, Discard(type, [ReadonlyKind])), type)
      : IsTransform$1(type)
        ? CreateType(FromTransform(moduleProperties, type), type)
        : IsArray$1(type)
          ? CreateType(FromArray$9(moduleProperties, type.items), type)
          : IsAsyncIterator$1(type)
            ? CreateType(FromAsyncIterator$4(moduleProperties, type.items), type)
            : IsComputed$1(type)
              ? CreateType(FromComputed(moduleProperties, type.target, type.parameters))
              : IsConstructor$1(type)
                ? CreateType(
                    FromConstructor$4(moduleProperties, type.parameters, type.returns),
                    type,
                  )
                : IsFunction$1(type)
                  ? CreateType(
                      FromFunction$4(moduleProperties, type.parameters, type.returns),
                      type,
                    )
                  : IsIntersect$1(type)
                    ? CreateType(FromIntersect$8(moduleProperties, type.allOf), type)
                    : IsIterator$1(type)
                      ? CreateType(FromIterator$4(moduleProperties, type.items), type)
                      : IsObject$1(type)
                        ? CreateType(FromObject$9(moduleProperties, type.properties), type)
                        : IsRecord$1(type)
                          ? CreateType(FromRecord$8(moduleProperties, type))
                          : IsTuple$1(type)
                            ? CreateType(FromTuple$8(moduleProperties, type.items || []), type)
                            : IsUnion$1(type)
                              ? CreateType(FromUnion$8(moduleProperties, type.anyOf), type)
                              : type;
}
function ComputeType(moduleProperties, key) {
  return key in moduleProperties ? FromType(moduleProperties, moduleProperties[key]) : Never();
}
function ComputeModuleProperties(moduleProperties) {
  return globalThis.Object.getOwnPropertyNames(moduleProperties).reduce((result, key) => {
    return {
      ...result,
      [key]: ComputeType(moduleProperties, key),
    };
  }, {});
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/module/module.mjs
var TModule = class {
  constructor($defs) {
    const computed = ComputeModuleProperties($defs);
    this.$defs = this.WithIdentifiers(computed);
  }
  /** `[Json]` Imports a Type by Key. */
  Import(key, options) {
    const $defs = {
      ...this.$defs,
      [key]: CreateType(this.$defs[key], options),
    };
    return CreateType({
      [Kind]: 'Import',
      $defs,
      $ref: key,
    });
  }
  WithIdentifiers($defs) {
    return globalThis.Object.getOwnPropertyNames($defs).reduce((result, key) => {
      return {
        ...result,
        [key]: {
          ...$defs[key],
          $id: key,
        },
      };
    }, {});
  }
};
/** `[Json]` Creates a Type Definition Module. */
function Module(properties) {
  return new TModule(properties);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/not/not.mjs
/** `[Json]` Creates a Not type */
function Not(type, options) {
  return CreateType(
    {
      [Kind]: 'Not',
      not: type,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/parameters/parameters.mjs
/** `[JavaScript]` Extracts the Parameters from the given Function type */
function Parameters(schema, options) {
  return IsFunction$1(schema) ? Tuple(schema.parameters, options) : Never();
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/recursive/recursive.mjs
var Ordinal = 0;
/** `[Json]` Creates a Recursive type */
function Recursive(callback, options = {}) {
  if (IsUndefined$3(options.$id)) options.$id = `T${Ordinal++}`;
  const thisType = CloneType(
    callback({
      [Kind]: 'This',
      $ref: `${options.$id}`,
    }),
  );
  thisType.$id = options.$id;
  return CreateType(
    {
      [Hint]: 'Recursive',
      ...thisType,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/regexp/regexp.mjs
/** `[JavaScript]` Creates a RegExp type */
function RegExp$1(unresolved, options) {
  const expr = IsString$3(unresolved) ? new globalThis.RegExp(unresolved) : unresolved;
  return CreateType(
    {
      [Kind]: 'RegExp',
      type: 'RegExp',
      source: expr.source,
      flags: expr.flags,
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/rest/rest.mjs
function RestResolve(T) {
  return IsIntersect$1(T) ? T.allOf : IsUnion$1(T) ? T.anyOf : IsTuple$1(T) ? (T.items ?? []) : [];
}
/** `[Json]` Extracts interior Rest elements from Tuple, Intersect and Union types */
function Rest(T) {
  return RestResolve(T);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/return-type/return-type.mjs
/** `[JavaScript]` Extracts the ReturnType from the given Function type */
function ReturnType(schema, options) {
  return IsFunction$1(schema) ? CreateType(schema.returns, options) : Never(options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/transform/transform.mjs
var TransformDecodeBuilder = class {
  constructor(schema) {
    this.schema = schema;
  }
  Decode(decode) {
    return new TransformEncodeBuilder(this.schema, decode);
  }
};
var TransformEncodeBuilder = class {
  constructor(schema, decode) {
    this.schema = schema;
    this.decode = decode;
  }
  EncodeTransform(encode, schema) {
    const Encode = (value) => schema[TransformKind].Encode(encode(value));
    const Decode = (value) => this.decode(schema[TransformKind].Decode(value));
    const Codec = {
      Encode,
      Decode,
    };
    return {
      ...schema,
      [TransformKind]: Codec,
    };
  }
  EncodeSchema(encode, schema) {
    const Codec = {
      Decode: this.decode,
      Encode: encode,
    };
    return {
      ...schema,
      [TransformKind]: Codec,
    };
  }
  Encode(encode) {
    return IsTransform$1(this.schema)
      ? this.EncodeTransform(encode, this.schema)
      : this.EncodeSchema(encode, this.schema);
  }
};
/** `[Json]` Creates a Transform type */
function Transform(schema) {
  return new TransformDecodeBuilder(schema);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/unsafe/unsafe.mjs
/** `[Json]` Creates a Unsafe type that will infers as the generic argument T */
function Unsafe(options = {}) {
  return CreateType({ [Kind]: options[Kind] ?? 'Unsafe' }, options);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/void/void.mjs
/** `[JavaScript]` Creates a Void type */
function Void(options) {
  return CreateType(
    {
      [Kind]: 'Void',
      type: 'void',
    },
    options,
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/type/type/index.mjs
/** JavaScript Type Builder with Static Resolution for TypeScript */
var Type = /* @__PURE__ */ __exportAll({
  Any: () => Any,
  Argument: () => Argument,
  Array: () => Array$1,
  AsyncIterator: () => AsyncIterator,
  Awaited: () => Awaited,
  BigInt: () => BigInt$1,
  Boolean: () => Boolean,
  Capitalize: () => Capitalize,
  Composite: () => Composite,
  Const: () => Const,
  Constructor: () => Constructor,
  ConstructorParameters: () => ConstructorParameters,
  Date: () => Date$1,
  Enum: () => Enum,
  Exclude: () => Exclude,
  Extends: () => Extends,
  Extract: () => Extract,
  Function: () => Function,
  Index: () => Index,
  InstanceType: () => InstanceType,
  Instantiate: () => Instantiate,
  Integer: () => Integer,
  Intersect: () => Intersect$1,
  Iterator: () => Iterator,
  KeyOf: () => KeyOf,
  Literal: () => Literal,
  Lowercase: () => Lowercase,
  Mapped: () => Mapped,
  Module: () => Module,
  Never: () => Never,
  Not: () => Not,
  Null: () => Null,
  Number: () => Number$1,
  Object: () => Object$1,
  Omit: () => Omit,
  Optional: () => Optional,
  Parameters: () => Parameters,
  Partial: () => Partial,
  Pick: () => Pick,
  Promise: () => Promise$1,
  Readonly: () => Readonly,
  ReadonlyOptional: () => ReadonlyOptional,
  Record: () => Record,
  Recursive: () => Recursive,
  Ref: () => Ref,
  RegExp: () => RegExp$1,
  Required: () => Required,
  Rest: () => Rest,
  ReturnType: () => ReturnType,
  String: () => String,
  Symbol: () => Symbol$1,
  TemplateLiteral: () => TemplateLiteral,
  Transform: () => Transform,
  Tuple: () => Tuple,
  Uint8Array: () => Uint8Array$1,
  Uncapitalize: () => Uncapitalize,
  Undefined: () => Undefined,
  Union: () => Union$1,
  Unknown: () => Unknown,
  Unsafe: () => Unsafe,
  Uppercase: () => Uppercase,
  Void: () => Void,
});
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/errors/function.mjs
/** Creates an error message using en-US as the default locale */
function DefaultErrorFunction(error) {
  switch (error.errorType) {
    case ValueErrorType.ArrayContains:
      return 'Expected array to contain at least one matching value';
    case ValueErrorType.ArrayMaxContains:
      return `Expected array to contain no more than ${error.schema.maxContains} matching values`;
    case ValueErrorType.ArrayMinContains:
      return `Expected array to contain at least ${error.schema.minContains} matching values`;
    case ValueErrorType.ArrayMaxItems:
      return `Expected array length to be less or equal to ${error.schema.maxItems}`;
    case ValueErrorType.ArrayMinItems:
      return `Expected array length to be greater or equal to ${error.schema.minItems}`;
    case ValueErrorType.ArrayUniqueItems:
      return 'Expected array elements to be unique';
    case ValueErrorType.Array:
      return 'Expected array';
    case ValueErrorType.AsyncIterator:
      return 'Expected AsyncIterator';
    case ValueErrorType.BigIntExclusiveMaximum:
      return `Expected bigint to be less than ${error.schema.exclusiveMaximum}`;
    case ValueErrorType.BigIntExclusiveMinimum:
      return `Expected bigint to be greater than ${error.schema.exclusiveMinimum}`;
    case ValueErrorType.BigIntMaximum:
      return `Expected bigint to be less or equal to ${error.schema.maximum}`;
    case ValueErrorType.BigIntMinimum:
      return `Expected bigint to be greater or equal to ${error.schema.minimum}`;
    case ValueErrorType.BigIntMultipleOf:
      return `Expected bigint to be a multiple of ${error.schema.multipleOf}`;
    case ValueErrorType.BigInt:
      return 'Expected bigint';
    case ValueErrorType.Boolean:
      return 'Expected boolean';
    case ValueErrorType.DateExclusiveMinimumTimestamp:
      return `Expected Date timestamp to be greater than ${error.schema.exclusiveMinimumTimestamp}`;
    case ValueErrorType.DateExclusiveMaximumTimestamp:
      return `Expected Date timestamp to be less than ${error.schema.exclusiveMaximumTimestamp}`;
    case ValueErrorType.DateMinimumTimestamp:
      return `Expected Date timestamp to be greater or equal to ${error.schema.minimumTimestamp}`;
    case ValueErrorType.DateMaximumTimestamp:
      return `Expected Date timestamp to be less or equal to ${error.schema.maximumTimestamp}`;
    case ValueErrorType.DateMultipleOfTimestamp:
      return `Expected Date timestamp to be a multiple of ${error.schema.multipleOfTimestamp}`;
    case ValueErrorType.Date:
      return 'Expected Date';
    case ValueErrorType.Function:
      return 'Expected function';
    case ValueErrorType.IntegerExclusiveMaximum:
      return `Expected integer to be less than ${error.schema.exclusiveMaximum}`;
    case ValueErrorType.IntegerExclusiveMinimum:
      return `Expected integer to be greater than ${error.schema.exclusiveMinimum}`;
    case ValueErrorType.IntegerMaximum:
      return `Expected integer to be less or equal to ${error.schema.maximum}`;
    case ValueErrorType.IntegerMinimum:
      return `Expected integer to be greater or equal to ${error.schema.minimum}`;
    case ValueErrorType.IntegerMultipleOf:
      return `Expected integer to be a multiple of ${error.schema.multipleOf}`;
    case ValueErrorType.Integer:
      return 'Expected integer';
    case ValueErrorType.IntersectUnevaluatedProperties:
      return 'Unexpected property';
    case ValueErrorType.Intersect:
      return 'Expected all values to match';
    case ValueErrorType.Iterator:
      return 'Expected Iterator';
    case ValueErrorType.Literal:
      return `Expected ${typeof error.schema.const === 'string' ? `'${error.schema.const}'` : error.schema.const}`;
    case ValueErrorType.Never:
      return 'Never';
    case ValueErrorType.Not:
      return 'Value should not match';
    case ValueErrorType.Null:
      return 'Expected null';
    case ValueErrorType.NumberExclusiveMaximum:
      return `Expected number to be less than ${error.schema.exclusiveMaximum}`;
    case ValueErrorType.NumberExclusiveMinimum:
      return `Expected number to be greater than ${error.schema.exclusiveMinimum}`;
    case ValueErrorType.NumberMaximum:
      return `Expected number to be less or equal to ${error.schema.maximum}`;
    case ValueErrorType.NumberMinimum:
      return `Expected number to be greater or equal to ${error.schema.minimum}`;
    case ValueErrorType.NumberMultipleOf:
      return `Expected number to be a multiple of ${error.schema.multipleOf}`;
    case ValueErrorType.Number:
      return 'Expected number';
    case ValueErrorType.Object:
      return 'Expected object';
    case ValueErrorType.ObjectAdditionalProperties:
      return 'Unexpected property';
    case ValueErrorType.ObjectMaxProperties:
      return `Expected object to have no more than ${error.schema.maxProperties} properties`;
    case ValueErrorType.ObjectMinProperties:
      return `Expected object to have at least ${error.schema.minProperties} properties`;
    case ValueErrorType.ObjectRequiredProperty:
      return 'Expected required property';
    case ValueErrorType.Promise:
      return 'Expected Promise';
    case ValueErrorType.RegExp:
      return 'Expected string to match regular expression';
    case ValueErrorType.StringFormatUnknown:
      return `Unknown format '${error.schema.format}'`;
    case ValueErrorType.StringFormat:
      return `Expected string to match '${error.schema.format}' format`;
    case ValueErrorType.StringMaxLength:
      return `Expected string length less or equal to ${error.schema.maxLength}`;
    case ValueErrorType.StringMinLength:
      return `Expected string length greater or equal to ${error.schema.minLength}`;
    case ValueErrorType.StringPattern:
      return `Expected string to match '${error.schema.pattern}'`;
    case ValueErrorType.String:
      return 'Expected string';
    case ValueErrorType.Symbol:
      return 'Expected symbol';
    case ValueErrorType.TupleLength:
      return `Expected tuple to have ${error.schema.maxItems || 0} elements`;
    case ValueErrorType.Tuple:
      return 'Expected tuple';
    case ValueErrorType.Uint8ArrayMaxByteLength:
      return `Expected byte length less or equal to ${error.schema.maxByteLength}`;
    case ValueErrorType.Uint8ArrayMinByteLength:
      return `Expected byte length greater or equal to ${error.schema.minByteLength}`;
    case ValueErrorType.Uint8Array:
      return 'Expected Uint8Array';
    case ValueErrorType.Undefined:
      return 'Expected undefined';
    case ValueErrorType.Union:
      return 'Expected union value';
    case ValueErrorType.Void:
      return 'Expected void';
    case ValueErrorType.Kind:
      return `Expected kind '${error.schema[Kind]}'`;
    default:
      return 'Unknown error type';
  }
}
/** Manages error message providers */
var errorFunction = DefaultErrorFunction;
/** Gets the error function used to generate error messages */
function GetErrorFunction() {
  return errorFunction;
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/deref/deref.mjs
var TypeDereferenceError = class extends TypeBoxError {
  constructor(schema) {
    super(`Unable to dereference schema with $id '${schema.$ref}'`);
    this.schema = schema;
  }
};
function Resolve(schema, references) {
  const target = references.find((target) => target.$id === schema.$ref);
  if (target === void 0) throw new TypeDereferenceError(schema);
  return Deref(target, references);
}
/** `[Internal]` Pushes a schema onto references if the schema has an $id and does not exist on references */
function Pushref(schema, references) {
  if (!IsString$2(schema.$id) || references.some((target) => target.$id === schema.$id))
    return references;
  references.push(schema);
  return references;
}
/** `[Internal]` Dereferences a schema from the references array or throws if not found */
function Deref(schema, references) {
  return schema[Kind] === 'This' || schema[Kind] === 'Ref' ? Resolve(schema, references) : schema;
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/hash/hash.mjs
var ValueHashError = class extends TypeBoxError {
  constructor(value) {
    super(`Unable to hash value`);
    this.value = value;
  }
};
var ByteMarker;
(function (ByteMarker) {
  ByteMarker[(ByteMarker['Undefined'] = 0)] = 'Undefined';
  ByteMarker[(ByteMarker['Null'] = 1)] = 'Null';
  ByteMarker[(ByteMarker['Boolean'] = 2)] = 'Boolean';
  ByteMarker[(ByteMarker['Number'] = 3)] = 'Number';
  ByteMarker[(ByteMarker['String'] = 4)] = 'String';
  ByteMarker[(ByteMarker['Object'] = 5)] = 'Object';
  ByteMarker[(ByteMarker['Array'] = 6)] = 'Array';
  ByteMarker[(ByteMarker['Date'] = 7)] = 'Date';
  ByteMarker[(ByteMarker['Uint8Array'] = 8)] = 'Uint8Array';
  ByteMarker[(ByteMarker['Symbol'] = 9)] = 'Symbol';
  ByteMarker[(ByteMarker['BigInt'] = 10)] = 'BigInt';
})(ByteMarker || (ByteMarker = {}));
var Accumulator = BigInt('14695981039346656037');
var [Prime, Size] = [BigInt('1099511628211'), BigInt('18446744073709551616')];
var Bytes = Array.from({ length: 256 }).map((_, i) => BigInt(i));
var F64 = new Float64Array(1);
var F64In = new DataView(F64.buffer);
var F64Out = new Uint8Array(F64.buffer);
function* NumberToBytes(value) {
  const byteCount = value === 0 ? 1 : Math.ceil(Math.floor(Math.log2(value) + 1) / 8);
  for (let i = 0; i < byteCount; i++) yield (value >> (8 * (byteCount - 1 - i))) & 255;
}
function ArrayType(value) {
  FNV1A64(ByteMarker.Array);
  for (const item of value) Visit$8(item);
}
function BooleanType(value) {
  FNV1A64(ByteMarker.Boolean);
  FNV1A64(value ? 1 : 0);
}
function BigIntType(value) {
  FNV1A64(ByteMarker.BigInt);
  F64In.setBigInt64(0, value);
  for (const byte of F64Out) FNV1A64(byte);
}
function DateType(value) {
  FNV1A64(ByteMarker.Date);
  Visit$8(value.getTime());
}
function NullType(value) {
  FNV1A64(ByteMarker.Null);
}
function NumberType(value) {
  FNV1A64(ByteMarker.Number);
  F64In.setFloat64(0, value);
  for (const byte of F64Out) FNV1A64(byte);
}
function ObjectType(value) {
  FNV1A64(ByteMarker.Object);
  for (const key of globalThis.Object.getOwnPropertyNames(value).sort()) {
    Visit$8(key);
    Visit$8(value[key]);
  }
}
function StringType(value) {
  FNV1A64(ByteMarker.String);
  for (let i = 0; i < value.length; i++)
    for (const byte of NumberToBytes(value.charCodeAt(i))) FNV1A64(byte);
}
function SymbolType(value) {
  FNV1A64(ByteMarker.Symbol);
  Visit$8(value.description);
}
function Uint8ArrayType(value) {
  FNV1A64(ByteMarker.Uint8Array);
  for (let i = 0; i < value.length; i++) FNV1A64(value[i]);
}
function UndefinedType(value) {
  return FNV1A64(ByteMarker.Undefined);
}
function Visit$8(value) {
  if (IsArray$2(value)) return ArrayType(value);
  if (IsBoolean$2(value)) return BooleanType(value);
  if (IsBigInt$2(value)) return BigIntType(value);
  if (IsDate$2(value)) return DateType(value);
  if (IsNull$2(value)) return NullType(value);
  if (IsNumber$2(value)) return NumberType(value);
  if (IsObject$2(value)) return ObjectType(value);
  if (IsString$2(value)) return StringType(value);
  if (IsSymbol$2(value)) return SymbolType(value);
  if (IsUint8Array$2(value)) return Uint8ArrayType(value);
  if (IsUndefined$2(value)) return UndefinedType(value);
  throw new ValueHashError(value);
}
function FNV1A64(byte) {
  Accumulator = Accumulator ^ Bytes[byte];
  Accumulator = (Accumulator * Prime) % Size;
}
/** Creates a FNV1A-64 non cryptographic hash of the given value */
function Hash(value) {
  Accumulator = BigInt('14695981039346656037');
  Visit$8(value);
  return Accumulator;
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/check/check.mjs
var ValueCheckUnknownTypeError = class extends TypeBoxError {
  constructor(schema) {
    super(`Unknown type`);
    this.schema = schema;
  }
};
function IsAnyOrUnknown(schema) {
  return schema[Kind] === 'Any' || schema[Kind] === 'Unknown';
}
function IsDefined$1(value) {
  return value !== void 0;
}
function FromAny$2(schema, references, value) {
  return true;
}
function FromArgument$2(schema, references, value) {
  return true;
}
function FromArray$8(schema, references, value) {
  if (!IsArray$2(value)) return false;
  if (IsDefined$1(schema.minItems) && !(value.length >= schema.minItems)) return false;
  if (IsDefined$1(schema.maxItems) && !(value.length <= schema.maxItems)) return false;
  for (const element of value) if (!Visit$7(schema.items, references, element)) return false;
  if (
    schema.uniqueItems === true &&
    !(function () {
      const set = /* @__PURE__ */ new Set();
      for (const element of value) {
        const hashed = Hash(element);
        if (set.has(hashed)) return false;
        else set.add(hashed);
      }
      return true;
    })()
  )
    return false;
  if (
    !(
      IsDefined$1(schema.contains) ||
      IsNumber$2(schema.minContains) ||
      IsNumber$2(schema.maxContains)
    )
  )
    return true;
  const containsSchema = IsDefined$1(schema.contains) ? schema.contains : Never();
  const containsCount = value.reduce(
    (acc, value) => (Visit$7(containsSchema, references, value) ? acc + 1 : acc),
    0,
  );
  if (containsCount === 0) return false;
  if (IsNumber$2(schema.minContains) && containsCount < schema.minContains) return false;
  if (IsNumber$2(schema.maxContains) && containsCount > schema.maxContains) return false;
  return true;
}
function FromAsyncIterator$3(schema, references, value) {
  return IsAsyncIterator$2(value);
}
function FromBigInt$2(schema, references, value) {
  if (!IsBigInt$2(value)) return false;
  if (IsDefined$1(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) return false;
  if (IsDefined$1(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) return false;
  if (IsDefined$1(schema.maximum) && !(value <= schema.maximum)) return false;
  if (IsDefined$1(schema.minimum) && !(value >= schema.minimum)) return false;
  if (IsDefined$1(schema.multipleOf) && !(value % schema.multipleOf === BigInt(0))) return false;
  return true;
}
function FromBoolean$2(schema, references, value) {
  return IsBoolean$2(value);
}
function FromConstructor$3(schema, references, value) {
  return Visit$7(schema.returns, references, value.prototype);
}
function FromDate$4(schema, references, value) {
  if (!IsDate$2(value)) return false;
  if (
    IsDefined$1(schema.exclusiveMaximumTimestamp) &&
    !(value.getTime() < schema.exclusiveMaximumTimestamp)
  )
    return false;
  if (
    IsDefined$1(schema.exclusiveMinimumTimestamp) &&
    !(value.getTime() > schema.exclusiveMinimumTimestamp)
  )
    return false;
  if (IsDefined$1(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp))
    return false;
  if (IsDefined$1(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp))
    return false;
  if (
    IsDefined$1(schema.multipleOfTimestamp) &&
    !(value.getTime() % schema.multipleOfTimestamp === 0)
  )
    return false;
  return true;
}
function FromFunction$3(schema, references, value) {
  return IsFunction$2(value);
}
function FromImport$7(schema, references, value) {
  const definitions = globalThis.Object.values(schema.$defs);
  const target = schema.$defs[schema.$ref];
  return Visit$7(target, [...references, ...definitions], value);
}
function FromInteger$2(schema, references, value) {
  if (!IsInteger$2(value)) return false;
  if (IsDefined$1(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) return false;
  if (IsDefined$1(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) return false;
  if (IsDefined$1(schema.maximum) && !(value <= schema.maximum)) return false;
  if (IsDefined$1(schema.minimum) && !(value >= schema.minimum)) return false;
  if (IsDefined$1(schema.multipleOf) && !(value % schema.multipleOf === 0)) return false;
  return true;
}
function FromIntersect$7(schema, references, value) {
  const check1 = schema.allOf.every((schema) => Visit$7(schema, references, value));
  if (schema.unevaluatedProperties === false) {
    const keyPattern = new RegExp(KeyOfPattern(schema));
    const check2 = Object.getOwnPropertyNames(value).every((key) => keyPattern.test(key));
    return check1 && check2;
  } else if (IsSchema$1(schema.unevaluatedProperties)) {
    const keyCheck = new RegExp(KeyOfPattern(schema));
    const check2 = Object.getOwnPropertyNames(value).every(
      (key) => keyCheck.test(key) || Visit$7(schema.unevaluatedProperties, references, value[key]),
    );
    return check1 && check2;
  } else return check1;
}
function FromIterator$3(schema, references, value) {
  return IsIterator$2(value);
}
function FromLiteral$2(schema, references, value) {
  return value === schema.const;
}
function FromNever$2(schema, references, value) {
  return false;
}
function FromNot$5(schema, references, value) {
  return !Visit$7(schema.not, references, value);
}
function FromNull$2(schema, references, value) {
  return IsNull$2(value);
}
function FromNumber$2(schema, references, value) {
  if (!TypeSystemPolicy.IsNumberLike(value)) return false;
  if (IsDefined$1(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) return false;
  if (IsDefined$1(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) return false;
  if (IsDefined$1(schema.minimum) && !(value >= schema.minimum)) return false;
  if (IsDefined$1(schema.maximum) && !(value <= schema.maximum)) return false;
  if (IsDefined$1(schema.multipleOf) && !(value % schema.multipleOf === 0)) return false;
  return true;
}
function FromObject$8(schema, references, value) {
  if (!TypeSystemPolicy.IsObjectLike(value)) return false;
  if (
    IsDefined$1(schema.minProperties) &&
    !(Object.getOwnPropertyNames(value).length >= schema.minProperties)
  )
    return false;
  if (
    IsDefined$1(schema.maxProperties) &&
    !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)
  )
    return false;
  const knownKeys = Object.getOwnPropertyNames(schema.properties);
  for (const knownKey of knownKeys) {
    const property = schema.properties[knownKey];
    if (schema.required && schema.required.includes(knownKey)) {
      if (!Visit$7(property, references, value[knownKey])) return false;
      if ((ExtendsUndefinedCheck(property) || IsAnyOrUnknown(property)) && !(knownKey in value))
        return false;
    } else if (
      TypeSystemPolicy.IsExactOptionalProperty(value, knownKey) &&
      !Visit$7(property, references, value[knownKey])
    )
      return false;
  }
  if (schema.additionalProperties === false) {
    const valueKeys = Object.getOwnPropertyNames(value);
    if (
      schema.required &&
      schema.required.length === knownKeys.length &&
      valueKeys.length === knownKeys.length
    )
      return true;
    else return valueKeys.every((valueKey) => knownKeys.includes(valueKey));
  } else if (typeof schema.additionalProperties === 'object')
    return Object.getOwnPropertyNames(value).every(
      (key) =>
        knownKeys.includes(key) || Visit$7(schema.additionalProperties, references, value[key]),
    );
  else return true;
}
function FromPromise$3(schema, references, value) {
  return IsPromise$2(value);
}
function FromRecord$7(schema, references, value) {
  if (!TypeSystemPolicy.IsRecordLike(value)) return false;
  if (
    IsDefined$1(schema.minProperties) &&
    !(Object.getOwnPropertyNames(value).length >= schema.minProperties)
  )
    return false;
  if (
    IsDefined$1(schema.maxProperties) &&
    !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)
  )
    return false;
  const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0];
  const regex = new RegExp(patternKey);
  const check1 = Object.entries(value).every(([key, value]) => {
    return regex.test(key) ? Visit$7(patternSchema, references, value) : true;
  });
  const check2 =
    typeof schema.additionalProperties === 'object'
      ? Object.entries(value).every(([key, value]) => {
          return !regex.test(key) ? Visit$7(schema.additionalProperties, references, value) : true;
        })
      : true;
  const check3 =
    schema.additionalProperties === false
      ? Object.getOwnPropertyNames(value).every((key) => {
          return regex.test(key);
        })
      : true;
  return check1 && check2 && check3;
}
function FromRef$7(schema, references, value) {
  return Visit$7(Deref(schema, references), references, value);
}
function FromRegExp$2(schema, references, value) {
  const regex = new RegExp(schema.source, schema.flags);
  if (IsDefined$1(schema.minLength)) {
    if (!(value.length >= schema.minLength)) return false;
  }
  if (IsDefined$1(schema.maxLength)) {
    if (!(value.length <= schema.maxLength)) return false;
  }
  return regex.test(value);
}
function FromString$2(schema, references, value) {
  if (!IsString$2(value)) return false;
  if (IsDefined$1(schema.minLength)) {
    if (!(value.length >= schema.minLength)) return false;
  }
  if (IsDefined$1(schema.maxLength)) {
    if (!(value.length <= schema.maxLength)) return false;
  }
  if (IsDefined$1(schema.pattern)) {
    if (!new RegExp(schema.pattern).test(value)) return false;
  }
  if (IsDefined$1(schema.format)) {
    if (!Has$1(schema.format)) return false;
    return Get$1(schema.format)(value);
  }
  return true;
}
function FromSymbol$2(schema, references, value) {
  return IsSymbol$2(value);
}
function FromTemplateLiteral$2(schema, references, value) {
  return IsString$2(value) && new RegExp(schema.pattern).test(value);
}
function FromThis$7(schema, references, value) {
  return Visit$7(Deref(schema, references), references, value);
}
function FromTuple$7(schema, references, value) {
  if (!IsArray$2(value)) return false;
  if (schema.items === void 0 && !(value.length === 0)) return false;
  if (!(value.length === schema.maxItems)) return false;
  if (!schema.items) return true;
  for (let i = 0; i < schema.items.length; i++)
    if (!Visit$7(schema.items[i], references, value[i])) return false;
  return true;
}
function FromUndefined$2(schema, references, value) {
  return IsUndefined$2(value);
}
function FromUnion$7(schema, references, value) {
  return schema.anyOf.some((inner) => Visit$7(inner, references, value));
}
function FromUint8Array$2(schema, references, value) {
  if (!IsUint8Array$2(value)) return false;
  if (IsDefined$1(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) return false;
  if (IsDefined$1(schema.minByteLength) && !(value.length >= schema.minByteLength)) return false;
  return true;
}
function FromUnknown$2(schema, references, value) {
  return true;
}
function FromVoid$2(schema, references, value) {
  return TypeSystemPolicy.IsVoidLike(value);
}
function FromKind$2(schema, references, value) {
  if (!Has(schema[Kind])) return false;
  return Get(schema[Kind])(schema, value);
}
function Visit$7(schema, references, value) {
  const references_ = IsDefined$1(schema.$id) ? Pushref(schema, references) : references;
  const schema_ = schema;
  switch (schema_[Kind]) {
    case 'Any':
      return FromAny$2(schema_, references_, value);
    case 'Argument':
      return FromArgument$2(schema_, references_, value);
    case 'Array':
      return FromArray$8(schema_, references_, value);
    case 'AsyncIterator':
      return FromAsyncIterator$3(schema_, references_, value);
    case 'BigInt':
      return FromBigInt$2(schema_, references_, value);
    case 'Boolean':
      return FromBoolean$2(schema_, references_, value);
    case 'Constructor':
      return FromConstructor$3(schema_, references_, value);
    case 'Date':
      return FromDate$4(schema_, references_, value);
    case 'Function':
      return FromFunction$3(schema_, references_, value);
    case 'Import':
      return FromImport$7(schema_, references_, value);
    case 'Integer':
      return FromInteger$2(schema_, references_, value);
    case 'Intersect':
      return FromIntersect$7(schema_, references_, value);
    case 'Iterator':
      return FromIterator$3(schema_, references_, value);
    case 'Literal':
      return FromLiteral$2(schema_, references_, value);
    case 'Never':
      return FromNever$2(schema_, references_, value);
    case 'Not':
      return FromNot$5(schema_, references_, value);
    case 'Null':
      return FromNull$2(schema_, references_, value);
    case 'Number':
      return FromNumber$2(schema_, references_, value);
    case 'Object':
      return FromObject$8(schema_, references_, value);
    case 'Promise':
      return FromPromise$3(schema_, references_, value);
    case 'Record':
      return FromRecord$7(schema_, references_, value);
    case 'Ref':
      return FromRef$7(schema_, references_, value);
    case 'RegExp':
      return FromRegExp$2(schema_, references_, value);
    case 'String':
      return FromString$2(schema_, references_, value);
    case 'Symbol':
      return FromSymbol$2(schema_, references_, value);
    case 'TemplateLiteral':
      return FromTemplateLiteral$2(schema_, references_, value);
    case 'This':
      return FromThis$7(schema_, references_, value);
    case 'Tuple':
      return FromTuple$7(schema_, references_, value);
    case 'Undefined':
      return FromUndefined$2(schema_, references_, value);
    case 'Union':
      return FromUnion$7(schema_, references_, value);
    case 'Uint8Array':
      return FromUint8Array$2(schema_, references_, value);
    case 'Unknown':
      return FromUnknown$2(schema_, references_, value);
    case 'Void':
      return FromVoid$2(schema_, references_, value);
    default:
      if (!Has(schema_[Kind])) throw new ValueCheckUnknownTypeError(schema_);
      return FromKind$2(schema_, references_, value);
  }
}
/** Returns true if the value matches the given type. */
function Check(...args) {
  return args.length === 3 ? Visit$7(args[0], args[1], args[2]) : Visit$7(args[0], [], args[1]);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/errors/errors.mjs
var ValueErrorType;
(function (ValueErrorType) {
  ValueErrorType[(ValueErrorType['ArrayContains'] = 0)] = 'ArrayContains';
  ValueErrorType[(ValueErrorType['ArrayMaxContains'] = 1)] = 'ArrayMaxContains';
  ValueErrorType[(ValueErrorType['ArrayMaxItems'] = 2)] = 'ArrayMaxItems';
  ValueErrorType[(ValueErrorType['ArrayMinContains'] = 3)] = 'ArrayMinContains';
  ValueErrorType[(ValueErrorType['ArrayMinItems'] = 4)] = 'ArrayMinItems';
  ValueErrorType[(ValueErrorType['ArrayUniqueItems'] = 5)] = 'ArrayUniqueItems';
  ValueErrorType[(ValueErrorType['Array'] = 6)] = 'Array';
  ValueErrorType[(ValueErrorType['AsyncIterator'] = 7)] = 'AsyncIterator';
  ValueErrorType[(ValueErrorType['BigIntExclusiveMaximum'] = 8)] = 'BigIntExclusiveMaximum';
  ValueErrorType[(ValueErrorType['BigIntExclusiveMinimum'] = 9)] = 'BigIntExclusiveMinimum';
  ValueErrorType[(ValueErrorType['BigIntMaximum'] = 10)] = 'BigIntMaximum';
  ValueErrorType[(ValueErrorType['BigIntMinimum'] = 11)] = 'BigIntMinimum';
  ValueErrorType[(ValueErrorType['BigIntMultipleOf'] = 12)] = 'BigIntMultipleOf';
  ValueErrorType[(ValueErrorType['BigInt'] = 13)] = 'BigInt';
  ValueErrorType[(ValueErrorType['Boolean'] = 14)] = 'Boolean';
  ValueErrorType[(ValueErrorType['DateExclusiveMaximumTimestamp'] = 15)] =
    'DateExclusiveMaximumTimestamp';
  ValueErrorType[(ValueErrorType['DateExclusiveMinimumTimestamp'] = 16)] =
    'DateExclusiveMinimumTimestamp';
  ValueErrorType[(ValueErrorType['DateMaximumTimestamp'] = 17)] = 'DateMaximumTimestamp';
  ValueErrorType[(ValueErrorType['DateMinimumTimestamp'] = 18)] = 'DateMinimumTimestamp';
  ValueErrorType[(ValueErrorType['DateMultipleOfTimestamp'] = 19)] = 'DateMultipleOfTimestamp';
  ValueErrorType[(ValueErrorType['Date'] = 20)] = 'Date';
  ValueErrorType[(ValueErrorType['Function'] = 21)] = 'Function';
  ValueErrorType[(ValueErrorType['IntegerExclusiveMaximum'] = 22)] = 'IntegerExclusiveMaximum';
  ValueErrorType[(ValueErrorType['IntegerExclusiveMinimum'] = 23)] = 'IntegerExclusiveMinimum';
  ValueErrorType[(ValueErrorType['IntegerMaximum'] = 24)] = 'IntegerMaximum';
  ValueErrorType[(ValueErrorType['IntegerMinimum'] = 25)] = 'IntegerMinimum';
  ValueErrorType[(ValueErrorType['IntegerMultipleOf'] = 26)] = 'IntegerMultipleOf';
  ValueErrorType[(ValueErrorType['Integer'] = 27)] = 'Integer';
  ValueErrorType[(ValueErrorType['IntersectUnevaluatedProperties'] = 28)] =
    'IntersectUnevaluatedProperties';
  ValueErrorType[(ValueErrorType['Intersect'] = 29)] = 'Intersect';
  ValueErrorType[(ValueErrorType['Iterator'] = 30)] = 'Iterator';
  ValueErrorType[(ValueErrorType['Kind'] = 31)] = 'Kind';
  ValueErrorType[(ValueErrorType['Literal'] = 32)] = 'Literal';
  ValueErrorType[(ValueErrorType['Never'] = 33)] = 'Never';
  ValueErrorType[(ValueErrorType['Not'] = 34)] = 'Not';
  ValueErrorType[(ValueErrorType['Null'] = 35)] = 'Null';
  ValueErrorType[(ValueErrorType['NumberExclusiveMaximum'] = 36)] = 'NumberExclusiveMaximum';
  ValueErrorType[(ValueErrorType['NumberExclusiveMinimum'] = 37)] = 'NumberExclusiveMinimum';
  ValueErrorType[(ValueErrorType['NumberMaximum'] = 38)] = 'NumberMaximum';
  ValueErrorType[(ValueErrorType['NumberMinimum'] = 39)] = 'NumberMinimum';
  ValueErrorType[(ValueErrorType['NumberMultipleOf'] = 40)] = 'NumberMultipleOf';
  ValueErrorType[(ValueErrorType['Number'] = 41)] = 'Number';
  ValueErrorType[(ValueErrorType['ObjectAdditionalProperties'] = 42)] =
    'ObjectAdditionalProperties';
  ValueErrorType[(ValueErrorType['ObjectMaxProperties'] = 43)] = 'ObjectMaxProperties';
  ValueErrorType[(ValueErrorType['ObjectMinProperties'] = 44)] = 'ObjectMinProperties';
  ValueErrorType[(ValueErrorType['ObjectRequiredProperty'] = 45)] = 'ObjectRequiredProperty';
  ValueErrorType[(ValueErrorType['Object'] = 46)] = 'Object';
  ValueErrorType[(ValueErrorType['Promise'] = 47)] = 'Promise';
  ValueErrorType[(ValueErrorType['RegExp'] = 48)] = 'RegExp';
  ValueErrorType[(ValueErrorType['StringFormatUnknown'] = 49)] = 'StringFormatUnknown';
  ValueErrorType[(ValueErrorType['StringFormat'] = 50)] = 'StringFormat';
  ValueErrorType[(ValueErrorType['StringMaxLength'] = 51)] = 'StringMaxLength';
  ValueErrorType[(ValueErrorType['StringMinLength'] = 52)] = 'StringMinLength';
  ValueErrorType[(ValueErrorType['StringPattern'] = 53)] = 'StringPattern';
  ValueErrorType[(ValueErrorType['String'] = 54)] = 'String';
  ValueErrorType[(ValueErrorType['Symbol'] = 55)] = 'Symbol';
  ValueErrorType[(ValueErrorType['TupleLength'] = 56)] = 'TupleLength';
  ValueErrorType[(ValueErrorType['Tuple'] = 57)] = 'Tuple';
  ValueErrorType[(ValueErrorType['Uint8ArrayMaxByteLength'] = 58)] = 'Uint8ArrayMaxByteLength';
  ValueErrorType[(ValueErrorType['Uint8ArrayMinByteLength'] = 59)] = 'Uint8ArrayMinByteLength';
  ValueErrorType[(ValueErrorType['Uint8Array'] = 60)] = 'Uint8Array';
  ValueErrorType[(ValueErrorType['Undefined'] = 61)] = 'Undefined';
  ValueErrorType[(ValueErrorType['Union'] = 62)] = 'Union';
  ValueErrorType[(ValueErrorType['Void'] = 63)] = 'Void';
})(ValueErrorType || (ValueErrorType = {}));
var ValueErrorsUnknownTypeError = class extends TypeBoxError {
  constructor(schema) {
    super('Unknown type');
    this.schema = schema;
  }
};
function EscapeKey(key) {
  return key.replace(/~/g, '~0').replace(/\//g, '~1');
}
function IsDefined(value) {
  return value !== void 0;
}
var ValueErrorIterator = class {
  constructor(iterator) {
    this.iterator = iterator;
  }
  [Symbol.iterator]() {
    return this.iterator;
  }
  /** Returns the first value error or undefined if no errors */
  First() {
    const next = this.iterator.next();
    return next.done ? void 0 : next.value;
  }
};
function Create$1(errorType, schema, path, value, errors = []) {
  return {
    type: errorType,
    schema,
    path,
    value,
    message: GetErrorFunction()({
      errorType,
      path,
      schema,
      value,
      errors,
    }),
    errors,
  };
}
function* FromAny$1(schema, references, path, value) {}
function* FromArgument$1(schema, references, path, value) {}
function* FromArray$7(schema, references, path, value) {
  if (!IsArray$2(value)) return yield Create$1(ValueErrorType.Array, schema, path, value);
  if (IsDefined(schema.minItems) && !(value.length >= schema.minItems))
    yield Create$1(ValueErrorType.ArrayMinItems, schema, path, value);
  if (IsDefined(schema.maxItems) && !(value.length <= schema.maxItems))
    yield Create$1(ValueErrorType.ArrayMaxItems, schema, path, value);
  for (let i = 0; i < value.length; i++)
    yield* Visit$6(schema.items, references, `${path}/${i}`, value[i]);
  if (
    schema.uniqueItems === true &&
    !(function () {
      const set = /* @__PURE__ */ new Set();
      for (const element of value) {
        const hashed = Hash(element);
        if (set.has(hashed)) return false;
        else set.add(hashed);
      }
      return true;
    })()
  )
    yield Create$1(ValueErrorType.ArrayUniqueItems, schema, path, value);
  if (
    !(IsDefined(schema.contains) || IsDefined(schema.minContains) || IsDefined(schema.maxContains))
  )
    return;
  const containsSchema = IsDefined(schema.contains) ? schema.contains : Never();
  const containsCount = value.reduce(
    (acc, value, index) =>
      Visit$6(containsSchema, references, `${path}${index}`, value).next().done === true
        ? acc + 1
        : acc,
    0,
  );
  if (containsCount === 0) yield Create$1(ValueErrorType.ArrayContains, schema, path, value);
  if (IsNumber$2(schema.minContains) && containsCount < schema.minContains)
    yield Create$1(ValueErrorType.ArrayMinContains, schema, path, value);
  if (IsNumber$2(schema.maxContains) && containsCount > schema.maxContains)
    yield Create$1(ValueErrorType.ArrayMaxContains, schema, path, value);
}
function* FromAsyncIterator$2(schema, references, path, value) {
  if (!IsAsyncIterator$2(value)) yield Create$1(ValueErrorType.AsyncIterator, schema, path, value);
}
function* FromBigInt$1(schema, references, path, value) {
  if (!IsBigInt$2(value)) return yield Create$1(ValueErrorType.BigInt, schema, path, value);
  if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum))
    yield Create$1(ValueErrorType.BigIntExclusiveMaximum, schema, path, value);
  if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum))
    yield Create$1(ValueErrorType.BigIntExclusiveMinimum, schema, path, value);
  if (IsDefined(schema.maximum) && !(value <= schema.maximum))
    yield Create$1(ValueErrorType.BigIntMaximum, schema, path, value);
  if (IsDefined(schema.minimum) && !(value >= schema.minimum))
    yield Create$1(ValueErrorType.BigIntMinimum, schema, path, value);
  if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === BigInt(0)))
    yield Create$1(ValueErrorType.BigIntMultipleOf, schema, path, value);
}
function* FromBoolean$1(schema, references, path, value) {
  if (!IsBoolean$2(value)) yield Create$1(ValueErrorType.Boolean, schema, path, value);
}
function* FromConstructor$2(schema, references, path, value) {
  yield* Visit$6(schema.returns, references, path, value.prototype);
}
function* FromDate$3(schema, references, path, value) {
  if (!IsDate$2(value)) return yield Create$1(ValueErrorType.Date, schema, path, value);
  if (
    IsDefined(schema.exclusiveMaximumTimestamp) &&
    !(value.getTime() < schema.exclusiveMaximumTimestamp)
  )
    yield Create$1(ValueErrorType.DateExclusiveMaximumTimestamp, schema, path, value);
  if (
    IsDefined(schema.exclusiveMinimumTimestamp) &&
    !(value.getTime() > schema.exclusiveMinimumTimestamp)
  )
    yield Create$1(ValueErrorType.DateExclusiveMinimumTimestamp, schema, path, value);
  if (IsDefined(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp))
    yield Create$1(ValueErrorType.DateMaximumTimestamp, schema, path, value);
  if (IsDefined(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp))
    yield Create$1(ValueErrorType.DateMinimumTimestamp, schema, path, value);
  if (
    IsDefined(schema.multipleOfTimestamp) &&
    !(value.getTime() % schema.multipleOfTimestamp === 0)
  )
    yield Create$1(ValueErrorType.DateMultipleOfTimestamp, schema, path, value);
}
function* FromFunction$2(schema, references, path, value) {
  if (!IsFunction$2(value)) yield Create$1(ValueErrorType.Function, schema, path, value);
}
function* FromImport$6(schema, references, path, value) {
  const definitions = globalThis.Object.values(schema.$defs);
  const target = schema.$defs[schema.$ref];
  yield* Visit$6(target, [...references, ...definitions], path, value);
}
function* FromInteger$1(schema, references, path, value) {
  if (!IsInteger$2(value)) return yield Create$1(ValueErrorType.Integer, schema, path, value);
  if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum))
    yield Create$1(ValueErrorType.IntegerExclusiveMaximum, schema, path, value);
  if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum))
    yield Create$1(ValueErrorType.IntegerExclusiveMinimum, schema, path, value);
  if (IsDefined(schema.maximum) && !(value <= schema.maximum))
    yield Create$1(ValueErrorType.IntegerMaximum, schema, path, value);
  if (IsDefined(schema.minimum) && !(value >= schema.minimum))
    yield Create$1(ValueErrorType.IntegerMinimum, schema, path, value);
  if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === 0))
    yield Create$1(ValueErrorType.IntegerMultipleOf, schema, path, value);
}
function* FromIntersect$6(schema, references, path, value) {
  let hasError = false;
  for (const inner of schema.allOf)
    for (const error of Visit$6(inner, references, path, value)) {
      hasError = true;
      yield error;
    }
  if (hasError) return yield Create$1(ValueErrorType.Intersect, schema, path, value);
  if (schema.unevaluatedProperties === false) {
    const keyCheck = new RegExp(KeyOfPattern(schema));
    for (const valueKey of Object.getOwnPropertyNames(value))
      if (!keyCheck.test(valueKey))
        yield Create$1(
          ValueErrorType.IntersectUnevaluatedProperties,
          schema,
          `${path}/${valueKey}`,
          value,
        );
  }
  if (typeof schema.unevaluatedProperties === 'object') {
    const keyCheck = new RegExp(KeyOfPattern(schema));
    for (const valueKey of Object.getOwnPropertyNames(value))
      if (!keyCheck.test(valueKey)) {
        const next = Visit$6(
          schema.unevaluatedProperties,
          references,
          `${path}/${valueKey}`,
          value[valueKey],
        ).next();
        if (!next.done) yield next.value;
      }
  }
}
function* FromIterator$2(schema, references, path, value) {
  if (!IsIterator$2(value)) yield Create$1(ValueErrorType.Iterator, schema, path, value);
}
function* FromLiteral$1(schema, references, path, value) {
  if (!(value === schema.const)) yield Create$1(ValueErrorType.Literal, schema, path, value);
}
function* FromNever$1(schema, references, path, value) {
  yield Create$1(ValueErrorType.Never, schema, path, value);
}
function* FromNot$4(schema, references, path, value) {
  if (Visit$6(schema.not, references, path, value).next().done === true)
    yield Create$1(ValueErrorType.Not, schema, path, value);
}
function* FromNull$1(schema, references, path, value) {
  if (!IsNull$2(value)) yield Create$1(ValueErrorType.Null, schema, path, value);
}
function* FromNumber$1(schema, references, path, value) {
  if (!TypeSystemPolicy.IsNumberLike(value))
    return yield Create$1(ValueErrorType.Number, schema, path, value);
  if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum))
    yield Create$1(ValueErrorType.NumberExclusiveMaximum, schema, path, value);
  if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum))
    yield Create$1(ValueErrorType.NumberExclusiveMinimum, schema, path, value);
  if (IsDefined(schema.maximum) && !(value <= schema.maximum))
    yield Create$1(ValueErrorType.NumberMaximum, schema, path, value);
  if (IsDefined(schema.minimum) && !(value >= schema.minimum))
    yield Create$1(ValueErrorType.NumberMinimum, schema, path, value);
  if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === 0))
    yield Create$1(ValueErrorType.NumberMultipleOf, schema, path, value);
}
function* FromObject$7(schema, references, path, value) {
  if (!TypeSystemPolicy.IsObjectLike(value))
    return yield Create$1(ValueErrorType.Object, schema, path, value);
  if (
    IsDefined(schema.minProperties) &&
    !(Object.getOwnPropertyNames(value).length >= schema.minProperties)
  )
    yield Create$1(ValueErrorType.ObjectMinProperties, schema, path, value);
  if (
    IsDefined(schema.maxProperties) &&
    !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)
  )
    yield Create$1(ValueErrorType.ObjectMaxProperties, schema, path, value);
  const requiredKeys = Array.isArray(schema.required) ? schema.required : [];
  const knownKeys = Object.getOwnPropertyNames(schema.properties);
  const unknownKeys = Object.getOwnPropertyNames(value);
  for (const requiredKey of requiredKeys) {
    if (unknownKeys.includes(requiredKey)) continue;
    yield Create$1(
      ValueErrorType.ObjectRequiredProperty,
      schema.properties[requiredKey],
      `${path}/${EscapeKey(requiredKey)}`,
      void 0,
    );
  }
  if (schema.additionalProperties === false) {
    for (const valueKey of unknownKeys)
      if (!knownKeys.includes(valueKey))
        yield Create$1(
          ValueErrorType.ObjectAdditionalProperties,
          schema,
          `${path}/${EscapeKey(valueKey)}`,
          value[valueKey],
        );
  }
  if (typeof schema.additionalProperties === 'object')
    for (const valueKey of unknownKeys) {
      if (knownKeys.includes(valueKey)) continue;
      yield* Visit$6(
        schema.additionalProperties,
        references,
        `${path}/${EscapeKey(valueKey)}`,
        value[valueKey],
      );
    }
  for (const knownKey of knownKeys) {
    const property = schema.properties[knownKey];
    if (schema.required && schema.required.includes(knownKey)) {
      yield* Visit$6(property, references, `${path}/${EscapeKey(knownKey)}`, value[knownKey]);
      if (ExtendsUndefinedCheck(schema) && !(knownKey in value))
        yield Create$1(
          ValueErrorType.ObjectRequiredProperty,
          property,
          `${path}/${EscapeKey(knownKey)}`,
          void 0,
        );
    } else if (TypeSystemPolicy.IsExactOptionalProperty(value, knownKey))
      yield* Visit$6(property, references, `${path}/${EscapeKey(knownKey)}`, value[knownKey]);
  }
}
function* FromPromise$2(schema, references, path, value) {
  if (!IsPromise$2(value)) yield Create$1(ValueErrorType.Promise, schema, path, value);
}
function* FromRecord$6(schema, references, path, value) {
  if (!TypeSystemPolicy.IsRecordLike(value))
    return yield Create$1(ValueErrorType.Object, schema, path, value);
  if (
    IsDefined(schema.minProperties) &&
    !(Object.getOwnPropertyNames(value).length >= schema.minProperties)
  )
    yield Create$1(ValueErrorType.ObjectMinProperties, schema, path, value);
  if (
    IsDefined(schema.maxProperties) &&
    !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)
  )
    yield Create$1(ValueErrorType.ObjectMaxProperties, schema, path, value);
  const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0];
  const regex = new RegExp(patternKey);
  for (const [propertyKey, propertyValue] of Object.entries(value))
    if (regex.test(propertyKey))
      yield* Visit$6(patternSchema, references, `${path}/${EscapeKey(propertyKey)}`, propertyValue);
  if (typeof schema.additionalProperties === 'object') {
    for (const [propertyKey, propertyValue] of Object.entries(value))
      if (!regex.test(propertyKey))
        yield* Visit$6(
          schema.additionalProperties,
          references,
          `${path}/${EscapeKey(propertyKey)}`,
          propertyValue,
        );
  }
  if (schema.additionalProperties === false)
    for (const [propertyKey, propertyValue] of Object.entries(value)) {
      if (regex.test(propertyKey)) continue;
      return yield Create$1(
        ValueErrorType.ObjectAdditionalProperties,
        schema,
        `${path}/${EscapeKey(propertyKey)}`,
        propertyValue,
      );
    }
}
function* FromRef$6(schema, references, path, value) {
  yield* Visit$6(Deref(schema, references), references, path, value);
}
function* FromRegExp$1(schema, references, path, value) {
  if (!IsString$2(value)) return yield Create$1(ValueErrorType.String, schema, path, value);
  if (IsDefined(schema.minLength) && !(value.length >= schema.minLength))
    yield Create$1(ValueErrorType.StringMinLength, schema, path, value);
  if (IsDefined(schema.maxLength) && !(value.length <= schema.maxLength))
    yield Create$1(ValueErrorType.StringMaxLength, schema, path, value);
  if (!new RegExp(schema.source, schema.flags).test(value))
    return yield Create$1(ValueErrorType.RegExp, schema, path, value);
}
function* FromString$1(schema, references, path, value) {
  if (!IsString$2(value)) return yield Create$1(ValueErrorType.String, schema, path, value);
  if (IsDefined(schema.minLength) && !(value.length >= schema.minLength))
    yield Create$1(ValueErrorType.StringMinLength, schema, path, value);
  if (IsDefined(schema.maxLength) && !(value.length <= schema.maxLength))
    yield Create$1(ValueErrorType.StringMaxLength, schema, path, value);
  if (IsString$2(schema.pattern)) {
    if (!new RegExp(schema.pattern).test(value))
      yield Create$1(ValueErrorType.StringPattern, schema, path, value);
  }
  if (IsString$2(schema.format)) {
    if (!Has$1(schema.format))
      yield Create$1(ValueErrorType.StringFormatUnknown, schema, path, value);
    else if (!Get$1(schema.format)(value))
      yield Create$1(ValueErrorType.StringFormat, schema, path, value);
  }
}
function* FromSymbol$1(schema, references, path, value) {
  if (!IsSymbol$2(value)) yield Create$1(ValueErrorType.Symbol, schema, path, value);
}
function* FromTemplateLiteral$1(schema, references, path, value) {
  if (!IsString$2(value)) return yield Create$1(ValueErrorType.String, schema, path, value);
  if (!new RegExp(schema.pattern).test(value))
    yield Create$1(ValueErrorType.StringPattern, schema, path, value);
}
function* FromThis$6(schema, references, path, value) {
  yield* Visit$6(Deref(schema, references), references, path, value);
}
function* FromTuple$6(schema, references, path, value) {
  if (!IsArray$2(value)) return yield Create$1(ValueErrorType.Tuple, schema, path, value);
  if (schema.items === void 0 && !(value.length === 0))
    return yield Create$1(ValueErrorType.TupleLength, schema, path, value);
  if (!(value.length === schema.maxItems))
    return yield Create$1(ValueErrorType.TupleLength, schema, path, value);
  if (!schema.items) return;
  for (let i = 0; i < schema.items.length; i++)
    yield* Visit$6(schema.items[i], references, `${path}/${i}`, value[i]);
}
function* FromUndefined$1(schema, references, path, value) {
  if (!IsUndefined$2(value)) yield Create$1(ValueErrorType.Undefined, schema, path, value);
}
function* FromUnion$6(schema, references, path, value) {
  if (Check(schema, references, value)) return;
  const errors = schema.anyOf.map(
    (variant) => new ValueErrorIterator(Visit$6(variant, references, path, value)),
  );
  yield Create$1(ValueErrorType.Union, schema, path, value, errors);
}
function* FromUint8Array$1(schema, references, path, value) {
  if (!IsUint8Array$2(value)) return yield Create$1(ValueErrorType.Uint8Array, schema, path, value);
  if (IsDefined(schema.maxByteLength) && !(value.length <= schema.maxByteLength))
    yield Create$1(ValueErrorType.Uint8ArrayMaxByteLength, schema, path, value);
  if (IsDefined(schema.minByteLength) && !(value.length >= schema.minByteLength))
    yield Create$1(ValueErrorType.Uint8ArrayMinByteLength, schema, path, value);
}
function* FromUnknown$1(schema, references, path, value) {}
function* FromVoid$1(schema, references, path, value) {
  if (!TypeSystemPolicy.IsVoidLike(value)) yield Create$1(ValueErrorType.Void, schema, path, value);
}
function* FromKind$1(schema, references, path, value) {
  if (!Get(schema[Kind])(schema, value)) yield Create$1(ValueErrorType.Kind, schema, path, value);
}
function* Visit$6(schema, references, path, value) {
  const references_ = IsDefined(schema.$id) ? [...references, schema] : references;
  const schema_ = schema;
  switch (schema_[Kind]) {
    case 'Any':
      return yield* FromAny$1(schema_, references_, path, value);
    case 'Argument':
      return yield* FromArgument$1(schema_, references_, path, value);
    case 'Array':
      return yield* FromArray$7(schema_, references_, path, value);
    case 'AsyncIterator':
      return yield* FromAsyncIterator$2(schema_, references_, path, value);
    case 'BigInt':
      return yield* FromBigInt$1(schema_, references_, path, value);
    case 'Boolean':
      return yield* FromBoolean$1(schema_, references_, path, value);
    case 'Constructor':
      return yield* FromConstructor$2(schema_, references_, path, value);
    case 'Date':
      return yield* FromDate$3(schema_, references_, path, value);
    case 'Function':
      return yield* FromFunction$2(schema_, references_, path, value);
    case 'Import':
      return yield* FromImport$6(schema_, references_, path, value);
    case 'Integer':
      return yield* FromInteger$1(schema_, references_, path, value);
    case 'Intersect':
      return yield* FromIntersect$6(schema_, references_, path, value);
    case 'Iterator':
      return yield* FromIterator$2(schema_, references_, path, value);
    case 'Literal':
      return yield* FromLiteral$1(schema_, references_, path, value);
    case 'Never':
      return yield* FromNever$1(schema_, references_, path, value);
    case 'Not':
      return yield* FromNot$4(schema_, references_, path, value);
    case 'Null':
      return yield* FromNull$1(schema_, references_, path, value);
    case 'Number':
      return yield* FromNumber$1(schema_, references_, path, value);
    case 'Object':
      return yield* FromObject$7(schema_, references_, path, value);
    case 'Promise':
      return yield* FromPromise$2(schema_, references_, path, value);
    case 'Record':
      return yield* FromRecord$6(schema_, references_, path, value);
    case 'Ref':
      return yield* FromRef$6(schema_, references_, path, value);
    case 'RegExp':
      return yield* FromRegExp$1(schema_, references_, path, value);
    case 'String':
      return yield* FromString$1(schema_, references_, path, value);
    case 'Symbol':
      return yield* FromSymbol$1(schema_, references_, path, value);
    case 'TemplateLiteral':
      return yield* FromTemplateLiteral$1(schema_, references_, path, value);
    case 'This':
      return yield* FromThis$6(schema_, references_, path, value);
    case 'Tuple':
      return yield* FromTuple$6(schema_, references_, path, value);
    case 'Undefined':
      return yield* FromUndefined$1(schema_, references_, path, value);
    case 'Union':
      return yield* FromUnion$6(schema_, references_, path, value);
    case 'Uint8Array':
      return yield* FromUint8Array$1(schema_, references_, path, value);
    case 'Unknown':
      return yield* FromUnknown$1(schema_, references_, path, value);
    case 'Void':
      return yield* FromVoid$1(schema_, references_, path, value);
    default:
      if (!Has(schema_[Kind])) throw new ValueErrorsUnknownTypeError(schema);
      return yield* FromKind$1(schema_, references_, path, value);
  }
}
/** Returns an iterator for each error in this value. */
function Errors(...args) {
  return new ValueErrorIterator(
    args.length === 3 ? Visit$6(args[0], args[1], '', args[2]) : Visit$6(args[0], [], '', args[1]),
  );
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/clone/clone.mjs
function FromObject$6(value) {
  const Acc = {};
  for (const key of Object.getOwnPropertyNames(value)) Acc[key] = Clone(value[key]);
  for (const key of Object.getOwnPropertySymbols(value)) Acc[key] = Clone(value[key]);
  return Acc;
}
function FromArray$6(value) {
  return value.map((element) => Clone(element));
}
function FromTypedArray(value) {
  return value.slice();
}
function FromMap(value) {
  return new Map(Clone([...value.entries()]));
}
function FromSet(value) {
  return new Set(Clone([...value.entries()]));
}
function FromDate$2(value) {
  return new Date(value.toISOString());
}
function FromValue(value) {
  return value;
}
/** Returns a clone of the given value */
function Clone(value) {
  if (IsArray$2(value)) return FromArray$6(value);
  if (IsDate$2(value)) return FromDate$2(value);
  if (IsTypedArray(value)) return FromTypedArray(value);
  if (IsMap(value)) return FromMap(value);
  if (IsSet(value)) return FromSet(value);
  if (IsObject$2(value)) return FromObject$6(value);
  if (IsValueType(value)) return FromValue(value);
  throw new Error('ValueClone: Unable to clone value');
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/create/create.mjs
var ValueCreateError = class extends TypeBoxError {
  constructor(schema, message) {
    super(message);
    this.schema = schema;
  }
};
function FromDefault(value) {
  return IsFunction$2(value) ? value() : Clone(value);
}
function FromAny(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return {};
}
function FromArgument(schema, references) {
  return {};
}
function FromArray$5(schema, references) {
  if (schema.uniqueItems === true && !HasPropertyKey(schema, 'default'))
    throw new ValueCreateError(
      schema,
      'Array with the uniqueItems constraint requires a default value',
    );
  else if ('contains' in schema && !HasPropertyKey(schema, 'default'))
    throw new ValueCreateError(
      schema,
      'Array with the contains constraint requires a default value',
    );
  else if ('default' in schema) return FromDefault(schema.default);
  else if (schema.minItems !== void 0)
    return Array.from({ length: schema.minItems }).map((item) => {
      return Visit$5(schema.items, references);
    });
  else return [];
}
function FromAsyncIterator$1(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return (async function* () {})();
}
function FromBigInt(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return BigInt(0);
}
function FromBoolean(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return false;
}
function FromConstructor$1(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else {
    const value = Visit$5(schema.returns, references);
    if (typeof value === 'object' && !Array.isArray(value))
      return class {
        constructor() {
          for (const [key, val] of Object.entries(value)) {
            const self = this;
            self[key] = val;
          }
        }
      };
    else return class {};
  }
}
function FromDate$1(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else if (schema.minimumTimestamp !== void 0) return new Date(schema.minimumTimestamp);
  else return /* @__PURE__ */ new Date();
}
function FromFunction$1(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return () => Visit$5(schema.returns, references);
}
function FromImport$5(schema, references) {
  const definitions = globalThis.Object.values(schema.$defs);
  const target = schema.$defs[schema.$ref];
  return Visit$5(target, [...references, ...definitions]);
}
function FromInteger(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else if (schema.minimum !== void 0) return schema.minimum;
  else return 0;
}
function FromIntersect$5(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else {
    const value = schema.allOf.reduce((acc, schema) => {
      const next = Visit$5(schema, references);
      return typeof next === 'object'
        ? {
            ...acc,
            ...next,
          }
        : next;
    }, {});
    if (!Check(schema, references, value))
      throw new ValueCreateError(
        schema,
        'Intersect produced invalid value. Consider using a default value.',
      );
    return value;
  }
}
function FromIterator$1(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return (function* () {})();
}
function FromLiteral(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return schema.const;
}
function FromNever(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else
    throw new ValueCreateError(
      schema,
      'Never types cannot be created. Consider using a default value.',
    );
}
function FromNot$3(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else throw new ValueCreateError(schema, 'Not types must have a default value');
}
function FromNull(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return null;
}
function FromNumber(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else if (schema.minimum !== void 0) return schema.minimum;
  else return 0;
}
function FromObject$5(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else {
    const required = new Set(schema.required);
    const Acc = {};
    for (const [key, subschema] of Object.entries(schema.properties)) {
      if (!required.has(key)) continue;
      Acc[key] = Visit$5(subschema, references);
    }
    return Acc;
  }
}
function FromPromise$1(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return Promise.resolve(Visit$5(schema.item, references));
}
function FromRecord$5(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return {};
}
function FromRef$5(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return Visit$5(Deref(schema, references), references);
}
function FromRegExp(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else
    throw new ValueCreateError(
      schema,
      'RegExp types cannot be created. Consider using a default value.',
    );
}
function FromString(schema, references) {
  if (schema.pattern !== void 0)
    if (!HasPropertyKey(schema, 'default'))
      throw new ValueCreateError(schema, 'String types with patterns must specify a default value');
    else return FromDefault(schema.default);
  else if (schema.format !== void 0)
    if (!HasPropertyKey(schema, 'default'))
      throw new ValueCreateError(schema, 'String types with formats must specify a default value');
    else return FromDefault(schema.default);
  else if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else if (schema.minLength !== void 0)
    return Array.from({ length: schema.minLength })
      .map(() => ' ')
      .join('');
  else return '';
}
function FromSymbol(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else if ('value' in schema) return Symbol.for(schema.value);
  else return Symbol();
}
function FromTemplateLiteral(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  if (!IsTemplateLiteralFinite(schema))
    throw new ValueCreateError(
      schema,
      'Can only create template literals that produce a finite variants. Consider using a default value.',
    );
  return TemplateLiteralGenerate(schema)[0];
}
function FromThis$5(schema, references) {
  if (recursiveDepth++ > recursiveMaxDepth)
    throw new ValueCreateError(
      schema,
      'Cannot create recursive type as it appears possibly infinite. Consider using a default.',
    );
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return Visit$5(Deref(schema, references), references);
}
function FromTuple$5(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  if (schema.items === void 0) return [];
  else
    return Array.from({ length: schema.minItems }).map((_, index) =>
      Visit$5(schema.items[index], references),
    );
}
function FromUndefined(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return;
}
function FromUnion$5(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else if (schema.anyOf.length === 0)
    throw new Error('ValueCreate.Union: Cannot create Union with zero variants');
  else return Visit$5(schema.anyOf[0], references);
}
function FromUint8Array(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else if (schema.minByteLength !== void 0) return new Uint8Array(schema.minByteLength);
  else return new Uint8Array(0);
}
function FromUnknown(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return {};
}
function FromVoid(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else return;
}
function FromKind(schema, references) {
  if (HasPropertyKey(schema, 'default')) return FromDefault(schema.default);
  else throw new Error('User defined types must specify a default value');
}
function Visit$5(schema, references) {
  const references_ = Pushref(schema, references);
  const schema_ = schema;
  switch (schema_[Kind]) {
    case 'Any':
      return FromAny(schema_, references_);
    case 'Argument':
      return FromArgument(schema_, references_);
    case 'Array':
      return FromArray$5(schema_, references_);
    case 'AsyncIterator':
      return FromAsyncIterator$1(schema_, references_);
    case 'BigInt':
      return FromBigInt(schema_, references_);
    case 'Boolean':
      return FromBoolean(schema_, references_);
    case 'Constructor':
      return FromConstructor$1(schema_, references_);
    case 'Date':
      return FromDate$1(schema_, references_);
    case 'Function':
      return FromFunction$1(schema_, references_);
    case 'Import':
      return FromImport$5(schema_, references_);
    case 'Integer':
      return FromInteger(schema_, references_);
    case 'Intersect':
      return FromIntersect$5(schema_, references_);
    case 'Iterator':
      return FromIterator$1(schema_, references_);
    case 'Literal':
      return FromLiteral(schema_, references_);
    case 'Never':
      return FromNever(schema_, references_);
    case 'Not':
      return FromNot$3(schema_, references_);
    case 'Null':
      return FromNull(schema_, references_);
    case 'Number':
      return FromNumber(schema_, references_);
    case 'Object':
      return FromObject$5(schema_, references_);
    case 'Promise':
      return FromPromise$1(schema_, references_);
    case 'Record':
      return FromRecord$5(schema_, references_);
    case 'Ref':
      return FromRef$5(schema_, references_);
    case 'RegExp':
      return FromRegExp(schema_, references_);
    case 'String':
      return FromString(schema_, references_);
    case 'Symbol':
      return FromSymbol(schema_, references_);
    case 'TemplateLiteral':
      return FromTemplateLiteral(schema_, references_);
    case 'This':
      return FromThis$5(schema_, references_);
    case 'Tuple':
      return FromTuple$5(schema_, references_);
    case 'Undefined':
      return FromUndefined(schema_, references_);
    case 'Union':
      return FromUnion$5(schema_, references_);
    case 'Uint8Array':
      return FromUint8Array(schema_, references_);
    case 'Unknown':
      return FromUnknown(schema_, references_);
    case 'Void':
      return FromVoid(schema_, references_);
    default:
      if (!Has(schema_[Kind])) throw new ValueCreateError(schema_, 'Unknown type');
      return FromKind(schema_, references_);
  }
}
var recursiveMaxDepth = 512;
var recursiveDepth = 0;
/** Creates a value from the given schema */
function Create(...args) {
  recursiveDepth = 0;
  return args.length === 2 ? Visit$5(args[0], args[1]) : Visit$5(args[0], []);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/clean/clean.mjs
function IsCheckable(schema) {
  return IsKind$1(schema) && schema[Kind] !== 'Unsafe';
}
function FromArray$4(schema, references, value) {
  if (!IsArray$2(value)) return value;
  return value.map((value) => Visit$4(schema.items, references, value));
}
function FromImport$4(schema, references, value) {
  const definitions = globalThis.Object.values(schema.$defs);
  const target = schema.$defs[schema.$ref];
  return Visit$4(target, [...references, ...definitions], value);
}
function FromIntersect$4(schema, references, value) {
  const unevaluatedProperties = schema.unevaluatedProperties;
  const composite = schema.allOf
    .map((schema) => Visit$4(schema, references, Clone(value)))
    .reduce(
      (acc, value) =>
        IsObject$2(value)
          ? {
              ...acc,
              ...value,
            }
          : value,
      {},
    );
  if (!IsObject$2(value) || !IsObject$2(composite) || !IsKind$1(unevaluatedProperties))
    return composite;
  const knownkeys = KeyOfPropertyKeys(schema);
  for (const key of Object.getOwnPropertyNames(value)) {
    if (knownkeys.includes(key)) continue;
    if (Check(unevaluatedProperties, references, value[key]))
      composite[key] = Visit$4(unevaluatedProperties, references, value[key]);
  }
  return composite;
}
function FromObject$4(schema, references, value) {
  if (!IsObject$2(value) || IsArray$2(value)) return value;
  const additionalProperties = schema.additionalProperties;
  for (const key of Object.getOwnPropertyNames(value)) {
    if (HasPropertyKey(schema.properties, key)) {
      value[key] = Visit$4(schema.properties[key], references, value[key]);
      continue;
    }
    if (IsKind$1(additionalProperties) && Check(additionalProperties, references, value[key])) {
      value[key] = Visit$4(additionalProperties, references, value[key]);
      continue;
    }
    delete value[key];
  }
  return value;
}
function FromRecord$4(schema, references, value) {
  if (!IsObject$2(value)) return value;
  const additionalProperties = schema.additionalProperties;
  const propertyKeys = Object.getOwnPropertyNames(value);
  const [propertyKey, propertySchema] = Object.entries(schema.patternProperties)[0];
  const propertyKeyTest = new RegExp(propertyKey);
  for (const key of propertyKeys) {
    if (propertyKeyTest.test(key)) {
      value[key] = Visit$4(propertySchema, references, value[key]);
      continue;
    }
    if (IsKind$1(additionalProperties) && Check(additionalProperties, references, value[key])) {
      value[key] = Visit$4(additionalProperties, references, value[key]);
      continue;
    }
    delete value[key];
  }
  return value;
}
function FromRef$4(schema, references, value) {
  return Visit$4(Deref(schema, references), references, value);
}
function FromThis$4(schema, references, value) {
  return Visit$4(Deref(schema, references), references, value);
}
function FromTuple$4(schema, references, value) {
  if (!IsArray$2(value)) return value;
  if (IsUndefined$2(schema.items)) return [];
  const length = Math.min(value.length, schema.items.length);
  for (let i = 0; i < length; i++) value[i] = Visit$4(schema.items[i], references, value[i]);
  return value.length > length ? value.slice(0, length) : value;
}
function FromUnion$4(schema, references, value) {
  for (const inner of schema.anyOf)
    if (IsCheckable(inner) && Check(inner, references, value))
      return Visit$4(inner, references, value);
  return value;
}
function Visit$4(schema, references, value) {
  const references_ = IsString$2(schema.$id) ? Pushref(schema, references) : references;
  const schema_ = schema;
  switch (schema_[Kind]) {
    case 'Array':
      return FromArray$4(schema_, references_, value);
    case 'Import':
      return FromImport$4(schema_, references_, value);
    case 'Intersect':
      return FromIntersect$4(schema_, references_, value);
    case 'Object':
      return FromObject$4(schema_, references_, value);
    case 'Record':
      return FromRecord$4(schema_, references_, value);
    case 'Ref':
      return FromRef$4(schema_, references_, value);
    case 'This':
      return FromThis$4(schema_, references_, value);
    case 'Tuple':
      return FromTuple$4(schema_, references_, value);
    case 'Union':
      return FromUnion$4(schema_, references_, value);
    default:
      return value;
  }
}
/** `[Mutable]` Removes excess properties from a value and returns the result. This function does not check the value and returns an unknown type. You should Check the result before use. Clean is a mutable operation. To avoid mutation, Clone the value first. */
function Clean(...args) {
  return args.length === 3 ? Visit$4(args[0], args[1], args[2]) : Visit$4(args[0], [], args[1]);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/transform/decode.mjs
var TransformDecodeCheckError = class extends TypeBoxError {
  constructor(schema, value, error) {
    super(`Unable to decode value as it does not match the expected schema`);
    this.schema = schema;
    this.value = value;
    this.error = error;
  }
};
var TransformDecodeError = class extends TypeBoxError {
  constructor(schema, path, value, error) {
    super(error instanceof Error ? error.message : 'Unknown error');
    this.schema = schema;
    this.path = path;
    this.value = value;
    this.error = error;
  }
};
function Default$2(schema, path, value) {
  try {
    return IsTransform$1(schema) ? schema[TransformKind].Decode(value) : value;
  } catch (error) {
    throw new TransformDecodeError(schema, path, value, error);
  }
}
function FromArray$3(schema, references, path, value) {
  return IsArray$2(value)
    ? Default$2(
        schema,
        path,
        value.map((value, index) => Visit$3(schema.items, references, `${path}/${index}`, value)),
      )
    : Default$2(schema, path, value);
}
function FromIntersect$3(schema, references, path, value) {
  if (!IsObject$2(value) || IsValueType(value)) return Default$2(schema, path, value);
  const knownEntries = KeyOfPropertyEntries(schema);
  const knownKeys = knownEntries.map((entry) => entry[0]);
  const knownProperties = { ...value };
  for (const [knownKey, knownSchema] of knownEntries)
    if (knownKey in knownProperties)
      knownProperties[knownKey] = Visit$3(
        knownSchema,
        references,
        `${path}/${knownKey}`,
        knownProperties[knownKey],
      );
  if (!IsTransform$1(schema.unevaluatedProperties)) return Default$2(schema, path, knownProperties);
  const unknownKeys = Object.getOwnPropertyNames(knownProperties);
  const unevaluatedProperties = schema.unevaluatedProperties;
  const unknownProperties = { ...knownProperties };
  for (const key of unknownKeys)
    if (!knownKeys.includes(key))
      unknownProperties[key] = Default$2(
        unevaluatedProperties,
        `${path}/${key}`,
        unknownProperties[key],
      );
  return Default$2(schema, path, unknownProperties);
}
function FromImport$3(schema, references, path, value) {
  const additional = globalThis.Object.values(schema.$defs);
  const target = schema.$defs[schema.$ref];
  return Default$2(schema, path, Visit$3(target, [...references, ...additional], path, value));
}
function FromNot$2(schema, references, path, value) {
  return Default$2(schema, path, Visit$3(schema.not, references, path, value));
}
function FromObject$3(schema, references, path, value) {
  if (!IsObject$2(value)) return Default$2(schema, path, value);
  const knownKeys = KeyOfPropertyKeys(schema);
  const knownProperties = { ...value };
  for (const key of knownKeys) {
    if (!HasPropertyKey(knownProperties, key)) continue;
    if (
      IsUndefined$2(knownProperties[key]) &&
      (!IsUndefined$1(schema.properties[key]) ||
        TypeSystemPolicy.IsExactOptionalProperty(knownProperties, key))
    )
      continue;
    knownProperties[key] = Visit$3(
      schema.properties[key],
      references,
      `${path}/${key}`,
      knownProperties[key],
    );
  }
  if (!IsSchema$1(schema.additionalProperties)) return Default$2(schema, path, knownProperties);
  const unknownKeys = Object.getOwnPropertyNames(knownProperties);
  const additionalProperties = schema.additionalProperties;
  const unknownProperties = { ...knownProperties };
  for (const key of unknownKeys)
    if (!knownKeys.includes(key))
      unknownProperties[key] = Default$2(
        additionalProperties,
        `${path}/${key}`,
        unknownProperties[key],
      );
  return Default$2(schema, path, unknownProperties);
}
function FromRecord$3(schema, references, path, value) {
  if (!IsObject$2(value)) return Default$2(schema, path, value);
  const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0];
  const knownKeys = new RegExp(pattern);
  const knownProperties = { ...value };
  for (const key of Object.getOwnPropertyNames(value))
    if (knownKeys.test(key))
      knownProperties[key] = Visit$3(
        schema.patternProperties[pattern],
        references,
        `${path}/${key}`,
        knownProperties[key],
      );
  if (!IsSchema$1(schema.additionalProperties)) return Default$2(schema, path, knownProperties);
  const unknownKeys = Object.getOwnPropertyNames(knownProperties);
  const additionalProperties = schema.additionalProperties;
  const unknownProperties = { ...knownProperties };
  for (const key of unknownKeys)
    if (!knownKeys.test(key))
      unknownProperties[key] = Default$2(
        additionalProperties,
        `${path}/${key}`,
        unknownProperties[key],
      );
  return Default$2(schema, path, unknownProperties);
}
function FromRef$3(schema, references, path, value) {
  return Default$2(schema, path, Visit$3(Deref(schema, references), references, path, value));
}
function FromThis$3(schema, references, path, value) {
  return Default$2(schema, path, Visit$3(Deref(schema, references), references, path, value));
}
function FromTuple$3(schema, references, path, value) {
  return IsArray$2(value) && IsArray$2(schema.items)
    ? Default$2(
        schema,
        path,
        schema.items.map((schema, index) =>
          Visit$3(schema, references, `${path}/${index}`, value[index]),
        ),
      )
    : Default$2(schema, path, value);
}
function FromUnion$3(schema, references, path, value) {
  for (const subschema of schema.anyOf) {
    if (!Check(subschema, references, value)) continue;
    return Default$2(schema, path, Visit$3(subschema, references, path, value));
  }
  return Default$2(schema, path, value);
}
function Visit$3(schema, references, path, value) {
  const references_ = Pushref(schema, references);
  const schema_ = schema;
  switch (schema[Kind]) {
    case 'Array':
      return FromArray$3(schema_, references_, path, value);
    case 'Import':
      return FromImport$3(schema_, references_, path, value);
    case 'Intersect':
      return FromIntersect$3(schema_, references_, path, value);
    case 'Not':
      return FromNot$2(schema_, references_, path, value);
    case 'Object':
      return FromObject$3(schema_, references_, path, value);
    case 'Record':
      return FromRecord$3(schema_, references_, path, value);
    case 'Ref':
      return FromRef$3(schema_, references_, path, value);
    case 'Symbol':
      return Default$2(schema_, path, value);
    case 'This':
      return FromThis$3(schema_, references_, path, value);
    case 'Tuple':
      return FromTuple$3(schema_, references_, path, value);
    case 'Union':
      return FromUnion$3(schema_, references_, path, value);
    default:
      return Default$2(schema_, path, value);
  }
}
/**
 * `[Internal]` Decodes the value and returns the result. This function requires that
 * the caller `Check` the value before use. Passing unchecked values may result in
 * undefined behavior. Refer to the `Value.Decode()` for implementation details.
 */
function TransformDecode(schema, references, value) {
  return Visit$3(schema, references, '', value);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/transform/encode.mjs
var TransformEncodeCheckError = class extends TypeBoxError {
  constructor(schema, value, error) {
    super(`The encoded value does not match the expected schema`);
    this.schema = schema;
    this.value = value;
    this.error = error;
  }
};
var TransformEncodeError = class extends TypeBoxError {
  constructor(schema, path, value, error) {
    super(`${error instanceof Error ? error.message : 'Unknown error'}`);
    this.schema = schema;
    this.path = path;
    this.value = value;
    this.error = error;
  }
};
function Default$1(schema, path, value) {
  try {
    return IsTransform$1(schema) ? schema[TransformKind].Encode(value) : value;
  } catch (error) {
    throw new TransformEncodeError(schema, path, value, error);
  }
}
function FromArray$2(schema, references, path, value) {
  const defaulted = Default$1(schema, path, value);
  return IsArray$2(defaulted)
    ? defaulted.map((value, index) => Visit$2(schema.items, references, `${path}/${index}`, value))
    : defaulted;
}
function FromImport$2(schema, references, path, value) {
  const additional = globalThis.Object.values(schema.$defs);
  const target = schema.$defs[schema.$ref];
  const result = Default$1(schema, path, value);
  return Visit$2(target, [...references, ...additional], path, result);
}
function FromIntersect$2(schema, references, path, value) {
  const defaulted = Default$1(schema, path, value);
  if (!IsObject$2(value) || IsValueType(value)) return defaulted;
  const knownEntries = KeyOfPropertyEntries(schema);
  const knownKeys = knownEntries.map((entry) => entry[0]);
  const knownProperties = { ...defaulted };
  for (const [knownKey, knownSchema] of knownEntries)
    if (knownKey in knownProperties)
      knownProperties[knownKey] = Visit$2(
        knownSchema,
        references,
        `${path}/${knownKey}`,
        knownProperties[knownKey],
      );
  if (!IsTransform$1(schema.unevaluatedProperties)) return knownProperties;
  const unknownKeys = Object.getOwnPropertyNames(knownProperties);
  const unevaluatedProperties = schema.unevaluatedProperties;
  const properties = { ...knownProperties };
  for (const key of unknownKeys)
    if (!knownKeys.includes(key))
      properties[key] = Default$1(unevaluatedProperties, `${path}/${key}`, properties[key]);
  return properties;
}
function FromNot$1(schema, references, path, value) {
  return Default$1(schema.not, path, Default$1(schema, path, value));
}
function FromObject$2(schema, references, path, value) {
  const defaulted = Default$1(schema, path, value);
  if (!IsObject$2(defaulted)) return defaulted;
  const knownKeys = KeyOfPropertyKeys(schema);
  const knownProperties = { ...defaulted };
  for (const key of knownKeys) {
    if (!HasPropertyKey(knownProperties, key)) continue;
    if (
      IsUndefined$2(knownProperties[key]) &&
      (!IsUndefined$1(schema.properties[key]) ||
        TypeSystemPolicy.IsExactOptionalProperty(knownProperties, key))
    )
      continue;
    knownProperties[key] = Visit$2(
      schema.properties[key],
      references,
      `${path}/${key}`,
      knownProperties[key],
    );
  }
  if (!IsSchema$1(schema.additionalProperties)) return knownProperties;
  const unknownKeys = Object.getOwnPropertyNames(knownProperties);
  const additionalProperties = schema.additionalProperties;
  const properties = { ...knownProperties };
  for (const key of unknownKeys)
    if (!knownKeys.includes(key))
      properties[key] = Default$1(additionalProperties, `${path}/${key}`, properties[key]);
  return properties;
}
function FromRecord$2(schema, references, path, value) {
  const defaulted = Default$1(schema, path, value);
  if (!IsObject$2(value)) return defaulted;
  const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0];
  const knownKeys = new RegExp(pattern);
  const knownProperties = { ...defaulted };
  for (const key of Object.getOwnPropertyNames(value))
    if (knownKeys.test(key))
      knownProperties[key] = Visit$2(
        schema.patternProperties[pattern],
        references,
        `${path}/${key}`,
        knownProperties[key],
      );
  if (!IsSchema$1(schema.additionalProperties)) return knownProperties;
  const unknownKeys = Object.getOwnPropertyNames(knownProperties);
  const additionalProperties = schema.additionalProperties;
  const properties = { ...knownProperties };
  for (const key of unknownKeys)
    if (!knownKeys.test(key))
      properties[key] = Default$1(additionalProperties, `${path}/${key}`, properties[key]);
  return properties;
}
function FromRef$2(schema, references, path, value) {
  return Default$1(schema, path, Visit$2(Deref(schema, references), references, path, value));
}
function FromThis$2(schema, references, path, value) {
  return Default$1(schema, path, Visit$2(Deref(schema, references), references, path, value));
}
function FromTuple$2(schema, references, path, value) {
  const value1 = Default$1(schema, path, value);
  return IsArray$2(schema.items)
    ? schema.items.map((schema, index) =>
        Visit$2(schema, references, `${path}/${index}`, value1[index]),
      )
    : [];
}
function FromUnion$2(schema, references, path, value) {
  for (const subschema of schema.anyOf) {
    if (!Check(subschema, references, value)) continue;
    return Default$1(schema, path, Visit$2(subschema, references, path, value));
  }
  for (const subschema of schema.anyOf) {
    const value1 = Visit$2(subschema, references, path, value);
    if (!Check(schema, references, value1)) continue;
    return Default$1(schema, path, value1);
  }
  return Default$1(schema, path, value);
}
function Visit$2(schema, references, path, value) {
  const references_ = Pushref(schema, references);
  const schema_ = schema;
  switch (schema[Kind]) {
    case 'Array':
      return FromArray$2(schema_, references_, path, value);
    case 'Import':
      return FromImport$2(schema_, references_, path, value);
    case 'Intersect':
      return FromIntersect$2(schema_, references_, path, value);
    case 'Not':
      return FromNot$1(schema_, references_, path, value);
    case 'Object':
      return FromObject$2(schema_, references_, path, value);
    case 'Record':
      return FromRecord$2(schema_, references_, path, value);
    case 'Ref':
      return FromRef$2(schema_, references_, path, value);
    case 'This':
      return FromThis$2(schema_, references_, path, value);
    case 'Tuple':
      return FromTuple$2(schema_, references_, path, value);
    case 'Union':
      return FromUnion$2(schema_, references_, path, value);
    default:
      return Default$1(schema_, path, value);
  }
}
/**
 * `[Internal]` Encodes the value and returns the result. This function expects the
 * caller to pass a statically checked value. This function does not check the encoded
 * result, meaning the result should be passed to `Check` before use. Refer to the
 * `Value.Encode()` function for implementation details.
 */
function TransformEncode(schema, references, value) {
  return Visit$2(schema, references, '', value);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/transform/has.mjs
function FromArray$1(schema, references) {
  return IsTransform$1(schema) || Visit$1(schema.items, references);
}
function FromAsyncIterator(schema, references) {
  return IsTransform$1(schema) || Visit$1(schema.items, references);
}
function FromConstructor(schema, references) {
  return (
    IsTransform$1(schema) ||
    Visit$1(schema.returns, references) ||
    schema.parameters.some((schema) => Visit$1(schema, references))
  );
}
function FromFunction(schema, references) {
  return (
    IsTransform$1(schema) ||
    Visit$1(schema.returns, references) ||
    schema.parameters.some((schema) => Visit$1(schema, references))
  );
}
function FromIntersect$1(schema, references) {
  return (
    IsTransform$1(schema) ||
    IsTransform$1(schema.unevaluatedProperties) ||
    schema.allOf.some((schema) => Visit$1(schema, references))
  );
}
function FromImport$1(schema, references) {
  const additional = globalThis.Object.getOwnPropertyNames(schema.$defs).reduce(
    (result, key) => [...result, schema.$defs[key]],
    [],
  );
  const target = schema.$defs[schema.$ref];
  return IsTransform$1(schema) || Visit$1(target, [...additional, ...references]);
}
function FromIterator(schema, references) {
  return IsTransform$1(schema) || Visit$1(schema.items, references);
}
function FromNot(schema, references) {
  return IsTransform$1(schema) || Visit$1(schema.not, references);
}
function FromObject$1(schema, references) {
  return (
    IsTransform$1(schema) ||
    Object.values(schema.properties).some((schema) => Visit$1(schema, references)) ||
    (IsSchema$1(schema.additionalProperties) && Visit$1(schema.additionalProperties, references))
  );
}
function FromPromise(schema, references) {
  return IsTransform$1(schema) || Visit$1(schema.item, references);
}
function FromRecord$1(schema, references) {
  const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0];
  const property = schema.patternProperties[pattern];
  return (
    IsTransform$1(schema) ||
    Visit$1(property, references) ||
    (IsSchema$1(schema.additionalProperties) && IsTransform$1(schema.additionalProperties))
  );
}
function FromRef$1(schema, references) {
  if (IsTransform$1(schema)) return true;
  return Visit$1(Deref(schema, references), references);
}
function FromThis$1(schema, references) {
  if (IsTransform$1(schema)) return true;
  return Visit$1(Deref(schema, references), references);
}
function FromTuple$1(schema, references) {
  return (
    IsTransform$1(schema) ||
    (!IsUndefined$2(schema.items) && schema.items.some((schema) => Visit$1(schema, references)))
  );
}
function FromUnion$1(schema, references) {
  return IsTransform$1(schema) || schema.anyOf.some((schema) => Visit$1(schema, references));
}
function Visit$1(schema, references) {
  const references_ = Pushref(schema, references);
  const schema_ = schema;
  if (schema.$id && visited.has(schema.$id)) return false;
  if (schema.$id) visited.add(schema.$id);
  switch (schema[Kind]) {
    case 'Array':
      return FromArray$1(schema_, references_);
    case 'AsyncIterator':
      return FromAsyncIterator(schema_, references_);
    case 'Constructor':
      return FromConstructor(schema_, references_);
    case 'Function':
      return FromFunction(schema_, references_);
    case 'Import':
      return FromImport$1(schema_, references_);
    case 'Intersect':
      return FromIntersect$1(schema_, references_);
    case 'Iterator':
      return FromIterator(schema_, references_);
    case 'Not':
      return FromNot(schema_, references_);
    case 'Object':
      return FromObject$1(schema_, references_);
    case 'Promise':
      return FromPromise(schema_, references_);
    case 'Record':
      return FromRecord$1(schema_, references_);
    case 'Ref':
      return FromRef$1(schema_, references_);
    case 'This':
      return FromThis$1(schema_, references_);
    case 'Tuple':
      return FromTuple$1(schema_, references_);
    case 'Union':
      return FromUnion$1(schema_, references_);
    default:
      return IsTransform$1(schema);
  }
}
var visited = /* @__PURE__ */ new Set();
/** Returns true if this schema contains a transform codec */
function HasTransform(schema, references) {
  visited.clear();
  return Visit$1(schema, references);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/decode/decode.mjs
/** Decodes a value or throws if error */
function Decode(...args) {
  const [schema, references, value] =
    args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]];
  if (!Check(schema, references, value))
    throw new TransformDecodeCheckError(schema, value, Errors(schema, references, value).First());
  return HasTransform(schema, references) ? TransformDecode(schema, references, value) : value;
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/default/default.mjs
function ValueOrDefault(schema, value) {
  const defaultValue = HasPropertyKey(schema, 'default') ? schema.default : void 0;
  const clone = IsFunction$2(defaultValue) ? defaultValue() : Clone(defaultValue);
  return IsUndefined$2(value)
    ? clone
    : IsObject$2(value) && IsObject$2(clone)
      ? Object.assign(clone, value)
      : value;
}
function HasDefaultProperty(schema) {
  return IsKind$1(schema) && 'default' in schema;
}
function FromArray(schema, references, value) {
  if (IsArray$2(value)) {
    for (let i = 0; i < value.length; i++) value[i] = Visit(schema.items, references, value[i]);
    return value;
  }
  const defaulted = ValueOrDefault(schema, value);
  if (!IsArray$2(defaulted)) return defaulted;
  for (let i = 0; i < defaulted.length; i++)
    defaulted[i] = Visit(schema.items, references, defaulted[i]);
  return defaulted;
}
function FromDate(schema, references, value) {
  return IsDate$2(value) ? value : ValueOrDefault(schema, value);
}
function FromImport(schema, references, value) {
  const definitions = globalThis.Object.values(schema.$defs);
  const target = schema.$defs[schema.$ref];
  return Visit(target, [...references, ...definitions], value);
}
function FromIntersect(schema, references, value) {
  const defaulted = ValueOrDefault(schema, value);
  return schema.allOf.reduce((acc, schema) => {
    const next = Visit(schema, references, defaulted);
    return IsObject$2(next)
      ? {
          ...acc,
          ...next,
        }
      : next;
  }, {});
}
function FromObject(schema, references, value) {
  const defaulted = ValueOrDefault(schema, value);
  if (!IsObject$2(defaulted)) return defaulted;
  const knownPropertyKeys = Object.getOwnPropertyNames(schema.properties);
  for (const key of knownPropertyKeys) {
    if (IsUndefined$2(Visit(schema.properties[key], references, defaulted[key]))) continue;
    defaulted[key] = Visit(schema.properties[key], references, defaulted[key]);
  }
  if (!HasDefaultProperty(schema.additionalProperties)) return defaulted;
  for (const key of Object.getOwnPropertyNames(defaulted)) {
    if (knownPropertyKeys.includes(key)) continue;
    defaulted[key] = Visit(schema.additionalProperties, references, defaulted[key]);
  }
  return defaulted;
}
function FromRecord(schema, references, value) {
  const defaulted = ValueOrDefault(schema, value);
  if (!IsObject$2(defaulted)) return defaulted;
  const additionalPropertiesSchema = schema.additionalProperties;
  const [propertyKeyPattern, propertySchema] = Object.entries(schema.patternProperties)[0];
  const knownPropertyKey = new RegExp(propertyKeyPattern);
  for (const key of Object.getOwnPropertyNames(defaulted)) {
    if (!(knownPropertyKey.test(key) && HasDefaultProperty(propertySchema))) continue;
    defaulted[key] = Visit(propertySchema, references, defaulted[key]);
  }
  if (!HasDefaultProperty(additionalPropertiesSchema)) return defaulted;
  for (const key of Object.getOwnPropertyNames(defaulted)) {
    if (knownPropertyKey.test(key)) continue;
    defaulted[key] = Visit(additionalPropertiesSchema, references, defaulted[key]);
  }
  return defaulted;
}
function FromRef(schema, references, value) {
  return Visit(Deref(schema, references), references, ValueOrDefault(schema, value));
}
function FromThis(schema, references, value) {
  return Visit(Deref(schema, references), references, value);
}
function FromTuple(schema, references, value) {
  const defaulted = ValueOrDefault(schema, value);
  if (!IsArray$2(defaulted) || IsUndefined$2(schema.items)) return defaulted;
  const [items, max] = [schema.items, Math.max(schema.items.length, defaulted.length)];
  for (let i = 0; i < max; i++)
    if (i < items.length) defaulted[i] = Visit(items[i], references, defaulted[i]);
  return defaulted;
}
function FromUnion(schema, references, value) {
  const defaulted = ValueOrDefault(schema, value);
  for (const inner of schema.anyOf) {
    const result = Visit(inner, references, Clone(defaulted));
    if (Check(inner, references, result)) return result;
  }
  return defaulted;
}
function Visit(schema, references, value) {
  const references_ = Pushref(schema, references);
  const schema_ = schema;
  switch (schema_[Kind]) {
    case 'Array':
      return FromArray(schema_, references_, value);
    case 'Date':
      return FromDate(schema_, references_, value);
    case 'Import':
      return FromImport(schema_, references_, value);
    case 'Intersect':
      return FromIntersect(schema_, references_, value);
    case 'Object':
      return FromObject(schema_, references_, value);
    case 'Record':
      return FromRecord(schema_, references_, value);
    case 'Ref':
      return FromRef(schema_, references_, value);
    case 'This':
      return FromThis(schema_, references_, value);
    case 'Tuple':
      return FromTuple(schema_, references_, value);
    case 'Union':
      return FromUnion(schema_, references_, value);
    default:
      return ValueOrDefault(schema_, value);
  }
}
/** `[Mutable]` Generates missing properties on a value using default schema annotations if available. This function does not check the value and returns an unknown type. You should Check the result before use. Default is a mutable operation. To avoid mutation, Clone the value first. */
function Default(...args) {
  return args.length === 3 ? Visit(args[0], args[1], args[2]) : Visit(args[0], [], args[1]);
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/value/encode/encode.mjs
/** Encodes a value or throws if error */
function Encode(...args) {
  const [schema, references, value] =
    args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]];
  const encoded = HasTransform(schema, references)
    ? TransformEncode(schema, references, value)
    : value;
  if (!Check(schema, references, encoded))
    throw new TransformEncodeCheckError(
      schema,
      encoded,
      Errors(schema, references, encoded).First(),
    );
  return encoded;
}
//#endregion
//#region ../../node_modules/.pnpm/@sinclair+typebox@0.34.48/node_modules/@sinclair/typebox/build/esm/compiler/compiler.mjs
var TypeCheck = class {
  constructor(schema, references, checkFunc, code) {
    this.schema = schema;
    this.references = references;
    this.checkFunc = checkFunc;
    this.code = code;
    this.hasTransform = HasTransform(schema, references);
  }
  /** Returns the generated assertion code used to validate this type. */
  Code() {
    return this.code;
  }
  /** Returns the schema type used to validate */
  Schema() {
    return this.schema;
  }
  /** Returns reference types used to validate */
  References() {
    return this.references;
  }
  /** Returns an iterator for each error in this value. */
  Errors(value) {
    return Errors(this.schema, this.references, value);
  }
  /** Returns true if the value matches the compiled type. */
  Check(value) {
    return this.checkFunc(value);
  }
  /** Decodes a value or throws if error */
  Decode(value) {
    if (!this.checkFunc(value))
      throw new TransformDecodeCheckError(this.schema, value, this.Errors(value).First());
    return this.hasTransform ? TransformDecode(this.schema, this.references, value) : value;
  }
  /** Encodes a value or throws if error */
  Encode(value) {
    const encoded = this.hasTransform
      ? TransformEncode(this.schema, this.references, value)
      : value;
    if (!this.checkFunc(encoded))
      throw new TransformEncodeCheckError(this.schema, value, this.Errors(value).First());
    return encoded;
  }
};
var Character;
(function (Character) {
  function DollarSign(code) {
    return code === 36;
  }
  Character.DollarSign = DollarSign;
  function IsUnderscore(code) {
    return code === 95;
  }
  Character.IsUnderscore = IsUnderscore;
  function IsAlpha(code) {
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
  }
  Character.IsAlpha = IsAlpha;
  function IsNumeric(code) {
    return code >= 48 && code <= 57;
  }
  Character.IsNumeric = IsNumeric;
})(Character || (Character = {}));
var MemberExpression;
(function (MemberExpression) {
  function IsFirstCharacterNumeric(value) {
    if (value.length === 0) return false;
    return Character.IsNumeric(value.charCodeAt(0));
  }
  function IsAccessor(value) {
    if (IsFirstCharacterNumeric(value)) return false;
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      if (
        !(
          Character.IsAlpha(code) ||
          Character.IsNumeric(code) ||
          Character.DollarSign(code) ||
          Character.IsUnderscore(code)
        )
      )
        return false;
    }
    return true;
  }
  function EscapeHyphen(key) {
    return key.replace(/'/g, "\\'");
  }
  function Encode(object, key) {
    return IsAccessor(key) ? `${object}.${key}` : `${object}['${EscapeHyphen(key)}']`;
  }
  MemberExpression.Encode = Encode;
})(MemberExpression || (MemberExpression = {}));
var Identifier;
(function (Identifier) {
  function Encode($id) {
    const buffer = [];
    for (let i = 0; i < $id.length; i++) {
      const code = $id.charCodeAt(i);
      if (Character.IsNumeric(code) || Character.IsAlpha(code)) buffer.push($id.charAt(i));
      else buffer.push(`_${code}_`);
    }
    return buffer.join('').replace(/__/g, '_');
  }
  Identifier.Encode = Encode;
})(Identifier || (Identifier = {}));
var LiteralString;
(function (LiteralString) {
  function Escape(content) {
    return content.replace(/'/g, "\\'");
  }
  LiteralString.Escape = Escape;
})(LiteralString || (LiteralString = {}));
var TypeCompilerUnknownTypeError = class extends TypeBoxError {
  constructor(schema) {
    super('Unknown type');
    this.schema = schema;
  }
};
var TypeCompilerTypeGuardError = class extends TypeBoxError {
  constructor(schema) {
    super('Preflight validation check failed to guard for the given schema');
    this.schema = schema;
  }
};
var Policy;
(function (Policy) {
  function IsExactOptionalProperty(value, key, expression) {
    return TypeSystemPolicy.ExactOptionalPropertyTypes
      ? `('${key}' in ${value} ? ${expression} : true)`
      : `(${MemberExpression.Encode(value, key)} !== undefined ? ${expression} : true)`;
  }
  Policy.IsExactOptionalProperty = IsExactOptionalProperty;
  function IsObjectLike(value) {
    return !TypeSystemPolicy.AllowArrayObject
      ? `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}))`
      : `(typeof ${value} === 'object' && ${value} !== null)`;
  }
  Policy.IsObjectLike = IsObjectLike;
  function IsRecordLike(value) {
    return !TypeSystemPolicy.AllowArrayObject
      ? `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}) && !(${value} instanceof Date) && !(${value} instanceof Uint8Array))`
      : `(typeof ${value} === 'object' && ${value} !== null && !(${value} instanceof Date) && !(${value} instanceof Uint8Array))`;
  }
  Policy.IsRecordLike = IsRecordLike;
  function IsNumberLike(value) {
    return TypeSystemPolicy.AllowNaN ? `typeof ${value} === 'number'` : `Number.isFinite(${value})`;
  }
  Policy.IsNumberLike = IsNumberLike;
  function IsVoidLike(value) {
    return TypeSystemPolicy.AllowNullVoid
      ? `(${value} === undefined || ${value} === null)`
      : `${value} === undefined`;
  }
  Policy.IsVoidLike = IsVoidLike;
})(Policy || (Policy = {}));
/** Compiles Types for Runtime Type Checking */
var TypeCompiler;
(function (TypeCompiler) {
  function IsAnyOrUnknown(schema) {
    return schema[Kind] === 'Any' || schema[Kind] === 'Unknown';
  }
  function* FromAny(schema, references, value) {
    yield 'true';
  }
  function* FromArgument(schema, references, value) {
    yield 'true';
  }
  function* FromArray(schema, references, value) {
    yield `Array.isArray(${value})`;
    const [parameter, accumulator] = [
      CreateParameter('value', 'any'),
      CreateParameter('acc', 'number'),
    ];
    if (IsNumber$2(schema.maxItems)) yield `${value}.length <= ${schema.maxItems}`;
    if (IsNumber$2(schema.minItems)) yield `${value}.length >= ${schema.minItems}`;
    yield `((array) => { for(const ${parameter} of array) if(!(${CreateExpression(schema.items, references, 'value')})) { return false }; return true; })(${value})`;
    if (
      IsSchema(schema.contains) ||
      IsNumber$2(schema.minContains) ||
      IsNumber$2(schema.maxContains)
    ) {
      const checkExpression = CreateExpression(
        IsSchema(schema.contains) ? schema.contains : Never(),
        references,
        'value',
      );
      const checkMinContains = IsNumber$2(schema.minContains)
        ? [`(count >= ${schema.minContains})`]
        : [];
      const checkMaxContains = IsNumber$2(schema.maxContains)
        ? [`(count <= ${schema.maxContains})`]
        : [];
      yield `((${parameter}) => { ${`const count = value.reduce((${accumulator}, ${parameter}) => ${checkExpression} ? acc + 1 : acc, 0)`}; return ${[
        `(count > 0)`,
        ...checkMinContains,
        ...checkMaxContains,
      ].join(' && ')}})(${value})`;
    }
    if (schema.uniqueItems === true)
      yield `((${parameter}) => { const set = new Set(); for(const element of value) { const hashed = hash(element); if(set.has(hashed)) { return false } else { set.add(hashed) } } return true } )(${value})`;
  }
  function* FromAsyncIterator(schema, references, value) {
    yield `(typeof value === 'object' && Symbol.asyncIterator in ${value})`;
  }
  function* FromBigInt(schema, references, value) {
    yield `(typeof ${value} === 'bigint')`;
    if (IsBigInt$2(schema.exclusiveMaximum)) yield `${value} < BigInt(${schema.exclusiveMaximum})`;
    if (IsBigInt$2(schema.exclusiveMinimum)) yield `${value} > BigInt(${schema.exclusiveMinimum})`;
    if (IsBigInt$2(schema.maximum)) yield `${value} <= BigInt(${schema.maximum})`;
    if (IsBigInt$2(schema.minimum)) yield `${value} >= BigInt(${schema.minimum})`;
    if (IsBigInt$2(schema.multipleOf)) yield `(${value} % BigInt(${schema.multipleOf})) === 0`;
  }
  function* FromBoolean(schema, references, value) {
    yield `(typeof ${value} === 'boolean')`;
  }
  function* FromConstructor(schema, references, value) {
    yield* Visit(schema.returns, references, `${value}.prototype`);
  }
  function* FromDate(schema, references, value) {
    yield `(${value} instanceof Date) && Number.isFinite(${value}.getTime())`;
    if (IsNumber$2(schema.exclusiveMaximumTimestamp))
      yield `${value}.getTime() < ${schema.exclusiveMaximumTimestamp}`;
    if (IsNumber$2(schema.exclusiveMinimumTimestamp))
      yield `${value}.getTime() > ${schema.exclusiveMinimumTimestamp}`;
    if (IsNumber$2(schema.maximumTimestamp))
      yield `${value}.getTime() <= ${schema.maximumTimestamp}`;
    if (IsNumber$2(schema.minimumTimestamp))
      yield `${value}.getTime() >= ${schema.minimumTimestamp}`;
    if (IsNumber$2(schema.multipleOfTimestamp))
      yield `(${value}.getTime() % ${schema.multipleOfTimestamp}) === 0`;
  }
  function* FromFunction(schema, references, value) {
    yield `(typeof ${value} === 'function')`;
  }
  function* FromImport(schema, references, value) {
    const members = globalThis.Object.getOwnPropertyNames(schema.$defs).reduce((result, key) => {
      return [...result, schema.$defs[key]];
    }, []);
    yield* Visit(Ref(schema.$ref), [...references, ...members], value);
  }
  function* FromInteger(schema, references, value) {
    yield `Number.isInteger(${value})`;
    if (IsNumber$2(schema.exclusiveMaximum)) yield `${value} < ${schema.exclusiveMaximum}`;
    if (IsNumber$2(schema.exclusiveMinimum)) yield `${value} > ${schema.exclusiveMinimum}`;
    if (IsNumber$2(schema.maximum)) yield `${value} <= ${schema.maximum}`;
    if (IsNumber$2(schema.minimum)) yield `${value} >= ${schema.minimum}`;
    if (IsNumber$2(schema.multipleOf)) yield `(${value} % ${schema.multipleOf}) === 0`;
  }
  function* FromIntersect(schema, references, value) {
    const check1 = schema.allOf
      .map((schema) => CreateExpression(schema, references, value))
      .join(' && ');
    if (schema.unevaluatedProperties === false)
      yield `(${check1} && ${`Object.getOwnPropertyNames(${value}).every(key => ${CreateVariable(`${new RegExp(KeyOfPattern(schema))};`)}.test(key))`})`;
    else if (IsSchema(schema.unevaluatedProperties))
      yield `(${check1} && ${`Object.getOwnPropertyNames(${value}).every(key => ${CreateVariable(`${new RegExp(KeyOfPattern(schema))};`)}.test(key) || ${CreateExpression(schema.unevaluatedProperties, references, `${value}[key]`)})`})`;
    else yield `(${check1})`;
  }
  function* FromIterator(schema, references, value) {
    yield `(typeof value === 'object' && Symbol.iterator in ${value})`;
  }
  function* FromLiteral(schema, references, value) {
    if (typeof schema.const === 'number' || typeof schema.const === 'boolean')
      yield `(${value} === ${schema.const})`;
    else yield `(${value} === '${LiteralString.Escape(schema.const)}')`;
  }
  function* FromNever(schema, references, value) {
    yield `false`;
  }
  function* FromNot(schema, references, value) {
    yield `(!${CreateExpression(schema.not, references, value)})`;
  }
  function* FromNull(schema, references, value) {
    yield `(${value} === null)`;
  }
  function* FromNumber(schema, references, value) {
    yield Policy.IsNumberLike(value);
    if (IsNumber$2(schema.exclusiveMaximum)) yield `${value} < ${schema.exclusiveMaximum}`;
    if (IsNumber$2(schema.exclusiveMinimum)) yield `${value} > ${schema.exclusiveMinimum}`;
    if (IsNumber$2(schema.maximum)) yield `${value} <= ${schema.maximum}`;
    if (IsNumber$2(schema.minimum)) yield `${value} >= ${schema.minimum}`;
    if (IsNumber$2(schema.multipleOf)) yield `(${value} % ${schema.multipleOf}) === 0`;
  }
  function* FromObject(schema, references, value) {
    yield Policy.IsObjectLike(value);
    if (IsNumber$2(schema.minProperties))
      yield `Object.getOwnPropertyNames(${value}).length >= ${schema.minProperties}`;
    if (IsNumber$2(schema.maxProperties))
      yield `Object.getOwnPropertyNames(${value}).length <= ${schema.maxProperties}`;
    const knownKeys = Object.getOwnPropertyNames(schema.properties);
    for (const knownKey of knownKeys) {
      const memberExpression = MemberExpression.Encode(value, knownKey);
      const property = schema.properties[knownKey];
      if (schema.required && schema.required.includes(knownKey)) {
        yield* Visit(property, references, memberExpression);
        if (ExtendsUndefinedCheck(property) || IsAnyOrUnknown(property))
          yield `('${knownKey}' in ${value})`;
      } else {
        const expression = CreateExpression(property, references, memberExpression);
        yield Policy.IsExactOptionalProperty(value, knownKey, expression);
      }
    }
    if (schema.additionalProperties === false)
      if (schema.required && schema.required.length === knownKeys.length)
        yield `Object.getOwnPropertyNames(${value}).length === ${knownKeys.length}`;
      else
        yield `Object.getOwnPropertyNames(${value}).every(key => ${`[${knownKeys.map((key) => `'${key}'`).join(', ')}]`}.includes(key))`;
    if (typeof schema.additionalProperties === 'object') {
      const expression = CreateExpression(schema.additionalProperties, references, `${value}[key]`);
      yield `(Object.getOwnPropertyNames(${value}).every(key => ${`[${knownKeys.map((key) => `'${key}'`).join(', ')}]`}.includes(key) || ${expression}))`;
    }
  }
  function* FromPromise(schema, references, value) {
    yield `${value} instanceof Promise`;
  }
  function* FromRecord(schema, references, value) {
    yield Policy.IsRecordLike(value);
    if (IsNumber$2(schema.minProperties))
      yield `Object.getOwnPropertyNames(${value}).length >= ${schema.minProperties}`;
    if (IsNumber$2(schema.maxProperties))
      yield `Object.getOwnPropertyNames(${value}).length <= ${schema.maxProperties}`;
    const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0];
    yield `(Object.entries(${value}).every(([key, value]) => ${`(${CreateVariable(`${new RegExp(patternKey)}`)}.test(key) ? ${CreateExpression(patternSchema, references, 'value')} : ${IsSchema(schema.additionalProperties) ? CreateExpression(schema.additionalProperties, references, value) : schema.additionalProperties === false ? 'false' : 'true'})`}))`;
  }
  function* FromRef(schema, references, value) {
    const target = Deref(schema, references);
    if (state.functions.has(schema.$ref))
      return yield `${CreateFunctionName(schema.$ref)}(${value})`;
    yield* Visit(target, references, value);
  }
  function* FromRegExp(schema, references, value) {
    const variable = CreateVariable(`${new RegExp(schema.source, schema.flags)};`);
    yield `(typeof ${value} === 'string')`;
    if (IsNumber$2(schema.maxLength)) yield `${value}.length <= ${schema.maxLength}`;
    if (IsNumber$2(schema.minLength)) yield `${value}.length >= ${schema.minLength}`;
    yield `${variable}.test(${value})`;
  }
  function* FromString(schema, references, value) {
    yield `(typeof ${value} === 'string')`;
    if (IsNumber$2(schema.maxLength)) yield `${value}.length <= ${schema.maxLength}`;
    if (IsNumber$2(schema.minLength)) yield `${value}.length >= ${schema.minLength}`;
    if (schema.pattern !== void 0)
      yield `${CreateVariable(`${new RegExp(schema.pattern)};`)}.test(${value})`;
    if (schema.format !== void 0) yield `format('${schema.format}', ${value})`;
  }
  function* FromSymbol(schema, references, value) {
    yield `(typeof ${value} === 'symbol')`;
  }
  function* FromTemplateLiteral(schema, references, value) {
    yield `(typeof ${value} === 'string')`;
    yield `${CreateVariable(`${new RegExp(schema.pattern)};`)}.test(${value})`;
  }
  function* FromThis(schema, references, value) {
    yield `${CreateFunctionName(schema.$ref)}(${value})`;
  }
  function* FromTuple(schema, references, value) {
    yield `Array.isArray(${value})`;
    if (schema.items === void 0) return yield `${value}.length === 0`;
    yield `(${value}.length === ${schema.maxItems})`;
    for (let i = 0; i < schema.items.length; i++)
      yield `${CreateExpression(schema.items[i], references, `${value}[${i}]`)}`;
  }
  function* FromUndefined(schema, references, value) {
    yield `${value} === undefined`;
  }
  function* FromUnion(schema, references, value) {
    yield `(${schema.anyOf.map((schema) => CreateExpression(schema, references, value)).join(' || ')})`;
  }
  function* FromUint8Array(schema, references, value) {
    yield `${value} instanceof Uint8Array`;
    if (IsNumber$2(schema.maxByteLength)) yield `(${value}.length <= ${schema.maxByteLength})`;
    if (IsNumber$2(schema.minByteLength)) yield `(${value}.length >= ${schema.minByteLength})`;
  }
  function* FromUnknown(schema, references, value) {
    yield 'true';
  }
  function* FromVoid(schema, references, value) {
    yield Policy.IsVoidLike(value);
  }
  function* FromKind(schema, references, value) {
    const instance = state.instances.size;
    state.instances.set(instance, schema);
    yield `kind('${schema[Kind]}', ${instance}, ${value})`;
  }
  function* Visit(schema, references, value, useHoisting = true) {
    const references_ = IsString$2(schema.$id) ? [...references, schema] : references;
    const schema_ = schema;
    if (useHoisting && IsString$2(schema.$id)) {
      const functionName = CreateFunctionName(schema.$id);
      if (state.functions.has(functionName)) return yield `${functionName}(${value})`;
      else {
        state.functions.set(functionName, '<deferred>');
        const functionCode = CreateFunction(functionName, schema, references, 'value', false);
        state.functions.set(functionName, functionCode);
        return yield `${functionName}(${value})`;
      }
    }
    switch (schema_[Kind]) {
      case 'Any':
        return yield* FromAny(schema_, references_, value);
      case 'Argument':
        return yield* FromArgument(schema_, references_, value);
      case 'Array':
        return yield* FromArray(schema_, references_, value);
      case 'AsyncIterator':
        return yield* FromAsyncIterator(schema_, references_, value);
      case 'BigInt':
        return yield* FromBigInt(schema_, references_, value);
      case 'Boolean':
        return yield* FromBoolean(schema_, references_, value);
      case 'Constructor':
        return yield* FromConstructor(schema_, references_, value);
      case 'Date':
        return yield* FromDate(schema_, references_, value);
      case 'Function':
        return yield* FromFunction(schema_, references_, value);
      case 'Import':
        return yield* FromImport(schema_, references_, value);
      case 'Integer':
        return yield* FromInteger(schema_, references_, value);
      case 'Intersect':
        return yield* FromIntersect(schema_, references_, value);
      case 'Iterator':
        return yield* FromIterator(schema_, references_, value);
      case 'Literal':
        return yield* FromLiteral(schema_, references_, value);
      case 'Never':
        return yield* FromNever(schema_, references_, value);
      case 'Not':
        return yield* FromNot(schema_, references_, value);
      case 'Null':
        return yield* FromNull(schema_, references_, value);
      case 'Number':
        return yield* FromNumber(schema_, references_, value);
      case 'Object':
        return yield* FromObject(schema_, references_, value);
      case 'Promise':
        return yield* FromPromise(schema_, references_, value);
      case 'Record':
        return yield* FromRecord(schema_, references_, value);
      case 'Ref':
        return yield* FromRef(schema_, references_, value);
      case 'RegExp':
        return yield* FromRegExp(schema_, references_, value);
      case 'String':
        return yield* FromString(schema_, references_, value);
      case 'Symbol':
        return yield* FromSymbol(schema_, references_, value);
      case 'TemplateLiteral':
        return yield* FromTemplateLiteral(schema_, references_, value);
      case 'This':
        return yield* FromThis(schema_, references_, value);
      case 'Tuple':
        return yield* FromTuple(schema_, references_, value);
      case 'Undefined':
        return yield* FromUndefined(schema_, references_, value);
      case 'Union':
        return yield* FromUnion(schema_, references_, value);
      case 'Uint8Array':
        return yield* FromUint8Array(schema_, references_, value);
      case 'Unknown':
        return yield* FromUnknown(schema_, references_, value);
      case 'Void':
        return yield* FromVoid(schema_, references_, value);
      default:
        if (!Has(schema_[Kind])) throw new TypeCompilerUnknownTypeError(schema);
        return yield* FromKind(schema_, references_, value);
    }
  }
  const state = {
    language: 'javascript',
    functions: /* @__PURE__ */ new Map(),
    variables: /* @__PURE__ */ new Map(),
    instances: /* @__PURE__ */ new Map(),
  };
  function CreateExpression(schema, references, value, useHoisting = true) {
    return `(${[...Visit(schema, references, value, useHoisting)].join(' && ')})`;
  }
  function CreateFunctionName($id) {
    return `check_${Identifier.Encode($id)}`;
  }
  function CreateVariable(expression) {
    const variableName = `local_${state.variables.size}`;
    state.variables.set(variableName, `const ${variableName} = ${expression}`);
    return variableName;
  }
  function CreateFunction(name, schema, references, value, useHoisting = true) {
    const [newline, pad] = ['\n', (length) => ''.padStart(length, ' ')];
    const parameter = CreateParameter('value', 'any');
    const returns = CreateReturns('boolean');
    const expression = [...Visit(schema, references, value, useHoisting)]
      .map((expression) => `${pad(4)}${expression}`)
      .join(` &&${newline}`);
    return `function ${name}(${parameter})${returns} {${newline}${pad(2)}return (${newline}${expression}${newline}${pad(2)})\n}`;
  }
  function CreateParameter(name, type) {
    return `${name}${state.language === 'typescript' ? `: ${type}` : ''}`;
  }
  function CreateReturns(type) {
    return state.language === 'typescript' ? `: ${type}` : '';
  }
  function Build(schema, references, options) {
    const functionCode = CreateFunction('check', schema, references, 'value');
    const parameter = CreateParameter('value', 'any');
    const returns = CreateReturns('boolean');
    const functions = [...state.functions.values()];
    const variables = [...state.variables.values()];
    const checkFunction = IsString$2(schema.$id)
      ? `return function check(${parameter})${returns} {\n  return ${CreateFunctionName(schema.$id)}(value)\n}`
      : `return ${functionCode}`;
    return [...variables, ...functions, checkFunction].join('\n');
  }
  /** Generates the code used to assert this type and returns it as a string */
  function Code(...args) {
    const defaults = { language: 'javascript' };
    const [schema, references, options] =
      args.length === 2 && IsArray$2(args[1])
        ? [args[0], args[1], defaults]
        : args.length === 2 && !IsArray$2(args[1])
          ? [args[0], [], args[1]]
          : args.length === 3
            ? [args[0], args[1], args[2]]
            : args.length === 1
              ? [args[0], [], defaults]
              : [null, [], defaults];
    state.language = options.language;
    state.variables.clear();
    state.functions.clear();
    state.instances.clear();
    if (!IsSchema(schema)) throw new TypeCompilerTypeGuardError(schema);
    for (const schema of references)
      if (!IsSchema(schema)) throw new TypeCompilerTypeGuardError(schema);
    return Build(schema, references, options);
  }
  TypeCompiler.Code = Code;
  /** Compiles a TypeBox type for optimal runtime type checking. Types must be valid TypeBox types of TSchema */
  function Compile(schema, references = []) {
    const generatedCode = Code(schema, references, { language: 'javascript' });
    const compiledFunction = globalThis.Function('kind', 'format', 'hash', generatedCode);
    const instances = new Map(state.instances);
    function typeRegistryFunction(kind, instance, value) {
      if (!Has(kind) || !instances.has(instance)) return false;
      return Get(kind)(instances.get(instance), value);
    }
    function formatRegistryFunction(format, value) {
      if (!Has$1(format)) return false;
      return Get$1(format)(value);
    }
    function hashFunction(value) {
      return Hash(value);
    }
    return new TypeCheck(
      schema,
      references,
      compiledFunction(typeRegistryFunction, formatRegistryFunction, hashFunction),
      generatedCode,
    );
  }
  TypeCompiler.Compile = Compile;
})(TypeCompiler || (TypeCompiler = {}));
//#endregion
export {
  OptionalKind as _,
  TransformDecodeError as a,
  Errors as c,
  Unsafe as d,
  Has as f,
  Kind as g,
  Set$2 as h,
  Decode as i,
  Check as l,
  Has$1 as m,
  Encode as n,
  Clean as o,
  Set$1 as p,
  Default as r,
  Create as s,
  TypeCompiler as t,
  Type as u,
  TransformKind as v,
  TypeBoxError as y,
};
