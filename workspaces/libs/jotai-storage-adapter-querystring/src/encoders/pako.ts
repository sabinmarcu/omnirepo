import pako from 'pako';
import {
  fromUint8Array,
  toUint8Array,
} from 'js-base64';
import type { ZodSchema } from 'zod';
import type { Encoder } from '../types.js';
import { jsonEncoder } from './json.js';

export const pakoEncoder = {
  encode: (input: any) => {
    const data = new TextEncoder().encode(jsonEncoder.encode(input));
    const compressed = pako.deflate(data, { level: 9 });
    return fromUint8Array(compressed);
  },
  decode: (input: string) => {
    const data = toUint8Array(input);
    const uncompressed = pako.inflate(data, { to: 'string' });
    return jsonEncoder.decode(uncompressed);
  },
} satisfies Encoder<any>;

export const pakoEncoderFromSchema = <T = unknown>(schema: ZodSchema<T>) => ({
  encode: pakoEncoder.encode,
  decode: (input: string) => schema.parse(pakoEncoder.decode(input)),
} satisfies Encoder<T>);

