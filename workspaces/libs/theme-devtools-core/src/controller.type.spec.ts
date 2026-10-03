import { createThemeDevtools } from './index.js';
import type {
  ThemeDevtoolsOptions,
  UIThemePatch,
} from './index.js';

const options: ThemeDevtoolsOptions = {
  manifests: [],
  inspectionDocument: document,
  nonce: 'typed-nonce',
  shadowMode: 'closed',
  ui: {
    spacing: 8,
    typography: { size: 14 },
  },
};
const devtools = createThemeDevtools(document.createElement('div'), options);
const patch: UIThemePatch = {
  spacing: 12,
  colors: { primary: { dark: 'white' } },
};
devtools.updateUI(patch);
devtools.setManifests(undefined);
devtools.refresh();
const copied = devtools.exportInputs();
const rootName: string | undefined = copied[0]?.id;
const unsubscribe: () => void = devtools.subscribe(() => {});
unsubscribe();
devtools.destroy();
// @ts-expect-error Renderer shadow roots are not inspection documents.
createThemeDevtools(document.createElement('div'), { inspectionDocument: document.createElement('div').attachShadow({ mode: 'open' }) });
// @ts-expect-error Numeric private spacing input cannot become a CSS declaration string.
devtools.updateUI({ spacing: '12px' });
// @ts-expect-error Derived private surface outputs are not editable sources.
devtools.updateUI({ colors: { background: { elevated: 'black' } } });
// @ts-expect-error Numeric typography input retains its codec type.
devtools.updateUI({ typography: { size: '14px' } });

export const controllerAssertions = { rootName };
