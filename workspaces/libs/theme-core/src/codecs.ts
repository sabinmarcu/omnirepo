import type {
  JsonValue,
  SourceCodec,
  SourceRepresentation,
} from './types.js';

const representations = new WeakMap<object, SourceRepresentation>();

/** Mark a built-in codec as a manifest-safe declarative representation. */
export function standardCodec<Value>(
  codec: SourceCodec<Value>,
  representation: SourceRepresentation,
): SourceCodec<Value> {
  representations.set(codec, representation);
  return codec;
}

/** Only codecs made by this module or core descriptors may enter a manifest. */
export const sourceRepresentation = (codec: object): SourceRepresentation | undefined => (
  representations.get(codec)
);

const finiteNumber = (value: unknown): value is number => (
  typeof value === 'number' && Number.isFinite(value)
);

const validUnit = (unit: string) => /^[a-zA-Z%][a-zA-Z\d%]*$/.test(unit);

/** A finite number serialized with an explicit, declarative CSS unit. */
export function numberUnitCodec(unit: string): SourceCodec<number> {
  if (!validUnit(unit)) throw new Error('Expected a CSS unit');
  const declaration = new RegExp(`^([+-]?(?:\\d+\\.?\\d*|\\.\\d+)(?:[eE][+-]?\\d+)?)${unit}$`);
  return standardCodec(Object.freeze({
    encode(value: number) {
      if (!finiteNumber(value)) throw new Error('Expected a finite number');
      return `${value}${unit}`;
    },
    decode(value: string) {
      const match = declaration.exec(value.trim());
      if (!match) throw new Error(`Expected a ${unit} declaration`);
      const number = Number(match[1]);
      if (!finiteNumber(number)) throw new Error('Expected a finite number');
      return number;
    },
    representation: Object.freeze({
      kind: 'number' as const,
      unit,
    }),
  }), Object.freeze({
    kind: 'number',
    unit,
  }));
}

const jsonValue = (value: unknown): value is JsonValue => {
  const seen = new WeakSet<object>();
  const visit = (child: unknown): boolean => {
    if (child === null || typeof child === 'string' || typeof child === 'boolean') return true;
    if (typeof child === 'number') return Number.isFinite(child);
    if (typeof child !== 'object' || seen.has(child)) return false;
    if (Array.isArray(child)) {
      seen.add(child);
      const descriptors = Object.getOwnPropertyDescriptors(child);
      for (let index = 0; index < child.length; index += 1) {
        const descriptor = descriptors[String(index)];
        if (descriptor === undefined || !('value' in descriptor) || !visit(descriptor.value)) return false;
      }
      seen.delete(child);
      return true;
    }
    const prototype = Reflect.getPrototypeOf(child);
    if (prototype !== Object.prototype && prototype !== null) return false;
    seen.add(child);
    const valid = Object.values(Object.getOwnPropertyDescriptors(child))
      .every((descriptor) => 'value' in descriptor && visit(descriptor.value));
    seen.delete(child);
    return valid;
  };
  return visit(value);
};

const decodeCssString = (value: string): string => {
  const text = value.trim();
  const quote = text[0];
  if ((quote !== '"' && quote !== "'") || text.at(-1) !== quote) {
    throw new Error('Expected a quoted CSS string');
  }
  return text.slice(1, -1).replaceAll(
    /\\(?:\r\n|[\n\r\f]|([\da-fA-F]{1,6})[ \t\r\n\f]?|(.))/g,
    (_escape, hex: string | undefined, character: string | undefined) => {
      if (hex === undefined) return character ?? '';
      const codePoint = Number.parseInt(hex, 16);
      const invalid = codePoint === 0 || codePoint > 0x10_FF_FF
        || (codePoint >= 0xD8_00 && codePoint <= 0xDF_FF);
      return String.fromCodePoint(invalid ? 0xFF_FD : codePoint);
    },
  );
};

/** Complete JSON replacement encoded as a CSS quoted JSON string. */
export const jsonCodec: SourceCodec<JsonValue> = standardCodec(Object.freeze({
  encode(value: JsonValue) {
    if (!jsonValue(value)) throw new Error('Expected a JSON value');
    return JSON.stringify(JSON.stringify(value));
  },
  decode(value: string) {
    const decoded = decodeCssString(value);
    let parsed: unknown;
    try {
      parsed = JSON.parse(decoded);
    } catch {
      throw new Error('Expected JSON in a quoted CSS string');
    }
    if (!jsonValue(parsed)) throw new Error('Expected a JSON value');
    return parsed;
  },
  representation: Object.freeze({ kind: 'json' as const }),
}), Object.freeze({ kind: 'json' }));

/** Authored CSS colors/expressions stay CSS; no JavaScript color conversion or contrast policy. */
export const colorCodec: SourceCodec<string> = standardCodec(Object.freeze({
  encode(value: string) {
    if (typeof value !== 'string' || value.trim() === ''
      || /[;{}]/.test(value) || value.includes('\u{0}')) {
      throw new Error('Expected a single CSS color expression');
    }
    return value.trim();
  },
  decode(value: string) { return this.encode(value); },
  representation: Object.freeze({ kind: 'color' as const }),
}), Object.freeze({ kind: 'color' }));
