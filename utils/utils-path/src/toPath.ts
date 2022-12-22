import url from 'node:url';
import type { PathLike } from './types';

export const toPath = (
  path: PathLike,
) => {
  if (path instanceof URL) {
    return url.fileURLToPath(path);
  }
  return path;
};
