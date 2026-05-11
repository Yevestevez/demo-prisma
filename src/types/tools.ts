export type CompatibleWith<Actual extends Expected, Expected> = Actual;
export type Exact<A, B> = A extends B ? (B extends A ? A : never) : never;

export type Assert<T extends true> = T;

export type IsExact<A, B> = [A] extends [B]
    ? [B] extends [A]
        ? [Exclude<keyof A, keyof B>, Exclude<keyof B, keyof A>] extends [
              never,
              never,
          ]
            ? true
            : false
        : false
    : false;
