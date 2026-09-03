import type { ReactNode } from 'react';
import z from 'zod';
import { codehikeBlockAnnotationSchema } from '@/utils/mdx';
import {
  tocElementsToTree,
  type TOCElement,
} from '@/utils/toc';
import { extractChildrenText } from '@/layouts/TOCAnchor.utils';
import { MdxResource } from './MdxResource';
import { lazy } from './lazy';
import { tocSchema } from './schemas';

const projectFileSchema = codehikeBlockAnnotationSchema().and(z.object({
  slug: codehikeBlockAnnotationSchema().optional(),
}));

export const projectContentSchema = z.object({
  file: z.array(projectFileSchema).optional(),
  summary: codehikeBlockAnnotationSchema().optional(),
  children: z.custom<ReactNode>(),
});

const projectMetadataSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  kind: z.string(),
  status: z.string(),
  repo: z.url(),
  skills: z.array(z.string()),
  toc: tocSchema,
});

export type ProjectPage = {
  title: string,
  slug: string,
  content: ReactNode,
  toc: Awaited<ReturnType<typeof tocElementsToTree>>,
};

const annotationPattern = /^!{1,2}[a-zA-Z][\w-]*(\s|$)/;
const filePattern = /^!!file\s+/;

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

export class ProjectResource extends MdxResource<
  typeof projectContentSchema,
  typeof projectMetadataSchema
> {
  static resourceDirectory = 'projects';

  static translatable = true;

  public contentSchema = projectContentSchema;

  public metadataSchema = projectMetadataSchema;

  kind = lazy(
    async () => (await this.metadata).kind,
  );

  status = lazy(
    async () => (await this.metadata).status,
  );

  repo = lazy(
    async () => (await this.metadata).repo,
  );

  skills = lazy(
    async () => (await this.metadata).skills,
  );

  summary = lazy(
    async () => {
      const summary = (await this.content).summary?.children;
      return summary ? extractChildrenText(summary) : undefined;
    },
  );

  pages = lazy<ProjectPage[]>(
    async () => {
      const [{
        file = [], summary, children,
      },
      toc,
      rawMdxContent] = await Promise.all([
        this.content,
        this.toc,
        this.rawMdxContent,
      ]);
      const partitions: TOCElement[][] = [[]];

      for (const entry of flattenToc(toc)) {
        if (filePattern.test(entry.title)) {
          partitions.push([]);
        } else if (!annotationPattern.test(entry.title)) {
          partitions.at(-1)?.push(entry);
        }
      }

      return [
        {
          title: await this.title,
          slug: await this.slug,
          content: file.length === 0 && !summary ? rawMdxContent : children,
          toc: tocElementsToTree(partitions[0]),
        },
        ...file.map((section, index) => ({
          title: section.title,
          slug: section.slug?.title ?? section.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/(^-|-$)/g, ''),
          content: section.children,
          toc: tocElementsToTree(partitions[index + 1] ?? []),
        })),
      ];
    },
  );

  subpages = lazy<{ slug: string }[]>(
    async () => (await this.pages).slice(1).map(({ slug }) => ({ slug })),
  );

  async getPage(slug: string) {
    return (await this.pages).find((page) => page.slug === slug);
  }
}
