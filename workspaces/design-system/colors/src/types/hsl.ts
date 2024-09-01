import type {
  IsNever,
  NumbersArray,
  TrimRight,
} from '@sabinmarcu/types';
import type {
  AngleFunctions,
  CSSFunctions,
  MathFunctions,
} from './functions.js';

export type HSLFunctionNames = 'hsl' | 'hsla';

export type CSSFunctionsH = AngleFunctions | MathFunctions;
export type CSSFunctionsSL = MathFunctions;
export type CSSFunctionsA = MathFunctions;

export type HSLValues = `${NumbersArray<101>[number]}`;
export type DegValues = `${NumbersArray<361>[number]}`;
export type DecimalValues = '0' | `${'0'}.${number}` | '1';
export type RadValues = '0' | `${NumbersArray<7>[number]}.${number}` | `${NumbersArray<7>[number]}`;

export type HUnits = 'deg' | 'rad';
export type HType<
  Value extends string = string,
  Unit extends HUnits | '' = HUnits,
> = {
  value: Value,
  unit: Unit,
};

export type HSLPatternH<T extends string> = (
  T extends `${infer Value extends DegValues}`
    ? HType<Value, 'deg'>
    : T extends `${infer Value extends DegValues}deg`
      ? HType<Value, 'deg'>
      : T extends `${infer Value extends RadValues}rad`
        ? HType<`${Value}`, 'rad'>
        : T extends 'none'
          ? HType<'0', 'deg'>
          : T extends CSSFunctions<CSSFunctionsH>
            ? HType<T, ''>
            : never
);

export type HSLPatternSL<T extends string> = (
  T extends `${infer Value extends HSLValues}%`
    ? Value
    : T extends CSSFunctions<CSSFunctionsSL>
      ? T
      : never
);

export type HSLPatternA<T extends string> = (
  T extends `${infer Value extends HSLValues}%`
    ? TrimRight<`0.${Value}`, '0'>
    : T extends `${infer Value extends DecimalValues}`
      ? Value
      : T extends CSSFunctions<CSSFunctionsA>
        ? T
        : never
);

export type HSLAObject<
  H extends string = string,
  S extends string = string,
  L extends string = string,
  A extends string = '1',
  HValue = HSLPatternH<H>,
  SValue = HSLPatternSL<S>,
  LValue = HSLPatternSL<L>,
  AValue = HSLPatternA<A>,
> = (
  IsNever<HValue> extends true
    ? never
    : IsNever<SValue> extends true
      ? never
      : IsNever<LValue> extends true
        ? never
        : IsNever<AValue> extends true
          ? never
          : {
            h: HValue,
            s: SValue,
            l: LValue,
            a: AValue,
          }
);

export type HSLStringType = (
  // HSL
  // | `${HSLFunctionNames}(${string} ${string} ${string})` Not allowing
  | `${HSLFunctionNames}(${string}, ${string}, ${string})`
  // HSLA
  | `${HSLFunctionNames}(${string} ${string}, ${string}, ${string})`
  | `${HSLFunctionNames}(${string}, ${string}, ${string}, ${string})`
);

export type HSLString<T extends string> = (
  T extends HSLStringType
    ? T extends `${HSLFunctionNames}(${infer H}, ${infer S}, ${infer L}, ${infer A})`
      ? HSLAObject<H, S, L, A>
      : T extends `${HSLFunctionNames}(${infer H} ${infer S}, ${infer L}, ${infer A})`
        ? HSLAObject<H, S, L, A>
        : T extends `${HSLFunctionNames}(${infer H}, ${infer S}, ${infer L})`
          ? HSLAObject<H, S, L>
          : T extends `${HSLFunctionNames}(${infer H} ${infer S} ${infer L})`
            ? HSLAObject<H, S, L>
            : never
    : never
);

export type HSLFunctionOrSuffix<
  T extends string,
  Suffix extends string = '%',
> = (
  T extends CSSFunctions
    ? T
    : `${T}${Suffix}`
);

