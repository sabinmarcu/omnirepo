import {
  defineTheme,
} from '../index.js';
import type {
  ThemeInputs,
  ThemePatches,
} from '../index.js';
import {
  backgroundGenerator,
  paletteGenerator,
} from './color.js';

const schema = {
  palette: paletteGenerator(),
  background: backgroundGenerator(),
} as const;
const theme = defineTheme(schema, { prefix: 'colors' });

type Inputs = ThemeInputs<typeof theme>;
type Patches = ThemePatches<typeof theme>;

const scalarInput: Inputs = {
  palette: 'rebeccapurple',
  background: 'canvas',
};
const variantInput: Inputs = {
  palette: {
    light: 'ivory',
    dark: 'midnightblue',
  },
  background: {
    light: 'white',
    dark: 'black',
  },
};
const scalarPatch: Patches = {
  palette: 'tomato',
  background: 'canvastext',
};
const partialVariantPatch: Patches = {
  palette: { dark: 'midnightblue' },
  background: { light: 'ivory' },
};
const exactPaletteReference: 'var(--colors-palette-base)' = theme.contract.palette.base;
const exactBackgroundReference: 'var(--colors-background-page)' = theme.contract.background.page;
const exactPaletteScope: 'contextual' = schema.palette.scope;
const exactBackgroundScope: 'contextual' = schema.background.scope;

// @ts-expect-error Variant defaults require both light and dark values.
const incompleteDefault = paletteGenerator({ default: { light: 'white' } });
// @ts-expect-error Color defaults are CSS strings, not numeric values.
const numericDefault = backgroundGenerator({ default: 1 });
const generatedOutputPatch: Patches = {
  palette: {
    // @ts-expect-error Generated palette values are not editable sources.
    contrast: 'white',
  },
};
const privateOutputPatch: Patches = {
  background: {
    // @ts-expect-error Private foreground markers are not editable sources.
    foreground: 'black',
  },
};
const unknownVariantPatch: Patches = {
  palette: {
    // @ts-expect-error Variants only support light and dark keys.
    system: 'black',
  },
};

export const colorGeneratorAssertions = {
  scalarInput,
  variantInput,
  scalarPatch,
  partialVariantPatch,
  exactPaletteReference,
  exactBackgroundReference,
  exactPaletteScope,
  exactBackgroundScope,
  incompleteDefault,
  numericDefault,
  generatedOutputPatch,
  privateOutputPatch,
  unknownVariantPatch,
};
