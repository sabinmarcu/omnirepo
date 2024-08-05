import { z } from 'zod';
import { ENV_DEBUG_KEY } from './constants';

export const environmentSchema = z.object({
  [ENV_DEBUG_KEY]: z.string().default(''),
});

// eslint-disable-next-line unicorn/prevent-abbreviations
export const env = environmentSchema.parse(process.env);
