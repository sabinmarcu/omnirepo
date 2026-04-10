import type { ZodType } from 'zod';
import z from 'zod';
import { parse } from 'codehike';
import type { ReactNode } from 'react';
import { readRawContent } from '@/content/readRawContent';
import {
  tocSchema,
  metadataSchema,
} from './schemas';
import { Resource } from './Resource';

const mdxMetadataSchema = metadataSchema.extend({
  toc: tocSchema,
});

const mdxContentSchema = z.any();

export class GenericMdxResource<
  ContentSchema extends ZodType = typeof mdxContentSchema,
  MetadataSchema extends ZodType = typeof mdxMetadataSchema,
> extends Resource {
  public metadataSchema: MetadataSchema = mdxMetadataSchema as unknown as MetadataSchema;

  public contentSchema: ContentSchema = mdxContentSchema as unknown as ContentSchema;

  protected metadata: z.infer<MetadataSchema> = undefined as any;

  protected codehikeContent: z.infer<ContentSchema> = undefined as any;

  protected rawMdxContent: ReactNode;

  protected async parse() {
    const normalizedRawContent = typeof this.rawContent === 'string'
      ? await readRawContent(this.rawContent)
      : this.rawContent;

    const { default: content, ...metadata } = normalizedRawContent;
    this.metadata = this.metadataSchema.parse(metadata);
    this.rawMdxContent = parse(content);
    this.codehikeContent = this.contentSchema.parse(this.rawMdxContent);
  }
}
