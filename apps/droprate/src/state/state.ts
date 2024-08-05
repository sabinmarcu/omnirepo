import { z } from 'zod';
import { atomWithStorage } from 'jotai/utils';
import {
  queryStorage,
  b64EncoderFromSchema,
} from '@sabinmarcu/jotai-storage-adapter-querystring';
import { nanoid } from 'nanoid';

export const stateSchema = z.object({
  dropRate: z.number(),
  runsList: z.array(z.object({
    runs: z.number(),
    id: z.string(),
  })),
});

export type StateType = z.infer<typeof stateSchema>;

const storage = queryStorage(b64EncoderFromSchema(stateSchema));
export const storedState = atomWithStorage(
  'state',

  storage.getItem('state', {
    dropRate: 1,
    runsList: [
      {
        runs: 10,
        id: nanoid(),
      },
      {
        runs: 50,
        id: nanoid(),
      },
      {
        runs: 100,
        id: nanoid(),
      },
    ],
  }),
  storage,
);
