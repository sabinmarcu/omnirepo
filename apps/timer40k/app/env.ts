import { z } from 'zod';

const envSchema = z.object({
  TIMER_40K_RELEASE_DATE: z.string(),
});

export type EnvType = z.infer<typeof envSchema>;
export const env = envSchema.parse({
  TIMER_40K_RELEASE_DATE: process.env.TIMER_40K_RELEASE_DATE,
});