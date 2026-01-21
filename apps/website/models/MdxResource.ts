import type { ZodType } from 'zod';
import {
  tocSchema,
  metadataSchema,
} from './schemas';
import { GenericMdxResource } from './GenericMdxResource';
import { lazy } from './lazy';

const mdxMetadataSchema = metadataSchema.extend({
  toc: tocSchema,
});

export class MdxResource<
  ContentSchema extends ZodType = InstanceType<typeof GenericMdxResource>['contentSchema'],
  MetadataSchema extends typeof mdxMetadataSchema = typeof mdxMetadataSchema,
> extends GenericMdxResource<ContentSchema, MetadataSchema> {
  static resourceFilter = (path: string) => path.endsWith('.mdx');

  static get slugs(): Promise<{ slug: string }[]> {
    return (async () => {
      const list = await (this as any).getList();
      return Promise.all(
        list.map(async (resource: MdxResource) => ({
          slug: await resource.slug,
        })),
      );
    })();
  }

  static async fromSlug<
    T extends new (...arguments_: any[]) => any,
  >(
    this: T,
    slug: string,
  ): Promise<InstanceType<T> | undefined> {
    const list = await (this as any).getList() as InstanceType<T>[];

    for (const item of list) {
      if (await (item as MdxResource).slug === slug) {
        return item;
      }
    }

    return undefined;
  }

  public metadataSchema: MetadataSchema = mdxMetadataSchema as unknown as MetadataSchema;

  title = lazy(
    async () => (await this.metadata).title,
  );

  slug = lazy(
    async () => {
      const metadata = await this.metadata;
      if (metadata.slug) {
        return metadata.slug;
      }

      const pathDefinition = await this.pathDefinition;
      return pathDefinition?.filename ?? 'unknown';
    },
  );

  toc = lazy(
    async () => (await this.metadata).toc,
  );
}
