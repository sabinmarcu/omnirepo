import path from 'node:path';
import z from 'zod';
import { parseSourceFile } from '@/data/parseSource';
import { readRawContent } from '@/content/readRawContent';
import type {
  ComponentType,
} from 'react';
import { Resource } from './Resource';
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

  protected async resolveFile(pathToResolve: string) {
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
  protected content: SourceResource.Output = [];

  protected component: ComponentType = undefined as any;

  get Component() { return this.component; }

  public async parse() {
    const rawComponent = await readRawContent(
      await this.resolveFile(this.pathOrImport as string),
    );

    this.component = rawComponent.default;

    this.content = await parseSourceFile({
      ...this.metadata,
      filepath: this.fileDefinition!.filepath,
      source: this.rawContent,
    });
  }
  // #endregion
}
