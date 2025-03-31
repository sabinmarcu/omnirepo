import {
  addons,
  types,
} from 'storybook/internal/manager-api';

import { ToolbarManager } from './components/ToolbarManager.js';
import { TOOLBAR_ID } from './constants.js';

// Register the toolbar in the manager
addons.register(TOOLBAR_ID, () => addons.add(TOOLBAR_ID, {
  title: TOOLBAR_ID,
  type: types.TOOL,
  match: ({ tabId }) => !tabId,
  render: () => <ToolbarManager />,
}));
