import path from 'node:path';
import z from 'zod';
import { parseSourceFile } from '@/data/parseSource';
import { readRawContent } from '@/content/readRawContent';
import { contentPath } from '@/constants/paths';
import {
  tocElementsToTree,
  tocSlug,
} from '@/utils/toc';
import { Resource } from './Resource';
import type { tocSchema } from './schemas';
import { metadataSchema } from './schemas';
import { lazy } from './lazy';

const sourceMetadataSchema = metadataSchema.extend({
  lang: z.string().optional(),
});

export namespace SourceResource {
  export type Output = Awaited<ReturnType<typeof parseSourceFile>>;
  export type Metadata = z.infer<typeof sourceMetadataSchema>;
  export type Options = {
    prefix?: string,
    metadata?: Metadata,
  };
}

export class SourceResource extends Resource {
  public metadataSchema = sourceMetadataSchema;

  constructor(
    pathOrInput: ConstructorParameters<typeof Resource>[0],
    protected options: SourceResource.Options = {},
  ) {
    super(pathOrInput);
  }

  protected async resolveInputFile(pathToResolve: string) {
    if (this.options.prefix) {
      return path.join(this.options.prefix, pathToResolve);
    }

    return pathToResolve;
  }

  metadata = lazy<Required<SourceResource.Metadata>>(
    async () => {
      const fileDefinition = await this.pathDefinition;
      const metadata: Partial<SourceResource.Metadata> = this.options.metadata ?? {};
      return {
        title: metadata.title ?? 'Unknown',
        slug: metadata.slug ?? fileDefinition?.filename ?? 'unknown',
        lang: metadata.lang ?? fileDefinition?.extension ?? 'txt',
      };
    },
  );

  title = lazy(
    async () => (await this.metadata).title,
  );

  slug = lazy(
    async () => (await this.metadata).slug,
  );

  rawComponent = lazy<Record<string, any> | any>(
    async () => {
      const rawInput = await this.rawInput;
      if (typeof rawInput === 'string') {
        return readRawContent(rawInput);
      }
      return rawInput;
    },
  );

  Component = lazy(
    async () => {
      const rawComponent = await this.rawComponent;
      return rawComponent?.default ?? rawComponent;
    },
  );

  content = lazy<SourceResource.Output>(
    async () => {
      const rawInput = await this.rawInput;

      if (typeof rawInput !== 'string') {
        return [];
      }

      const fileDefinition = await this.pathDefinition;
      const metadata = await this.metadata;

      const sourcePayload = fileDefinition && rawInput !== fileDefinition.filepath
        ? { source: rawInput }
        : {};

      return parseSourceFile({
        ...metadata,
        filepath: path.join(
          contentPath,
          fileDefinition!.filepath,
        ),
        ...sourcePayload,
      });
    },
  );

  toc = lazy<z.infer<typeof tocSchema>>(
    async () => {
      const content = await this.content;
      const elements: tocElementsToTree.Element[] = [];

      for (const item of content) {
        if (item.title === 'ROOT') {
          // eslint-disable-next-line no-continue
          continue;
        }

        elements.push({
          title: item.title,
          level: 2,
          id: tocSlug(item.title),
        });
      }

      return tocElementsToTree(elements);
    },
  );
}
