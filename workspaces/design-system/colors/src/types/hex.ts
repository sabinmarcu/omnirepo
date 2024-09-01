import type {
  IsNever,
  MatchRepeat,
  Repeats,
  RepeatsType,
} from '@sabinmarcu/types';

export type HexCharacters = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type HexMatchSingular = HexCharacters;
export type HexMatchDouble = `${HexCharacters}${HexCharacters}`;

export type HexColorType = `#${string}`;
export type HexColorStringOf<T extends string> = (
  T extends `#${infer Value}` ? Value : never
);
export type HexColorOf<T extends string> = `#${T}`;

export type HexStringMatch<
  T extends string,
  Repetitions extends RepeatsType,
  HexSingle = MatchRepeat<T, HexMatchSingular, Repetitions>,
  HexDouble = MatchRepeat<T, HexMatchDouble, Repetitions>,
> = (
  IsNever<HexSingle> extends true
    ? IsNever<HexDouble> extends true
      ? never
      : HexDouble
    : HexSingle
);

export type HexString<
  T extends string,
  HexStringValue = HexStringMatch<T, Repeats<3>>,
  HexAlphaStringValue = HexStringMatch<T, Repeats<4>>,
> = (
  IsNever<HexStringValue> extends true
    ? IsNever<HexAlphaStringValue> extends true
      ? never
      : HexAlphaStringValue
    : HexStringValue
);

export type ParseHexColor<
  T extends string,
  HexValue = HexString<HexColorStringOf<T>>,
> = (
  IsNever<HexValue> extends false
    ? T
    : never
);

export type HexColorCheck<
  T extends string,
  Parsed = ParseHexColor<T>,
> = (
  IsNever<Parsed> extends true
    ? never
    : unknown
);
