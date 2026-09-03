import z from 'zod';
import { GenericMdxResource } from './GenericMdxResource';
import { tocSchema } from './schemas';
import { lazy } from './lazy';

const tagMetadataSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  toc: tocSchema,
});

export class TagResource extends GenericMdxResource<z.ZodAny, typeof tagMetadataSchema> {
  static resourceDirectory = 'tags';

  static resourceFilter = (path: string) => path.endsWith('.mdx');

  public metadataSchema = tagMetadataSchema;

  public contentSchema = z.any();

  tagId = lazy(
    async () => (await this.id).replaceAll('.', ':'),
  );
}
