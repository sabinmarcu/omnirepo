import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import {
  exists,
} from './exists.js';

/**
 * Reads a JSON file and returns its contents (async)
 * @param path The path to be read
 * @returns The contents of the file
 */
export const readJson = async <T>(
  path: string,
): Promise<T> => {
  if (!await exists(path)) {
    throw new Error(`File not found: ${path}`);
  }
  const contents = await fsPromises.readFile(path, 'utf8');
  try {
    return JSON.parse(contents);
  } catch (error) {
    throw new Error(
      `Failed to parse JSON file: ${path}`,
      { cause: error },
    );
  }
};

/**
 * Reads a JSON file and returns its contents
 * @param path The path to be read
 * @returns The contents of the file
 */
export const readJsonSync = <T>(
  path: string,
): T => {
  if (!fs.existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }
  const contents = fs.readFileSync(path, 'utf8');
  try {
    return JSON.parse(contents);
  } catch (error) {
    throw new Error(
      `Failed to parse JSON file: ${path}`,
      { cause: error },
    );
  }
};
