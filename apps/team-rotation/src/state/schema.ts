import { z } from 'zod';

export const rotationTeamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const rotationTeamSchema = z.object({
  name: z.string(),
  id: z.string(),
  list: z.array(rotationTeamMemberSchema),
});

export const rotationSchema = z.object({
  name: z.string(),
  every: z.number(),
  startDate: z.string(),
  id: z.string(),
  teams: z.array(
    rotationTeamSchema,
  ),
});

export const stateSchema = z.object({
  pageTitle: z.string(),
  rotations: z.array(rotationSchema),
});
