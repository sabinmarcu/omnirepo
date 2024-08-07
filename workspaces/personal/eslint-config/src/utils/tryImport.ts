import { getLogger } from './debug.js';

const logger = getLogger('importer');

export const tryImport = async (what: string) => {
  try {
    const module = await import(what);
    return module.default ?? module;
  } catch {
    logger.warn(`Could not import ${what}. If you need it, check that you have it installed.`);
  }
  return undefined;
};
