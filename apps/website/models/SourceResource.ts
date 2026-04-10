import path from 'node:path';
import z from 'zod';
import { parseSourceFile } from '@/data/parseSource';
import { readRawContent } from '@/content/readRawContent';
import type {
  ComponentType,
} from 'react';
import { contentPath } from '@/constants/paths';
import {
  tocElementsToTree,
  tocSlug,
} from '@/utils/toc';
import { Resource } from './Resource';
import type { tocSchema } from './schemas';
import { metadataSchema } from './schemas';

export namespace SourceResource {
  export type Output = Awaited<ReturnType<typeof parseSourceFile>>;
  export type Metadata = z.infer<InstanceType<typeof SourceResource>['metadataSchema']>;
  export type Options = {
    prefix?: string,
    metadata?: Metadata,
  };
}

export class SourceResource extends Resource<SourceResource.Options> {
  // #region Cache Busting
  static prepareCache<
    // eslint-disable-next-line function-paren-newline
    T extends new (...arguments_: any[]) => Resource,
  >(
    this: T,
    pathOrImport: ConstructorParameters<T>[0],
    options?: SourceResource.Options,
  ): string {
    if (options?.metadata?.slug) {
      if (typeof pathOrImport === 'string') {
        return `${options.metadata.slug}-${pathOrImport}`;
      }
      return options.metadata.slug;
    }
    return pathOrImport;
  }
  // endregion

  // #region Metadata
  public metadataSchema = metadataSchema.extend({
    lang: z.string().optional(),
  });

  protected metadata: Required<SourceResource.Metadata> = undefined as any;

  public setMetadata(metadata: Partial<SourceResource.Metadata>) {
    this.metadata = {
      title: metadata.title ?? this.metadata?.title ?? 'Unknown',
      slug: metadata.slug ?? this.metadata?.slug ?? this.fileDefinition?.filename ?? 'unknown',
      lang: metadata.lang ?? this.metadata?.lang ?? this.fileDefinition?.extension ?? 'txt',
    };
  }

  get title() { return this.metadata.title; }

  get slug() { return this.metadata.slug; }
  // #endregion

  // #region Path Resolution
  protected acceptsRelativePaths = true;

  protected pathPrefix: string | undefined = undefined;

  public setPathPrefix(prefix: string) {
    this.pathPrefix = prefix;
  }

  protected resolveFile(pathToResolve: string) {
    if (this.pathPrefix) {
      return path.join(
        this.pathPrefix,
        pathToResolve,
      );
    }

    return pathToResolve;
  }

  public async readSourceFile({
    prefix,
    metadata,
  }: {
    prefix: string,
    metadata: z.infer<typeof metadataSchema>,
  }) {
    this.setPathPrefix(prefix);
    await this.readFile();
    this.setMetadata(metadata);
  }
  // #endregion

  public async prepareRead({ prefix }: SourceResource.Options) {
    if (prefix) {
      this.setPathPrefix(prefix);
    }
  }

  public async prepareParse({ metadata }: SourceResource.Options) {
    if (metadata) {
      this.setMetadata(metadata);
    }
  }

  // #region Content
  protected sourceContent: SourceResource.Output = [];

  get content() { return this.sourceContent; }

  protected component: ComponentType = undefined as any;

  get Component() { return this.component; }

  public async parse() {
    const rawComponent = typeof this.rawContent === 'string'
      ? await readRawContent(
        this.resolveFile(this.pathOrImport as string),
      )
      : this.rawContent;

    this.component = rawComponent?.default ?? rawComponent;

    if (typeof this.rawContent === 'string') {
      const sourcePayload = this.rawContent !== this.fileDefinition!.filepath
        ? { source: this.rawContent }
        : {};

      this.sourceContent = await parseSourceFile({
        ...this.metadata,
        filepath: path.join(
          contentPath,
          this.fileDefinition!.filepath,
        ),
        ...sourcePayload,
      });
    }
  }
  // #endregion

  // #region TOC
  public get toc(): z.infer<typeof tocSchema> {
    const elements: tocElementsToTree.Element[] = [];
    for (const item of this.content) {
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
  }
  // endregion
}
