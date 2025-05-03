import Color from 'colorjs.io';
import {
  getColor,
  mixColor,
} from '../utils/color.js';
import { colorspace } from '../constants.js';
import type { ThemeGenerator } from './types.js';

export const backgroundGenerator = (() => {
  const generator = (
    color: string,
    defaultKey?: string,
  ) => {
    const baseColor = new Color(color);
    const base = baseColor.to(colorspace).toString();
    const reference = {
      elevated: getColor(baseColor.luminance <= 0.5 ? '#ffff' : '#000f'),
      depressed: getColor(baseColor.luminance > 0.5 ? '#ffff' : '#000f'),
    };
    const baseReference = defaultKey ?? base;

    return {
      page: base,
      surface: mixColor(baseReference, reference.elevated),
      elevated: mixColor(baseReference, reference.elevated, 40),
      depressed: mixColor(baseReference, reference.depressed),
      text: reference.elevated.toString(),
    } as const;
  };
  generator.default = 'page';
  return generator;
})() satisfies ThemeGenerator<string>;

export type BackgroundColors = ReturnType<typeof backgroundGenerator>;
