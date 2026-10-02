import { themes } from './themes.js';
import { themeValues } from './themes.values.js';

/** The sole Storybook root owner; later edits must use this mounted handle. */
export const themeRuntime = themes.mount(document);
themeRuntime(themeValues);
