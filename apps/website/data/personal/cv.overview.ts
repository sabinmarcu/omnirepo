import { readContent } from '@/content/readContent';
import {
  overviewSchema,
} from './cv.schema';

export const overview = await readContent(
  'personal/cv/overview.mdx',
  { schema: overviewSchema },
);
