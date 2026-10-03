import type { SourceRepresentation } from '@sabinmarcu/theme-core';

export function readInputPath(input: unknown, path: readonly string[]): unknown {
  let value = input;
  for (const key of path) {
    if (value === null || typeof value !== 'object' || !Object.hasOwn(value, key)) {
      throw new Error(`Missing source input: ${path.join('.')}`);
    }
    value = (value as Record<string, unknown>)[key];
  }
  return value;
}

export function sourcePatch(
  path: readonly string[],
  value: unknown,
): Readonly<Record<string, unknown>> {
  if (path.length === 0) throw new Error('A source input path is required');
  let input = value;
  for (let index = path.length - 1; index >= 0; index -= 1) {
    input = Object.fromEntries([[path[index]!, input]]);
  }
  return input as Readonly<Record<string, unknown>>;
}

export function formatSourceInput(value: unknown, codec: SourceRepresentation): string {
  if (codec.kind === 'json') {
    const json = JSON.stringify(value, null, 2);
    if (json === undefined) throw new Error('Expected a JSON source value');
    return json;
  }
  if (codec.kind === 'number') {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Expected a finite number');
    return String(value);
  }
  if (typeof value !== 'string') throw new Error('Expected a CSS source string');
  return value;
}

export function parseSourceInput(text: string, codec: SourceRepresentation): unknown {
  if (codec.kind === 'json') return JSON.parse(text);
  if (codec.kind === 'number') {
    const number = text.trim() === '' ? NaN : Number(text);
    if (!Number.isFinite(number)) throw new Error('Enter a finite number without a CSS unit');
    return number;
  }
  return text;
}
