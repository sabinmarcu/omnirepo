import {
  backgroundGenerator,
  createThemeSetup,
  defineTheme,
  paletteGenerator,
} from '@sabinmarcu/theme-core';

export const paletteStoryTheme = defineTheme({
  colors: {
    palette: paletteGenerator(),
  },
}, {
  prefix: 'storybook-palette-story',
});

export const paletteStoryRenderer = createThemeSetup(paletteStoryTheme, {
  id: 'theme-palette-story',
  debugId: 'themePaletteStory',
});

export const backgroundStoryTheme = defineTheme({
  colors: {
    background: backgroundGenerator(),
  },
}, {
  prefix: 'storybook-background-story',
});

export const backgroundStoryRenderer = createThemeSetup(backgroundStoryTheme, {
  id: 'theme-background-story',
  debugId: 'themeBackgroundStory',
});
