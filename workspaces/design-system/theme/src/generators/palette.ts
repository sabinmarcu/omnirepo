import Color from 'colorjs.io';
import {
  getColor,
} from '../utils/color.js';
import type { ThemeGenerator } from './types.js';
import { colorspace } from '../constants.js';

const blendAmount = 2;
export const paletteGenerator = (() => {
  const generator = (
    color: string,
    defaultKey?: string,
  ) => {
    const baseColor = new Color(color);
    const base = baseColor.to(colorspace).toString();
    const baseReference = defaultKey ?? base;
    const contrast = getColor(baseColor.luminance <= 0.5 ? '#ffff' : '#000f');

    return ({
      base,
      contrast,
      muted: `oklch(from ${baseReference} l calc(c * ${1 / blendAmount}) h)`,
      emphasis: `oklch(from ${baseReference} l calc(c * ${blendAmount}) h)`,
    });
  };
  generator.default = 'base';
  return generator;
})() satisfies ThemeGenerator<string>;

export type PaletteColors = ReturnType<typeof paletteGenerator>;
