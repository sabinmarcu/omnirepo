import Color from 'colorjs.io';
import {
  getColor,
  mixColor,
} from '../utils/color.js';
import { colorspace } from '../constants.js';
import type { ThemeGenerator } from './types.js';

export const backgroundGenerator = ((
  color: string,
) => {
  const baseColor = new Color(color);
  const base = baseColor.to(colorspace).toString();
  const reference = {
    elevated: getColor(baseColor.luminance <= 0.5 ? '#ffff' : '#000f'),
    depressed: getColor(baseColor.luminance > 0.5 ? '#ffff' : '#000f'),
  };

  return {
    page: base,
    surface: mixColor(base, reference.elevated),
    elevated: mixColor(base, reference.elevated, 40),
    depressed: mixColor(base, reference.depressed),
    text: reference.elevated.toString(),
  } as const;
}) satisfies ThemeGenerator<string>;

export type BackgroundColors = ReturnType<typeof backgroundGenerator>;
