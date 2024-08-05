import type { Config } from '../../../types';

export default {
  strict: [
    'error',
    'never',
  ],
} as const satisfies Config['rules'];
