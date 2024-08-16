// eslint-disable-next-line unicorn/prevent-abbreviations
import { z } from 'zod';

const environmentSchema = z.object({
  TIMER_40K_RELEASE_DATE: z.string(),
  TIMER_40K_GAME_NAME: z.string(),
  TIMER_40K_EARLY_RELEASE_DATE: z.string().optional(),
});

// eslint-disable-next-line unicorn/prevent-abbreviations
export type EnvType = z.infer<typeof environmentSchema>;
// eslint-disable-next-line unicorn/prevent-abbreviations
export const env = environmentSchema.parse({
  TIMER_40K_RELEASE_DATE: process.env.TIMER_40K_RELEASE_DATE,
  TIMER_40K_EARLY_RELEASE_DATE: process.env.TIMER_40K_EARLY_RELEASE_DATE,
  TIMER_40K_GAME_NAME: process.env.TIMER_40K_GAME_NAME,
});
