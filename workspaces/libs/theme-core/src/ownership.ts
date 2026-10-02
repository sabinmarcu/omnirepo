import type { Theme } from './types.js';

const roots = new WeakMap<object, Map<string, object>>();

/** Reserve a compiled view's names atomically; ownership is separate from its prefix. */
export function claimThemeAllocations(
  theme: Pick<Theme, 'sources' | 'tokens'>,
  root: object,
  owner: object,
  additionalNames: readonly string[] = [],
): void {
  const existing = roots.get(root);
  const names = [
    ...theme.sources.map((source) => source.name),
    ...theme.tokens.map((token) => token.name),
    ...additionalNames,
  ];
  for (const name of names) {
    const current = existing?.get(name);
    if (current && current !== owner) throw new Error(`Theme allocation ownership conflict: ${name}`);
  }
  const claims = existing ?? new Map<string, object>();
  for (const name of names) claims.set(name, owner);
  roots.set(root, claims);
}

export function releaseThemeAllocations(root: object, owner: object): void {
  const claims = roots.get(root);
  if (!claims) return;
  for (const [name, current] of claims) if (current === owner) claims.delete(name);
  if (claims.size === 0) roots.delete(root);
}
