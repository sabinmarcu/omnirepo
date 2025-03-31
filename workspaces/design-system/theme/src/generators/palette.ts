import {
  getColor,
} from '../utils/color.js';
import type { ThemeGenerator } from './types.js';

const blendAmount = 2;
export const paletteGenerator = ((
  color: string,
) => {
  const base = getColor(color);

  return ({
    base,
    muted: `oklch(from ${base} l calc(c * ${1 / blendAmount}) h)`,
    emphasis: `oklch(from ${base} l calc(c * ${blendAmount}) h)`,
  });
}) satisfies ThemeGenerator<string>;

export type PaletteColors = ReturnType<typeof paletteGenerator>;
