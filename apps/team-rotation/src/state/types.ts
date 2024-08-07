import type { z } from 'zod';
import type {
  stateSchema,
} from './schema.ts';
export type StateType = z.infer<typeof stateSchema>;
