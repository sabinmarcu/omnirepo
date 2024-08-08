import { z } from 'zod';

export const rotationTeamSchema = z.object({
  name: z.string(),
  list: z.array(z.string()),
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
