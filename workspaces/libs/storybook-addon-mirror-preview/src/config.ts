import { WINDOW_PROPERTY } from './constants.js';
import { configTemplate } from './renderers/config.js';
import type { MirrorConfig } from './types.js';

export const config = (() => {
  const localConfig: MirrorConfig[] = [];
  const updateConfig = (inputs: readonly MirrorConfig[]) => {
    localConfig.push(...inputs);
  };

  return {
    get config() {
      const windowConfig = (globalThis as unknown as {
        [WINDOW_PROPERTY]?: MirrorConfig[]
      })[WINDOW_PROPERTY];

      const finalConfig = [
        ...windowConfig ?? [],
        ...localConfig,
      ];
      return Object.freeze(finalConfig);
    },
    set config(input: Parameters<typeof updateConfig>[0]) {
      updateConfig(input);
    },

    manager(head: string) {
      return `
${configTemplate(localConfig)}
${head}
`.trim();
    },
  };
})();
