import type { ColorFormat } from './colors.js';

/** The Web Storage surface the inspector needs; any `Storage` satisfies it. */
export type DevtoolsStorage = Pick<Storage, 'getItem' | 'setItem'>;

export type ThemeDevtoolsPersistence = {
  /**
   * Preferences kept across sessions (the color format). Defaults to the UI document's
   * `localStorage`; `null` disables.
   */
  readonly preferences?: DevtoolsStorage | null;
  /**
   * Memory kept for the current session (expanded tree branches). Defaults to the UI
   * document's `sessionStorage`; `null` disables.
   */
  readonly session?: DevtoolsStorage | null;
};

/** Inspector memory; storage failures (quota, blocked storage) degrade to in-memory state. */
export type DevtoolsMemory = {
  colorFormat(): ColorFormat | undefined;
  setColorFormat(format: ColorFormat): void;
  expanded(key: string): boolean | undefined;
  setExpanded(key: string, open: boolean): void;
};

const colorFormatKey = 'sabinmarcu-theme-devtools:color-format';
const expansionKey = 'sabinmarcu-theme-devtools:expanded';
const colorFormats: ReadonlySet<string> = new Set<ColorFormat>(['hex', 'oklch', 'hsl', 'rgb']);

const storageOf = (
  supplied: DevtoolsStorage | null | undefined,
  fallback: () => DevtoolsStorage | undefined,
): DevtoolsStorage | undefined => {
  if (supplied !== undefined) return supplied ?? undefined;
  try {
    // Opaque origins and blocked storage throw on access.
    return fallback();
  } catch {
    return undefined;
  }
};

const read = (storage: DevtoolsStorage | undefined, key: string): string | null => {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

/** Returns whether the value reached storage. */
const write = (storage: DevtoolsStorage | undefined, key: string, value: string): boolean => {
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    // Quota or policy failures keep the in-memory value only.
    return false;
  }
};

/**
 * Remember inspector UI state. Expansion is re-read from the session store on every lookup and
 * merged on every write, so several inspectors sharing one store (e.g. a DevTools panel and an
 * Elements sidebar) keep each other's branches instead of overwriting them.
 */
export function createDevtoolsMemory(
  realm: Window | null,
  persistence: ThemeDevtoolsPersistence = {},
): DevtoolsMemory {
  const preferences = storageOf(persistence.preferences, () => realm?.localStorage);
  const session = storageOf(persistence.session, () => realm?.sessionStorage);
  // Values that could not be stored; they take precedence over (stale) storage.
  let unsavedColorFormat: ColorFormat | undefined;
  const unsavedExpansion = new Map<string, boolean>();
  let cachedRaw: string | null = null;
  let cached: Readonly<Record<string, boolean>> = {};
  const stored = (): Readonly<Record<string, boolean>> => {
    const raw = read(session, expansionKey);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        const parsed: unknown = raw === null ? {} : JSON.parse(raw);
        cached = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
          ? parsed as Record<string, boolean>
          : {};
      } catch {
        cached = {};
      }
    }
    return cached;
  };

  return Object.freeze({
    colorFormat() {
      if (unsavedColorFormat) return unsavedColorFormat;
      const value = read(preferences, colorFormatKey);
      return value !== null && colorFormats.has(value) ? value as ColorFormat : undefined;
    },
    setColorFormat(format: ColorFormat) {
      unsavedColorFormat = write(preferences, colorFormatKey, format) ? undefined : format;
    },
    expanded(key: string) {
      if (unsavedExpansion.has(key)) return unsavedExpansion.get(key);
      const value = stored()[key];
      return typeof value === 'boolean' ? value : undefined;
    },
    setExpanded(key: string, open: boolean) {
      const saved = write(session, expansionKey, JSON.stringify({
        ...stored(),
        [key]: open,
      }));
      if (saved) unsavedExpansion.delete(key);
      else unsavedExpansion.set(key, open);
    },
  });
}
