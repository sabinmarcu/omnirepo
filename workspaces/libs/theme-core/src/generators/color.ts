import { colorCodec } from '../codecs.js';
import {
  css,
  propertyName,
  registered,
  variableGenerator,
  variantSource,
} from '../descriptors.js';
import type {
  Expression,
  Reference,
  Variants,
} from '../types.js';

type ColorGeneratorOptions = {
  readonly default?: string | Variants<string>;
};

const paletteDefault = '#00ccff';
const backgroundDefault = Object.freeze({
  light: '#e0e0e0',
  dark: '#202020',
});
const foregroundRegistration = {
  syntax: '<color>',
  inherits: true,
  initialValue: 'black',
} as const;

const byVariant = (
  variants: Variants<Reference>,
  formula: (source: Reference) => Expression,
): Expression => css`light-dark(${formula(variants.light)}, ${formula(variants.dark)})`;

const foreground = (source: Reference): Expression => css`contrast-color(${source})`;

const mixedTowardForeground = (
  source: Reference,
  foregroundReference: Expression,
  amount: number,
): Expression => css`color-mix(in oklch, ${source}, ${foregroundReference} ${amount}%)`;

const adaptiveForegroundMix = (
  source: Reference,
  foregroundReference: Reference,
  amountForLightPolarity: number,
  amountForDarkPolarity: number,
): Expression => css`if(style(${propertyName(foregroundReference)}: white): ${mixedTowardForeground(source, foregroundReference, amountForDarkPolarity)}; else: ${mixedTowardForeground(source, foregroundReference, amountForLightPolarity)})`;

const oppositeForeground = (foregroundReference: Reference): Expression => (
  css`oklch(from ${foregroundReference} calc(1 - l) 0 none)`
);

/** Native CSS color palette whose source stays editable as light/dark values. */
export const paletteGenerator = (
  options: ColorGeneratorOptions = {},
) => variableGenerator({
  scope: 'contextual',
  sources: variantSource(colorCodec, options.default ?? paletteDefault),
  build: (source) => ({
    tokens: {
      base: css`light-dark(${source.light}, ${source.dark})`,
      contrast: byVariant(source, foreground),
      muted: byVariant(source, (value) => css`oklch(from ${value} l calc(c * 0.5) h)`),
      emphasis: byVariant(source, (value) => css`oklch(from ${value} l calc(c * 2) h)`),
    },
  }),
});

/** Native CSS surfaces that adapt to the contrast color of each source variant. */
export const backgroundGenerator = (
  options: ColorGeneratorOptions = {},
) => variableGenerator({
  scope: 'contextual',
  sources: variantSource(colorCodec, options.default ?? backgroundDefault),
  build: (source, { privateToken }) => {
    const foregroundByVariant = {
      light: privateToken('foreground', 'light'),
      dark: privateToken('foreground', 'dark'),
    } as const;
    const adaptive = (lightAmount: number, darkAmount: number) => css`light-dark(${adaptiveForegroundMix(
      source.light,
      foregroundByVariant.light,
      lightAmount,
      darkAmount,
    )}, ${adaptiveForegroundMix(
      source.dark,
      foregroundByVariant.dark,
      lightAmount,
      darkAmount,
    )})`;
    const opposite = (amount: number) => css`light-dark(${mixedTowardForeground(
      source.light,
      oppositeForeground(foregroundByVariant.light),
      amount,
    )}, ${mixedTowardForeground(
      source.dark,
      oppositeForeground(foregroundByVariant.dark),
      amount,
    )})`;

    return {
      tokens: {
        page: css`light-dark(${source.light}, ${source.dark})`,
        text: css`light-dark(${foregroundByVariant.light}, ${foregroundByVariant.dark})`,
        surface: adaptive(10, 20),
        elevated: adaptive(20, 40),
        raised: adaptive(30, 50),
        depressed: opposite(20),
        recessed: opposite(30),
      },
      privateTokens: {
        foreground: {
          light: registered(foreground(source.light), foregroundRegistration),
          dark: registered(foreground(source.dark), foregroundRegistration),
        },
      },
    };
  },
});
