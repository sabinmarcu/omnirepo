import {
  describe,
  expect,
  it,
} from 'vitest';
import { createDevtoolsMemory } from './persistence.js';
import type { DevtoolsStorage } from './persistence.js';

const createStorage = (): DevtoolsStorage & { readonly entries: Map<string, string> } => {
  const entries = new Map<string, string>();
  return {
    entries,
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => { entries.set(key, value); },
  };
};

const failingStorage: DevtoolsStorage = {
  getItem: () => { throw new Error('blocked'); },
  setItem: () => { throw new Error('quota'); },
};

describe('createDevtoolsMemory', () => {
  it('restores the color format in a later session and ignores unknown stored formats', () => {
    const preferences = createStorage();
    createDevtoolsMemory(null, { preferences }).setColorFormat('oklch');

    expect(createDevtoolsMemory(null, { preferences }).colorFormat()).toBe('oklch');

    preferences.setItem('sabinmarcu-theme-devtools:color-format', 'cmyk');
    expect(createDevtoolsMemory(null, { preferences }).colorFormat()).toBeUndefined();
  });

  it('shares expansion between inspectors on one session store without overwriting', () => {
    const session = createStorage();
    const panel = createDevtoolsMemory(null, { session });
    const sidebar = createDevtoolsMemory(null, { session });

    panel.setExpanded('website\u{0}family\u{0}["colors"]', true);
    sidebar.setExpanded('website\u{0}shared\u{0}["grid"]', true);
    panel.setExpanded('website\u{0}family\u{0}["colors","primary"]', true);

    const remounted = createDevtoolsMemory(null, { session });
    expect(remounted.expanded('website\u{0}family\u{0}["colors"]')).toBe(true);
    expect(remounted.expanded('website\u{0}shared\u{0}["grid"]')).toBe(true);
    expect(remounted.expanded('website\u{0}family\u{0}["colors","primary"]')).toBe(true);
    expect(remounted.expanded('website\u{0}family\u{0}["breakpoint"]')).toBeUndefined();

    sidebar.setExpanded('website\u{0}family\u{0}["colors"]', false);
    expect(panel.expanded('website\u{0}family\u{0}["colors"]')).toBe(false);
  });

  it('keeps state for the inspector lifetime when storage is unavailable or disabled', () => {
    for (const memory of [
      createDevtoolsMemory(null, {
        preferences: failingStorage,
        session: failingStorage,
      }),
      createDevtoolsMemory(null, {
        preferences: null,
        session: null,
      }),
    ]) {
      expect(memory.colorFormat()).toBeUndefined();
      memory.setColorFormat('hsl');
      memory.setExpanded('key', true);
      expect(memory.colorFormat()).toBe('hsl');
      expect(memory.expanded('key')).toBe(true);
    }
  });

  it('recovers from a corrupted session entry', () => {
    const session = createStorage();
    session.setItem('sabinmarcu-theme-devtools:expanded', '{not json');
    const memory = createDevtoolsMemory(null, { session });

    expect(memory.expanded('key')).toBeUndefined();
    memory.setExpanded('key', true);
    expect(createDevtoolsMemory(null, { session }).expanded('key')).toBe(true);
  });
});
