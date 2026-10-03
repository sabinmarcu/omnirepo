import {
  backgroundGenerator,
  breakpointGenerator,
  createThemeSetup,
  defineTheme,
  extendTheme,
  fibonacciGridGenerator,
  gridGenerator,
  paletteGenerator,
} from './index.js';

const base = defineTheme({
  colors: { primary: paletteGenerator() },
  grid: gridGenerator(),
});
const theme = extendTheme(base, {
  colors: { background: backgroundGenerator() },
  fib: fibonacciGridGenerator({ pairs: 4 }),
  breakpoint: breakpointGenerator([['phone', 640], ['wide', 960]]),
});
const setup = createThemeSetup(theme, { id: 'typed-harness' });
const initial = setup({
  colors: { primary: { light: 'white' } },
  grid: 16,
});
const patchReturn = setup.update({
  colors: { background: { dark: 'black' } },
  fib: 24,
});
const live = setup.read();
const manifestVersion: 2 = setup.manifest().version;
const exactBase: 'var(--theme-colors-primary-base)' = initial.colors.primary.base;
const exactExtension: 'var(--theme-colors-background-page)' = patchReturn.colors.background.page;
const numericLiveInput: number = live.grid;
const exactStatic: '(width < 640px)' = patchReturn.breakpoint.lt.phone;
const completeVariants: string = live.colors.background.light;
// @ts-expect-error Derived color output paths cannot enter source updates.
setup.update({ colors: { primary: { contrast: 'white' } } });
// @ts-expect-error Static outputs cannot enter renderer value updates.
setup.update({ breakpoint: { lt: { phone: '(width < 500px)' } } });
// @ts-expect-error Spacing inputs preserve their numeric codec type.
setup.update({ grid: '24px' });
// @ts-expect-error Selected system mode is not another allocated variant.
setup.update({ colors: { background: { system: 'white' } } });
const shadow = createThemeSetup(theme, {
  id: 'host-harness',
  selector: ':host',
});
const mounted = shadow.mount(document.createElement('div').attachShadow({ mode: 'open' }));
const hostReturn = mounted.update({ grid: 12 });
const exactHost: 'var(--theme-grid-m)' = hostReturn.grid.m;

export const rendererAssertions = {
  exactBase,
  exactExtension,
  numericLiveInput,
  exactStatic,
  completeVariants,
  manifestVersion,
  exactHost,
};
