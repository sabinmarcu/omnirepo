import { createThemeContract } from '../utils/themeContract.js';
import { breakpointContract } from './breakpoint.js';
import { gridContract } from './grid.js';
import {
  errorContract,
  infoContract,
  primaryContract,
  secondaryContract,
  successContract,
  warningContract,
} from './palette.js';
import { backgroundContract } from './surface.js';

export const createThemeVariantRaw = (variant: string) => (
  createThemeContract({
    colors: {
      primary: primaryContract,
      secondary: secondaryContract,
      info: infoContract,
      success: successContract,
      warning: warningContract,
      error: errorContract,
      background: backgroundContract,
    },
    grid: gridContract,
    breakpoint: breakpointContract,
  }, variant)
);

export const ThemeMetadataSymbol = Symbol('metadata');
export type ThemeMetadataConfig = {
  [ThemeMetadataSymbol]: {
    contract: ReturnType<typeof createThemeVariantRaw>[0],
    finalContract: ReturnType<typeof createThemeVariantRaw>[0],

    raw: ReturnType<typeof createThemeVariantRaw>[2],
  }
};
export type ThemeConfig = (
  & ReturnType<typeof createThemeVariantRaw>[1]
  & ThemeMetadataConfig
);

export const createThemeVariant = (variant: string) => {
  const [contract, updater, raw, finalContract] = createThemeVariantRaw(variant);
  const config: ThemeConfig = updater as any;

  config[ThemeMetadataSymbol] = {
    contract,
    raw,
    finalContract,
  };

  return config;
};

export const setupTheme = createThemeVariant(undefined as any);

export const setupVariant = createThemeVariant('awesome');
