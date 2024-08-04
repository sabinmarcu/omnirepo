import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupPluginRules } from '@eslint/compat';

const dirname = fileURLToPath(new URL('.', import.meta.url));
const compat = new FlatCompat({
  baseDirectory: dirname,
});

export const legacyPlugin = (name: string, alias = name) => {
  const plugin = compat.plugins(name)[0]?.plugins?.[alias];

  if (!plugin) {
    throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
  }

  return fixupPluginRules(plugin as any);
};
