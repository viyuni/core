import type {
  AllowedComponentProps,
  ComponentCustomProps,
  VNodeProps,
  ObjectEmitsOptions,
} from 'vue';

export type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

export type EmitFn<Options = ObjectEmitsOptions, Event extends keyof Options = keyof Options> =
  Options extends Array<infer V>
    ? (e: V, ...args: any[]) => void
    : {} extends Options
      ? (e: string, ...args: any[]) => void
      : UnionToIntersection<
          {
            [key in Event]: Options[key] extends (...args: infer Args) => any
              ? (e: key, ...args: Args) => void
              : (e: key, ...args: any[]) => void;
          }[Event]
        >;

export type DefineComponent<P = {}, S = {}, E = {}, M = {}> = {
  new (): {
    $props: P & PublicProps;
    $slots: S;
    $emit: E;
  } & M;
};
