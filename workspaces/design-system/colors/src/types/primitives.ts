import type { HSLFunctionNames } from './hsl.js';
import type { RGBFunctionNames } from './rgb.js';

export type HexColor = `#${string}`;
export type HSLColor = `${HSLFunctionNames}(${string})`;
export type RGBColor = `${RGBFunctionNames}(${string})`;

export type Color = HexColor | HSLColor | RGBColor;
