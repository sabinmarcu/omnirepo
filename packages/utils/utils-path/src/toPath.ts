import url from 'node:url';
import type { PathLike } from './types';

/**
 * Converts a URL or path to a file path.
 * @param {PathLike} path The path to convert.
 * @returns {string} The converted path.
 */
export const toPath = (path: PathLike) => {
  if (path instanceof URL) {
    return url.fileURLToPath(path);
  }
  return path;
};
