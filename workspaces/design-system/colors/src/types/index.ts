import type {
  HexColorCheck,
  ParseHexColor,
} from './hex.js';
import type {
  HSLColorCheck,
  ParseHSLColor,
} from './hsl.js';
import type {
  Color,
  HexColor,
  HSLColor,
  RGBColor,
} from './primitives.js';
import type {
  ParseRGBColor,
  RGBColorCheck,
} from './rgb.js';

export type ColorCheck<T extends Color> = (
  T extends HSLColor
    ? T & HSLColorCheck<T>
    : T extends RGBColor
      ? T & RGBColorCheck<T>
      : T extends HexColor
        ? T & HexColorCheck<T>
        : never
);

export type ParseColor<T extends string> = (
  T extends Color
    ? T extends HSLColor
      ? ParseHSLColor<T>
      : T extends RGBColor
        ? ParseRGBColor<T>
        : T extends HexColor
          ? ParseHexColor<T>
          : never
    : never
);

export type {
  ParseHexColor,
  HexColorCheck,
} from './hex.js';
export type {
  ParseHSLColor,
  HSLColorCheck,
} from './hsl.js';
export type {
  ParseRGBColor,
  RGBColorCheck,
} from './rgb.js';

export * from './primitives.js';
