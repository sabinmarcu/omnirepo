import type { Simplify } from '@sabinmarcu/types';

export type DefaultGrid = { m: string };
export type AmountGrid<
  Amount extends number,
  Prefix extends string = '',
  Current extends number[] = [],
> = Simplify<(
  Current['length'] extends Amount
    ? unknown
    : (
      & {
        [Key in `${Prefix}s`]: string
      }
      & AmountGrid<Amount, `${Prefix}x`, [...Current, Current['length']]>
      & {
        [Key in `${Prefix}l`]: string
      }
    )
)>;

// @ts-ignore
export type Grid<
  Amount extends number,
  Subgrid = AmountGrid<Amount>,
> = Simplify<(
  & { [Key in keyof Subgrid & `${string}s`]: Subgrid[Key] }
  & DefaultGrid
  & { [Key in keyof Subgrid & `${string}l`]: Subgrid[Key] }
)>;
