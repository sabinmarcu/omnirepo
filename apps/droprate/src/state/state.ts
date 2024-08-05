import { z } from 'zod';
import { atomWithStorage } from 'jotai/utils';
import {
  queryStorage,
  b64EncoderFromSchema,
} from '@sabinmarcu/jotai-storage-adapter-querystring';

export const stateSchema = z.object({
  dropRate: z.number(),
  runsList: z.array(z.number()),
});

export type StateType = z.infer<typeof stateSchema>;

const storage = queryStorage(b64EncoderFromSchema(stateSchema));
export const storedState = atomWithStorage(
  'state',

  storage.getItem('state', {
    dropRate: 1,
    runsList: [
      10,
      50,
      100,
    ],
  }),
  storage,
);
