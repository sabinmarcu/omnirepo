export type NumberOf<
  Input extends string,
> = (
  Input extends `${infer Value extends number}`
    ? Value & number
    : never
);

export type NumbersArray<
  Length extends number,
  Accumulator extends number[] = [],
> = (
  Length extends Accumulator['length']
    ? Accumulator
    : NumbersArray<Length, [...Accumulator, Accumulator['length']]>
);
