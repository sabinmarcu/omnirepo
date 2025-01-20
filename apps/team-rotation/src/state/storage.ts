import {
  b64Encoder,
  pakoEncoder,
  queryStorage,
} from '@sabinmarcu/jotai-storage-adapter-querystring';
import { atomWithStorage } from 'jotai/utils';
import type { Encoder } from '@sabinmarcu/jotai-storage-adapter-querystring/types';
import type { z } from 'zod';
import { seedData } from './seed.js';
import { stateSchema } from './schema.js';

const adaptableEncoder = {
  encode: pakoEncoder.encode,
  decode: (input: string) => {
    let jsonInput: unknown;
    try {
      jsonInput = pakoEncoder.decode(input);
    } catch {
      jsonInput = b64Encoder.decode(input);
    }
    return stateSchema.parse(jsonInput);
  },
} as const satisfies Encoder<z.infer<typeof stateSchema>>;

const storage = queryStorage(adaptableEncoder);
export const storageAtom = atomWithStorage(
  'state',
  storage.getItem('state', seedData),
  storage,
);
