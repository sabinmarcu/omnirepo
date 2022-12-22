import url from 'node:url';
import type { PathLike } from './types';

export const toUrl = (
  path: PathLike,
) => {
  if (path instanceof URL) {
    return path;
  }
  return url;
};
