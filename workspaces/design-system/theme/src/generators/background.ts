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
    const text = getColor(isLight ? '#000f' : '#ffff');
    const reference = {
      elevated: text,
      depressed: getColor(isLight ? '#ffff' : '#000f'),
      text,
    };
    const baseReference = defaultKey ?? base;
    const offsets = {
      surface: isLight ? 10 : undefined,
      elevated: isLight ? 20 : 40,
      depressed: isLight ? 20 : 20,
      raised: isLight ? 30 : 50,
      recessed: isLight ? 30 : 30,
    };

    return {
      surface: mixColor(baseReference, reference.elevated, offsets.surface),

      raised: mixColor(baseReference, reference.elevated, offsets.raised),
      elevated: mixColor(baseReference, reference.elevated, offsets.elevated),

      page: base,

      depressed: mixColor(baseReference, reference.depressed, offsets.depressed),
      recessed: mixColor(baseReference, reference.depressed, offsets.recessed),

      text: reference.text,
    } as const;
  };
  generator.default = 'page';
  return generator;
})() satisfies ThemeGenerator<string>;

export type BackgroundColors = ReturnType<typeof backgroundGenerator>;
