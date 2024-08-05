import type { ZodSchema } from 'zod';
import type { Encoder } from '../types';
import { jsonEncoder } from './json';

export const b64Encoder = {
  encode: (input: any) => btoa(jsonEncoder.encode(input)),
  decode: (input: string) => jsonEncoder.decode(atob(input)),
} satisfies Encoder<any>;

export const b64EncoderFromSchema = <T = unknown>(schema: ZodSchema<T>) => ({
  encode: b64Encoder.encode,
  decode: (input: string) => schema.parse(b64Encoder.decode(input)),
} satisfies Encoder<T>);
