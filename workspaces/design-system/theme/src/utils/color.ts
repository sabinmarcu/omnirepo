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
