/* eslint-disable unicorn/no-thenable */

export type Lazy<T> = PromiseLike<T>;

export namespace lazy {
  export type Options = {
    cached?: boolean,
    onAccess?: () => void,
  };
}

export function lazy<T>(
  factory: () => Promise<T>,
  {
    cached: shouldCache = true,
    onAccess,
  }: lazy.Options = {},
): Lazy<T> {
  let cached: Promise<T> | undefined;

  return {
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): PromiseLike<TResult1 | TResult2> {
      onAccess?.();

      if (!shouldCache) {
        return Promise.resolve(factory()).then(onfulfilled, onrejected);
      }

      if (!cached) {
        cached = Promise.resolve(factory());
      }

      return cached.then(onfulfilled, onrejected);
    },
  };
}
