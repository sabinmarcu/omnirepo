import type { ReactNode } from 'react';
import z from 'zod';
import { codehikeBlockAnnotationSchema } from '@/utils/mdx';
import { MdxResource } from './MdxResource';
import { SourceResource } from './SourceResource';
import { lazy } from './lazy';

export const showcaseContentSchema = z.object({
  preview: codehikeBlockAnnotationSchema().optional(),
  showcase: codehikeBlockAnnotationSchema(),
  children: z.custom<ReactNode>(),
});

export class ShowcaseResource<
  ContentSchema extends typeof showcaseContentSchema = typeof showcaseContentSchema,
> extends MdxResource<ContentSchema> {
  static resourceDirectory = '';

  public contentSchema = showcaseContentSchema as unknown as ContentSchema;

  showcase = lazy(
    async () => {
      const pathDefinition = await this.pathDefinition;
      const baseDirectory = pathDefinition?.dirname;
      const { showcase } = await this.content;

      return SourceResource.from(
        showcase.title,
        {
          prefix: baseDirectory,
          metadata: {
            title: 'Showcase',
            slug: '',
          },
        },
      );
    },
  );

  preview = lazy(
    async () => {
      const pathDefinition = await this.pathDefinition;
      const baseDirectory = pathDefinition?.dirname;
      const {
        preview,
      } = await this.content;

      if (!preview) {
        return this.showcase;
      }

      return SourceResource.from(
        preview.title,
        {
          prefix: baseDirectory,
          metadata: {
            title: 'Showcase',
          },
        },
      );
    },
  );

  overview = lazy(
    async () => {
      const pathDefinition = await this.pathDefinition;
      const baseDirectory = pathDefinition?.dirname;
      const {
        children,
      } = await this.content;

      const childPath = (children as any)?.props?.children;
      if (!childPath) {
        return undefined;
      }

      return SourceResource.from(
        childPath,
        {
          prefix: baseDirectory,
          metadata: {
            title: 'Overview',
            slug: 'overview',
          },
        },
      );
    },
  );
}
