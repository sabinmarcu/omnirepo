import type {
  IsNever,
  NumbersArray,
  Split,
  StringSlice,
  UnionToIntersection,
} from '@sabinmarcu/types';

export type RepeatsPrimitive = number;
export type RepeatsType = RepeatsPrimitive[];
export type StringLength<T extends string> = Split<T, ''>['length'];
export type SameLengthStringUnion<T extends string> = UnionToIntersection<
  StringLength<T>
>;

export type Repeats<
  Amount extends number,
> = NumbersArray<Amount>;

export type InputMatchOf<
  Match extends string = string,
  Rest extends string = string,
> = { Match: Match, Rest: Rest };

export type MatchRepeatInputSplit<
  Input extends string,
  Target extends string,
> = IsNever<SameLengthStringUnion<Target>> extends false
  ? Input extends `${infer Match extends Target}${string}`
    ? InputMatchOf<
      StringSlice<Input, 0, StringLength<Match>> & string,
      StringSlice<Input, StringLength<StringSlice<Input, 0, StringLength<Match>> & string>> & string
    >
    : never
  : never;

export type MatchRepetitionsSplit<
  Repetitions extends RepeatsType,
> = Repetitions['length'] extends 0
  ? never
  : Repetitions extends [RepeatsPrimitive, ...infer Rest extends RepeatsType]
    ? Rest
    : never;

export type MatchRepeat<
  // Inputs
  Input extends string,
  Target extends string,
  Repetitions extends RepeatsType,
  // Generated
  InputMatch = MatchRepeatInputSplit<Input, Target>,
  NextRepeats = MatchRepetitionsSplit<Repetitions>,
> = (
  IsNever<SameLengthStringUnion<Target>> extends true
    ? never
    : IsNever<InputMatch> extends true
      ? IsNever<NextRepeats> extends true
        ? Input extends ''
          ? ''
          : never
        : never
      : InputMatch extends InputMatchOf
        ? NextRepeats extends RepeatsType
          ? `${InputMatch['Match']}${MatchRepeat<InputMatch['Rest'], Target, NextRepeats>}`
          : InputMatch['Match']
        : never
);

