import type { Config } from '../types';

export const makeConfigFactory = (...files: [string, ...string[]]) => (
  (contents: Config) => ({
    files: [
      ...(contents.files ?? []),
      ...files,
    ].flat().map((it) => (it.startsWith('**/') ? it : `**/${it}`)),
    ...contents,
  } as const satisfies Config)
);
