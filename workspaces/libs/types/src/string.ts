import type { Whitespace } from 'type-fest/source/internal/characters.js';

export type TrimLeft<
  Input extends string,
  What extends string = Whitespace,
> = (
  Input extends `${What}${infer Rest}`
    ? TrimLeft<Rest, What>
    : Input
);

export type TrimRight<
  Input extends string,
  What extends string = Whitespace,
> = (
  Input extends `${infer Rest}${What}`
    ? TrimRight<Rest, What>
    : Input
);

export type Trim<
  Input extends string,
  What extends string = Whitespace,
> = TrimLeft<TrimRight<Input, What>, What>;
