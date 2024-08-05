import type { Volume } from 'memfs/lib/volume';
import glob from 'glob';

export const mockGlob = (
  fs: Volume,
  globInstance = glob,
) => {
  const mockedGlob = (pattern: string, options: any, callback: any) => (
    globInstance(pattern, {
      ...options,
      fs,
    }, callback)
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
