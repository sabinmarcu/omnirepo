import type { ReactNode } from 'react';
import z from 'zod';
import { codehikeBlockAnnotationSchema } from '@/utils/mdx';
import { MdxResource } from './MdxResource';
import { SourceResource } from './SourceResource';

const toolContentSchema = z.object({
  preview: codehikeBlockAnnotationSchema().optional(),
  showcase: codehikeBlockAnnotationSchema(),
  children: z.custom<ReactNode>(),
});

export class ToolResource extends MdxResource<typeof toolContentSchema> {
  static resourceDirectory = 'tools';

  private showcaseContent: SourceResource = undefined as any;

  private previewContent: SourceResource = undefined as any;

  private overviewContent: ReactNode;

  public contentSchema = toolContentSchema;

  protected async parse() {
    await super.parse();
    const baseDirectory = this.fileDefinition?.dirname;
    const {
      preview, showcase, children,
    } = this.content;

    this.showcaseContent = await SourceResource.from(
      showcase.title,
      {
        prefix: baseDirectory,
        metadata: {
          title: 'Showcase',
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

    this.overviewContent = children;
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
