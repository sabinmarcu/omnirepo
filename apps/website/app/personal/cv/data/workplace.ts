import { parse } from 'codehike';
import fs from 'node:fs/promises';
import path from 'node:path';
import { personalPagesPath } from '@/constants/paths';
import {
  workplaceMasterMetadataSchema,
  workplaceSchema,
} from '../schemas';

const workplacePath = path.resolve(
  personalPagesPath,
  'cv/workplace',
);

const files = await fs.readdir(
  workplacePath,
);

const mdxFiles = files.filter((it) => it.endsWith('.mdx'));
const rawWorkplaces = await Promise.all(mdxFiles.map(
  async (filename) => {
    const { default: Page, ...rest } = await import(
      `../workplace/${filename}`
    );
    const metadata = workplaceMasterMetadataSchema.parse(rest);
    const parsedPage = parse(Page);
    return {
      data: parsedPage,
      metadata,
    } as const;
  },
));

export const workplaces: ({
  data: typeof workplaceSchema._output
} & Omit<typeof rawWorkplaces[number], 'data'>)[] = [];

for (const workplace of rawWorkplaces) {
  const parsed = workplaceSchema.parse(workplace.data);
  const render = {
    ...workplace,
    data: parsed,
  };
  workplaces.push(render);
}
