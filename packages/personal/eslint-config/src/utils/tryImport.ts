export const tryImport = async (what: string) => {
  try {
    const module = await import(what);
    return module.default ?? module;
  } catch {
    console.warn(`Could not import ${what}. If you need it, check that you have it installed.`);
  }
  return undefined;
};
