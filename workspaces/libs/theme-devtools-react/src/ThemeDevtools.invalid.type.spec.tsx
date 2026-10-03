import { ThemeDevtools } from './index.js';

const invalidInspectionDocument = document.createElement('div').attachShadow({ mode: 'open' });

// @ts-expect-error Theme devtools owns its host children.
const childrenAreNotAllowed = <ThemeDevtools>not an editor source</ThemeDevtools>;
// @ts-expect-error The change callback receives source exports, not a DOM event.
const domEventIsNotAChange = <ThemeDevtools onChange={(event) => event.preventDefault()} />;
// @ts-expect-error Inspection scopes are documents, never renderer shadow roots.
const shadowRootIsNotAnInspectionDocument = <ThemeDevtools inspectionDocument={invalidInspectionDocument} />;
// @ts-expect-error Private numeric inputs retain their codec type.
const stringSpacingIsNotAUIInput = <ThemeDevtools ui={{ spacing: '12px' }} />;

export {
  childrenAreNotAllowed,
  domEventIsNotAChange,
  shadowRootIsNotAnInspectionDocument,
  stringSpacingIsNotAUIInput,
};