export type HSLStringOf<
  T extends HSLAObject,
  HValue extends string = HSLFunctionOrSuffix<T['h']['value'], T['h']['unit']>,
  SValue extends string = HSLFunctionOrSuffix<T['s']>,
  LValue extends string = HSLFunctionOrSuffix<T['l']>,
  AValue extends string = HSLFunctionOrSuffix<T['a'], ''>,
> = (
  `hsla(${HValue}, ${SValue}, ${LValue}, ${AValue})`
);

export type HSLColorCheck<
  T extends string,
  HSLValue extends HSLAObject | never = HSLString<T>,
> = (
  IsNever<HSLValue> extends true
    ? never
    : HSLStringOf<HSLValue>
);

// TODO: Figure out how to properly infer from syntax

// export type HSLFromPatternH<
//   T extends string,
// > = (
//   T extends 'h'
//     ? HType<T, ''>
//     : HSLPatternH<T>
// );

// export type HSLFromPatternSL<
//   T extends string,
// > = (
//   T extends 's' | 'l'
//     ? T
//     : HSLPatternSL<T>
// );

// export type HSLFromPatternA<
//   T extends string,
// > = (
//   T extends 'a'
//     ? T
//     : HSLPatternA<T>
// );

// export type HSLAFromObject<
//   From extends string = string,
//   H extends string = string,
//   S extends string = string,
//   L extends string = string,
//   A extends string = '1',
//   HValue = HSLFromPatternH<H>,
//   SValue = HSLFromPatternSL<S>,
//   LValue = HSLFromPatternSL<L>,
//   AValue = HSLFromPatternA<A>,
// > = (
//   IsNever<HValue> extends true
//     ? never
//     : IsNever<SValue> extends true
//       ? never
//       : IsNever<LValue> extends true
//         ? never
//         : IsNever<AValue> extends true
//           ? never
//           : {
//             From: From,
//             h: HValue,
//             s: SValue,
//             l: LValue,
//             a: AValue,
//           }
// );

// export type HSLFromStringType = (
//   | `${HSLFunctionNames}(from ${string} ${string} ${string} ${string})`
//   | `${HSLFunctionNames}(from ${string} ${string} ${string} ${string} / ${string})`
// );

// export type HSLFromString<T extends string> = (
//   T extends HSLFromStringType
// eslint-disable-next-line max-len
//     ? T extends `${HSLFunctionNames}(from ${infer From} ${infer H} ${infer S} ${infer L} / ${infer A})`
//       ? HSLAFromObject<From, H, S, L, A>
//       : T extends `${HSLFunctionNames}(from ${infer From} ${infer H} ${infer S} ${infer L})`
//         ? HSLAFromObject<From, H, S, L>
//         : never
//     : never
// );

// export type HSLFromFunctionOrSuffix<
//   T extends string,
//   Target extends string,
//   Suffix extends string = '%',
// > = (
//   T extends Target
//     ? T
//     : HSLFunctionOrSuffix<T, Suffix>
// );

// export type HSLFromStringOf<
//   T extends HSLAFromObject,
//   HValue extends string = HSLFromFunctionOrSuffix<T['h']['value'], 'h', T['h']['unit']>,
//   SValue extends string = HSLFromFunctionOrSuffix<T['s'], 's'>,
//   LValue extends string = HSLFromFunctionOrSuffix<T['l'], 'l'>,
//   AValue extends string = HSLFromFunctionOrSuffix<T['a'], 'a', ''>,
// > = (
//   `hsla(from ${T['From']} ${HValue} ${SValue} ${LValue} ${AValue})`
// );

// export type HSLColor<
//   T extends string,
//   HSLValue extends HSLAObject | never = HSLString<T>,
//   HSLFromValue extends HSLAFromObject | never = HSLFromString<T>,
// > = (
//   IsNever<HSLValue> extends true
//     ? IsNever<HSLFromValue> extends true
//       ? never
//       : HSLFromStringOf<HSLFromValue>
//     : HSLStringOf<HSLValue>
// );
