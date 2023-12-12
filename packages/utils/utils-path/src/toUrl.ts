import url from 'node:url';
import type { PathLike } from './types';

/**
 * Converts a URL or path to a URL
 * @param {PathLike} path The path to convert.
 * @returns {URL} The converted URL.
 */
export const toUrl = (path: PathLike) => {
  if (path instanceof URL) {
    return path;
  }
  return url.pathToFileURL(path);
};
