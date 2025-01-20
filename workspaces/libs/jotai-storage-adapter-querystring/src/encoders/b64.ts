import type { ZodSchema } from 'zod';
import {
  fromBase64,
  toBase64,
} from 'js-base64';
import type { Encoder } from '../types.js';
import { jsonEncoder } from './json.js';

export const b64Encoder = {
  encode: (input: any) => toBase64(jsonEncoder.encode(input), true),
  decode: (input: string) => jsonEncoder.decode(fromBase64(input)),
} satisfies Encoder<any>;

export const b64EncoderFromSchema = <T = unknown>(schema: ZodSchema<T>) => ({
  encode: b64Encoder.encode,
  decode: (input: string) => schema.parse(b64Encoder.decode(input)),
} satisfies Encoder<T>);
