import Color from 'colorjs.io';
import {
  getColor,
  isLightColor,
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
    const isLight = isLightColor(baseColor);
    const reference = {
      elevated: getColor(!isLight ? '#ffff' : '#000f'),
      depressed: getColor(isLight ? '#ffff' : '#000f'),
    };
    const baseReference = defaultKey ?? base;
    const offsets = {
      elevated: isLight ? 80 : 40,

      depressed: isLight ? 20 : 20,
    };

    return {
      page: base,
      surface: mixColor(baseReference, reference.elevated),
      elevated: mixColor(baseReference, reference.elevated, offsets.elevated),
      depressed: mixColor(baseReference, reference.depressed, offsets.depressed),
      text: reference.elevated,
    } as const;
  };
  generator.default = 'page';
  return generator;
})() satisfies ThemeGenerator<string>;

export type BackgroundColors = ReturnType<typeof backgroundGenerator>;
