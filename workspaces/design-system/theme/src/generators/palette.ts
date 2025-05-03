import {
  getColor,
} from '../utils/color.js';
import type { ThemeGenerator } from './types.js';

const blendAmount = 2;
export const paletteGenerator = (() => {
  const generator = (
    color: string,
    defaultKey?: string,
  ) => {
    const base = getColor(color);
    const baseReference = defaultKey ?? base;

    return ({
      base,
      muted: `oklch(from ${baseReference} l calc(c * ${1 / blendAmount}) h)`,
      emphasis: `oklch(from ${baseReference} l calc(c * ${blendAmount}) h)`,
    });
  };
  generator.default = 'base';
  return generator;
})() satisfies ThemeGenerator<string>;

export type PaletteColors = ReturnType<typeof paletteGenerator>;
