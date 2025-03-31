import { merge as deepMerge } from 'ts-deepmerge';
import type { InputOptions } from './types.js';
import { styles as previewStyles } from './styles.preview.js';
import { styles as managerStyles } from './styles.manager.js';
import { stylesTemplate } from './renderers/styles.js';
import { configTemplate } from './renderers/config.js';
import { WINDOW_PROPERTY } from './constants.js';
import { normalizeOptions } from './defaults.minimal.js';

export const config = (() => {
  let localConfig: InputOptions = {};
  const updateConfig = (input: Parameters<typeof normalizeOptions>[0]) => {
    localConfig = normalizeOptions(input);
  };

  return {
    get config() {
      const { [WINDOW_PROPERTY]: windowConfig } = (globalThis as any).window;
      return Object.freeze(deepMerge(windowConfig ?? localConfig));
    },
    set config(input: Parameters<typeof updateConfig>[0]) {
      updateConfig(input);
    },

    preview(head: string) {
      return `
${configTemplate(localConfig)}
${stylesTemplate(previewStyles)}
${head}
`.trim();
    },

    manager(head: string) {
      return `
${configTemplate(localConfig)}
${stylesTemplate(managerStyles)}
${head}
`.trim();
    },
  };
})();
