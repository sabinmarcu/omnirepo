import { getLogger } from './debug.js';

const logger = getLogger('importer');

const cache = new Map<string, any>();
export const tryImport = async (what: string) => {
  if (!cache.has(what)) {
    try {
      const module = await import(what);
      cache.set(what, module);
    } catch {
      cache.set(what, undefined);
      logger.warn(`Could not import ${what}. If you need it, check that you have it installed.`);
    }
  }
  const module = cache.get(what);
  return module;
};
