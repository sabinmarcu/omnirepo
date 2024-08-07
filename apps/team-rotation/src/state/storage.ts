import {
  b64EncoderFromSchema,
  queryStorage,
} from '@sabinmarcu/jotai-storage-adapter-querystring';
import { atomWithStorage } from 'jotai/utils';
import { seedData } from './seed.ts';
import { stateSchema } from './schema.ts';

const storage = queryStorage(b64EncoderFromSchema(stateSchema));
export const storageAtom = atomWithStorage(
  'state',
  storage.getItem('state', seedData),
  storage,
);
