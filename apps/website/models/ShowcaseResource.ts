import type { ReactNode } from 'react';
import z from 'zod';
import { codehikeBlockAnnotationSchema } from '@/utils/mdx';
import {
  tocElementsToTree,
  type TOCElement,
} from '@/utils/toc';
import { MdxResource } from './MdxResource';
import { SourceResource } from './SourceResource';
import { lazy } from './lazy';
import type { tocSchema } from './schemas';

export const showcaseContentSchema = z.object({
  preview: codehikeBlockAnnotationSchema().optional(),
  showcase: codehikeBlockAnnotationSchema(),
  skill: z.array(codehikeBlockAnnotationSchema()).optional(),
  children: z.custom<ReactNode>(),
});

const annotationPattern = /^!{1,2}[a-zA-Z][\w-]*(\s|$)/;

function flattenToc(toc: z.infer<typeof tocSchema>): TOCElement[] {
  return toc.flatMap(({
    value, depth, attributes, children,
  }) => [
    {
      title: value,
      level: depth,
      id: attributes.id,
    },
    ...flattenToc(children),
  ]);
}

function overviewToc(toc: z.infer<typeof tocSchema>) {
  return tocElementsToTree(
    flattenToc(toc)
      .filter(({ title }) => !annotationPattern.test(title)),
  );
}

export class ShowcaseResource<
  ContentSchema extends typeof showcaseContentSchema = typeof showcaseContentSchema,
> extends MdxResource<ContentSchema> {
  static resourceDirectory = '';

  public contentSchema = showcaseContentSchema as unknown as ContentSchema;

  skills = lazy(
    async () => (await this.content).skill?.map(({ title }) => title) ?? [],
  );

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
      const [{ children }, toc] = await Promise.all([
        this.content,
        this.toc,
      ]);

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
          toc: overviewToc(toc),
        },
      );
    },
  );
}
