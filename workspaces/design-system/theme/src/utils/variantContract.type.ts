import type { themeVariants } from '../constants.js';
import type { ThemeGenerator } from '../generators/types.js';
import type { rawContract } from './rawContract.js';

export type UpdatersOfVariantContract<
  Generator extends ThemeGenerator<any>,
  Prefix extends string = '',
> = Record<
  typeof themeVariants[number],
  ReturnType<typeof rawContract<Generator, Prefix>>[1]
>;

export type UpdaterInputOfVariantContractVariants<
  Generator extends ThemeGenerator<any>,
  Prefix extends string = '',
  Params = Parameters<ReturnType<typeof rawContract<Generator, Prefix>>[1]>,
> = (Params extends [infer Input, ...any[]]
  ? Record<typeof themeVariants[number], Input>
  : unknown
);

export type UpdaterInputOfVariantContract<
  Generator extends ThemeGenerator<any>,
  Prefix extends string = '',
  Params = Parameters<ReturnType<typeof rawContract<Generator, Prefix>>[1]>,
> = (
   Params extends [infer Input, ...infer Rest]
     ? [
       (
         | UpdaterInputOfVariantContractVariants<Generator, Prefix, Params>
         | Input
       ),
       ...Rest,
     ]
     : unknown
);
