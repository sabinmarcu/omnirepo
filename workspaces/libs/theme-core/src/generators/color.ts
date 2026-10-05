import { colorCodec } from '../codecs.js';
import {
  css,
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
): Expression => {
  // Pack source alpha into [0, .25] for black text or [.75, 1] for white text.
  // round(alpha, 1) then recovers polarity without CSS if() or style queries.
  const marker = css`oklab(from ${foregroundReference} round(l, 1) 0 0 / round(l, 1))`;
  const packed = css`color-mix(in oklab, ${source} 25%, ${marker})`;
  const polarity = 'round(alpha, 1)';
  const weight = css`(${amountForLightPolarity / 100} + ${(amountForDarkPolarity - amountForLightPolarity) / 100} * ${polarity})`;
  const sourceAlpha = css`(4 * (alpha - 0.75 * ${polarity}))`;
  const outputAlpha = css`((1 - ${weight}) * ${sourceAlpha} + ${weight})`;
  const chromaScale = css`((1 - ${weight}) * 4 * alpha / ${outputAlpha})`;

  // Undo the packing's premultiplication, then apply the original text weight.
  // OKLab and OKLCH mixes toward achromatic black/white are equivalent; using
  // Cartesian channels keeps neutral colors neutral and preserves source alpha.
  return css`oklab(from ${packed} calc(((1 - ${weight}) * 4 * (alpha * l - 0.75 * ${polarity}) + ${weight} * ${polarity}) / ${outputAlpha}) calc(a * ${chromaScale}) calc(b * ${chromaScale}) / calc(${outputAlpha}))`;
};

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
