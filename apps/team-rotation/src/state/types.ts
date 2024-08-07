import type { z } from 'zod';
import type {
  rotationSchema,
  stateSchema,
} from './schema.ts';

export type RotationType = z.infer<typeof rotationSchema>;
export type StateType = z.infer<typeof stateSchema>;
