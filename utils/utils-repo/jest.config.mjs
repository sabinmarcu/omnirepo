import {
  generateFromPath,
} from '../../jest.config.base.mjs';

export default generateFromPath(
  (await import('url')).fileURLToPath(
    new URL('.', import.meta.url),
  ),
);
