import {
  addons,
  types,
} from 'storybook/internal/manager-api';

import {
  ADDON_ID,
  ADDON_TOOL_ID,
} from './constants.js';
import { ThemeOverriderManager } from './addon.js';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_TOOL_ID, {
    title: ADDON_ID,
    type: types.TOOL,
    match: ({ tabId }) => !tabId,
    render: ThemeOverriderManager,
  });
});
