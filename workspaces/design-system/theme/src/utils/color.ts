import Color from 'colorjs.io';
import { colorspace } from '../constants.js';

export const getColor = (input: string) => (
  new Color(input).to(colorspace).toString()
);

export const mixColor = (
  base: string,
  reference: string,
  amount = 20,
) => (
  `color-mix(in ${colorspace}, ${base}, ${reference} ${amount}%)`
);

const white = new Color('#fff');
const black = new Color('#000');

// Relative luminance is not a usable proxy for "is this light"; WCAG contrast
// against pure white/black crosses over at Y ≈ 0.179, not 0.5.
export const isLightColor = (input: string | Color) => {
  const color = input instanceof Color ? input : new Color(input);
  return Math.abs(color.contrast(black, 'WCAG21'))
    >= Math.abs(color.contrast(white, 'WCAG21'));
};
