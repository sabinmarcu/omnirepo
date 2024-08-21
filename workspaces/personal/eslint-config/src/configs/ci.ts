import type { Config } from '../types.js';

const isCI = process.env.CI === 'true';
export const ciConfig = isCI
  ? [
    {
      name: 'CI Ignores',
      ignores: ['**/__@(fixtures|mocks|snapshots)__/**', '**/*.@(spec|test).*'],
    },
  ] as const satisfies Config[]
  : [] satisfies Config[];

export default ciConfig;
