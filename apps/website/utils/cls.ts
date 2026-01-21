/* eslint-disable no-continue */
import type {
  Join,
} from '@sabinmarcu/types';

export namespace cls {
  export type Option = (
    | string
    | undefined
    | Record<string, boolean | undefined>
  );
  type ParseOptions<Input extends Option[]> = {
    [Key in keyof Input]: (
      Input[Key] extends string
        ? Input[Key]
        : Input[Key] extends undefined
          ? unknown
          : Input[Key] extends Record<string, boolean>
            ? { [Subkey in keyof Input[Key]]: Input[Key][Subkey] extends true
              ? Subkey
              : never
            }[keyof Input[Key]]
            : unknown
    )
  };
  type ExcludeUnknown<
    Input extends any[],
  > = (
    Input extends [infer First, ...infer Rest]
      ? First extends string
        ? [First, ...ExcludeUnknown<Rest>]
        : ExcludeUnknown<Rest>
      : []
  );
  type JoinUnion<Input extends any> = (
    Input extends string[]
      ? Join<Input, ' '>
      : Input
  );
  export type Result<Input extends Option[]> = (
    JoinUnion<ExcludeUnknown<ParseOptions<Input>>>
  );

}

export function cls<
  Options extends cls.Option[],
>(...options: Options): cls.Result<Options> {
  const results: string[] = [];
  for (const option of options) {
    if (!option) {
      continue;
    }
    if (typeof option === 'string') {
      results.push(option);
      continue;
    }
    for (const [key, value] of Object.entries(option)) {
      if (value) {
        results.push(key);
      }
    }
  }
  return results.join(' ') as any;
}