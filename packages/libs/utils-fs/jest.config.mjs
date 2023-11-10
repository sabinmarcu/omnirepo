import {
  generateFromPath,
} from '../../../.config/jest/jest.config.project.mjs';

export default generateFromPath(
  (await import('url')).fileURLToPath(
    new URL('.', import.meta.url),
  ),
);
