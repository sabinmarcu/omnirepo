import {
  backgroundGenerator,
  defineTheme,
  gridGenerator,
  paletteGenerator,
} from '@sabinmarcu/theme-core';

/** Shared public token identity; values are delivered by an application-owned harness. */
export const themeDefinition = defineTheme({
  colors: {
    primary: paletteGenerator({ default: '#0cf' }),
    secondary: paletteGenerator({ default: '#f0c' }),
    info: paletteGenerator({ default: 'blue' }),
    success: paletteGenerator({ default: 'green' }),
    warning: paletteGenerator({ default: 'yellow' }),
    error: paletteGenerator({ default: 'red' }),
    background: backgroundGenerator(),
  },
  grid: gridGenerator(),
});

export const theme = themeDefinition.contract;
