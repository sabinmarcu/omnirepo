import { extensions } from './extensions/index.js';

for (const extension of extensions) {
  if (extension.manager) {
    extension.manager();
  }
}
