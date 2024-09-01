import type {
  IsNever,
  NumbersArray,
  TrimRight,
} from '@sabinmarcu/types';
import type {
  CSSFunctions,
  MathFunctions,
} from './functions.js';

export type RGBFunctionNames = 'rgb' | 'rgba';

export type RGBValues = `${NumbersArray<256>[number]}`;
export type AlphaPercent = `${NumbersArray<101>[number]}`;
export type AlphaDecimal = '0' | `${0}.${number}` | '1';

export type RGBPattern<T extends string> = (
  T extends `${infer Value extends RGBValues}`
    ? Value
    : T extends CSSFunctions<MathFunctions>
      ? T
      : never
);

export type AlphaPattern<T extends string> = (
  T extends `${infer Value extends AlphaPercent}%`
    ? TrimRight<`0.${Value}`, '0'>
    : T extends `${infer Value extends AlphaDecimal}`
      ? Value
      : T extends CSSFunctions<MathFunctions>
        ? T
        : never
);

export type RGBAObject<
  R extends string = string,
  G extends string = string,
  B extends string = string,
  A extends string = '1',
  RValue = RGBPattern<R>,
  GValue = RGBPattern<G>,
  BValue = RGBPattern<B>,
  AValue = AlphaPattern<A>,
> = (
  IsNever<RValue> extends true
    ? never
    : IsNever<GValue> extends true
      ? never
      : IsNever<BValue> extends true
        ? never
        : IsNever<AValue> extends true
          ? never
          : {
            r: RValue,
            g: GValue,
            b: BValue,
            a: AValue
          }
);

export type RGBStringType = (
  // RGB
  | `${RGBFunctionNames}(${string}, ${string}, ${string})`
  // RGBA
  | `${RGBFunctionNames}(${string}, ${string}, ${string}, ${string})`
);

export type RGBAString<T extends string> = (
  T extends RGBStringType
    ? T extends `${RGBFunctionNames}(${infer R}, ${infer G}, ${infer B}, ${infer A})`
      ? RGBAObject<R, G, B, A>
      : T extends `${RGBFunctionNames}(${infer R}, ${infer G}, ${infer B})`
        ? RGBAObject<R, G, B>
        : never
    : never
);

export type RGBAStringOf<T extends RGBAObject> = (
  `rgba(${T['r']}, ${T['g']}, ${T['b']} ${T['a']})`
);

export type ParseRGBColor<
  T extends string,
  RGBValue extends RGBAObject | never = RGBAString<T>,
> = (
  IsNever<RGBValue> extends false
    ? T
    : never
);

export type RGBColorCheck<
  T extends string,
  Parsed = ParseRGBColor<T>,
> = (
  IsNever<Parsed> extends true
    ? never
    : unknown
);
