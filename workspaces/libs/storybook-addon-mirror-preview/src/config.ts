import { WINDOW_PROPERTY } from './constants.js';
import { configTemplate } from './renderers/config.js';
import type { MirrorConfiguration } from './types.js';

export const config = (() => {
  const localConfig: MirrorConfiguration[] = [];
  const updateConfig = (inputs: readonly MirrorConfiguration[]) => {
    localConfig.push(...inputs);
  };

  return {
    get config() {
      const {
        [WINDOW_PROPERTY]: windowConfig,
      } = (globalThis as unknown as {
        window: {
          [WINDOW_PROPERTY]?: MirrorConfiguration[]
        }
      }).window;

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
