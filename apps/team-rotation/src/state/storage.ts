import { z } from 'zod';
import {
  b64EncoderFromSchema,
  queryStorage,
} from '@sabinmarcu/jotai-storage-adapter-querystring';
import { atomWithStorage } from 'jotai/utils';

export const stateSchema = z.object({
  pageTitle: z.string(),
});

export type StateType = z.infer<typeof stateSchema>;

const storage = queryStorage(b64EncoderFromSchema(stateSchema));
export const storageAtom = atomWithStorage(
  'state',
  storage.getItem('state', {
    pageTitle: 'This is my team!',
  }),
  storage,
);
