import { z } from 'zod';

export const rotationSchema = z.object({
  name: z.string(),
});

export const stateSchema = z.object({
  pageTitle: z.string(),
  startDate: z.string(),
  rotations: z.array(rotationSchema),
});

