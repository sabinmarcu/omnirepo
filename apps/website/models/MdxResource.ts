import type { ZodType } from 'zod';
import {
  tocSchema,
  metadataSchema,
} from './schemas';
import { GenericMdxResource } from './GenericMdxResource';

const mdxMetadataSchema = metadataSchema.extend({
  toc: tocSchema,
});

export class MdxResource<
  ContentSchema extends ZodType = typeof GenericMdxResource.prototype.contentSchema,
  MetadataSchema extends typeof mdxMetadataSchema = typeof mdxMetadataSchema,

> extends GenericMdxResource<ContentSchema, MetadataSchema> {
  static resourceFilter = (path: string) => path.endsWith('.mdx');

  static get slugs(): Promise<string[]> {
    return (async () => {
      const list = await this.getList();
      return list.map(({ slug }) => ({ slug }));
    })();
  }

  static async fromSlug<
    // eslint-disable-next-line function-paren-newline
    T extends new (...arguments_: any[]) => MdxResource,
  >(
    this: T,
    slug: string,
  ): Promise<InstanceType<T> | undefined> {
    const list = await (this as any).getList() as MdxResource[];
    const resource = list.find((item) => item.slug === slug);
    if (!resource) {
      return undefined;
    }
    return resource as InstanceType<T>;
  }

  public metadataSchema: MetadataSchema = mdxMetadataSchema as unknown as MetadataSchema;

  get title() { return this.metadata.title; }

  get slug() { return this.metadata.slug ?? this.fileDefinition?.filename ?? 'unknown'; }
}
