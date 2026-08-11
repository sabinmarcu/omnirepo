import type { IFs } from 'memfs';
import { glob } from 'glob';

export const mockGlob = (
  fs: IFs,
  globInstance = glob,
) => {
  const mockedGlob = (pattern: string, options: any) => (
    globInstance(pattern, {
      ...options,
      fs,
    })
  );
  const mockedGlobSync = (pattern: string, options: any) => (
    globInstance.sync(pattern, {
      ...options,
      fs,
    })
  );
  mockedGlob.sync = mockedGlobSync;
  return mockedGlob;
};
