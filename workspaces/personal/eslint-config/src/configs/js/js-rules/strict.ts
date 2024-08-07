import type { Config } from '../../../types.js';

export default {
  strict: [
    'error',
    'never',
  ],
} as const satisfies Config['rules'];
