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
import { lazy } from './lazy';

const mdxMetadataSchema = metadataSchema.extend({
  toc: tocSchema,
});

const mdxContentSchema = z.any();

export namespace GenericMdxResource {
  export type Options<
    ContentSchema extends ZodType,
    MetadataSchema extends ZodType,
  > = {
    contentSchema?: ContentSchema,
    metadataSchema?: MetadataSchema,
  };
}

export class GenericMdxResource<
  ContentSchema extends ZodType = typeof mdxContentSchema,
  MetadataSchema extends ZodType = typeof mdxMetadataSchema,
> extends Resource {
  public metadataSchema: MetadataSchema;

  public contentSchema: ContentSchema;

  constructor(
    pathOrInput: ConstructorParameters<typeof Resource>[0],
    {
      metadataSchema: metadataSchemaInput,
      contentSchema: contentSchemaInput,
    }: GenericMdxResource.Options<ContentSchema, MetadataSchema> = {},
  ) {
    super(pathOrInput);
    this.metadataSchema = (metadataSchemaInput ?? mdxMetadataSchema) as MetadataSchema;
    this.contentSchema = (contentSchemaInput ?? mdxContentSchema) as ContentSchema;
  }

  normalizedRawInput = lazy(
    async () => {
      const rawInput = await this.rawInput;
      if (typeof rawInput === 'string') {
        return readRawContent(rawInput);
      }
      return rawInput;
    },
  );

  rawMdxContent = lazy<ReactNode>(
    async () => {
      const normalizedRawInput = await this.normalizedRawInput as Record<string, any>;
      return parse(normalizedRawInput.default);
    },
  );

  metadata = lazy<z.infer<MetadataSchema>>(
    async () => {
      const normalizedRawInput = await this.normalizedRawInput as Record<string, any>;
      const { default: _content, ...metadata } = normalizedRawInput;
      return this.metadataSchema.parse(metadata);
    },
  );

  content = lazy<z.infer<ContentSchema>>(
    async () => {
      const rawMdxContent = await this.rawMdxContent;
      return this.contentSchema.parse(rawMdxContent);
    },
  );
}
