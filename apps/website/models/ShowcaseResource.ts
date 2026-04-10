import type { ReactNode } from 'react';
import z from 'zod';
import { codehikeBlockAnnotationSchema } from '@/utils/mdx';
import { MdxResource } from './MdxResource';
import { SourceResource } from './SourceResource';

const showcaseContentSchema = z.object({
  preview: codehikeBlockAnnotationSchema().optional(),
  showcase: codehikeBlockAnnotationSchema(),
  children: z.custom<ReactNode>(),
});

export class ShowcaseResource<
  ContentSchema extends typeof showcaseContentSchema = typeof showcaseContentSchema,
> extends MdxResource<ContentSchema> {
  static resourceDirectory = '';

  private showcaseContent: SourceResource = undefined as any;

  private previewContent: SourceResource = undefined as any;

  private overviewContent: SourceResource = undefined as any;

  public contentSchema = showcaseContentSchema as unknown as ContentSchema;

  protected async parse() {
    await super.parse();
    const baseDirectory = this.fileDefinition?.dirname;
    const {
      preview,
      showcase,
      children,
    } = this.content;

    this.showcaseContent = await SourceResource.from(
      showcase.title,
      {
        prefix: baseDirectory,
        metadata: {
          title: 'Showcase',
          slug: '',
        },
      },
    );

    this.previewContent = preview
      ? await SourceResource.from(
        preview.title,
        {
          prefix: baseDirectory,
          metadata: {
            title: 'Preview',
          },
        },
      )
      : this.showcase as any;

    this.previewContent.setMetadata({ title: 'Showcase' });

    if ((children as any).props?.children) {
      this.overviewContent = await SourceResource.from(
        (children as any).props.children,
        {
          prefix: baseDirectory,
          metadata: {
            title: 'Overview',
            slug: 'overview',
          },
        },
      );
    }
  }

  get preview() {
    return this.previewContent;
  }

  get showcase() {
    return this.showcaseContent;
  }

  get overview() {
    return this.overviewContent;
  }
}
