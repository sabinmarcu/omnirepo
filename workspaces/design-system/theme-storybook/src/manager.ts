import '@sabinmarcu/storybook-addon-split-toolbars/manager';
import '@sabinmarcu/storybook-addon-theme-overrider/manager';
import '@sabinmarcu/storybook-addon-mirror-preview/manager';

import { extensions } from './extensions/index.js';

for (const extension of extensions) {
  if ('manager' in extension && extension.manager) {
    extension.manager();
  }
}
