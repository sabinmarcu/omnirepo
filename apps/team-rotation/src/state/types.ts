import type { z } from 'zod';
import type {
  rotationTeamMemberSchema,
  rotationTeamSchema,
  rotationSchema,
  stateSchema,
} from './schema.ts';

export type RotationTeamMemberType = z.infer<typeof rotationTeamMemberSchema>;
export type RotationTeamType = z.infer<typeof rotationTeamSchema>;
export type RotationType = z.infer<typeof rotationSchema>;
export type StateType = z.infer<typeof stateSchema>;
