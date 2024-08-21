import { z } from 'zod';
import { ENV_DEBUG_KEY } from './constants.js';

export const envSchema = z.object({
  [ENV_DEBUG_KEY]: z.string().default(''),
});

export const env = envSchema.parse(process.env);
