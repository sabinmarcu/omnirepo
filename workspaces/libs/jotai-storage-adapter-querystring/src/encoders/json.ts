import type { ZodSchema } from 'zod';
import type { Encoder } from '../types';

export const jsonEncoder = {
  encode: (input: any) => JSON.stringify(input),
  decode: (input: string) => JSON.parse(input),
} satisfies Encoder<any>;

export const jsonEncoderFromSchema = <T = unknown>(schema: ZodSchema<T>) => ({
  encode: jsonEncoder.encode,
  decode: (input: string) => schema.parse(jsonEncoder.decode(input)),
} satisfies Encoder<T>);
