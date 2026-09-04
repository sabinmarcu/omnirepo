import {
  Fragment,
  isValidElement,
  type ReactNode,
} from 'react';
import z from 'zod';
import { codehikeBlockAnnotationSchema } from '@/utils/mdx';
import {
  tocElementsToTree,
  type TOCElement,
} from '@/utils/toc';
import { extractChildrenText } from '@/layouts/TOCAnchor.utils';
import {
  ContentResource,
  contentMetadataSchema,
} from './ContentResource';
import { lazy } from './lazy';
import type { tocSchema } from './schemas';

const projectFileSchema = codehikeBlockAnnotationSchema().and(z.object({
  slug: codehikeBlockAnnotationSchema().optional(),
  entrydepth: codehikeBlockAnnotationSchema(z.coerce.number().int().positive()).optional(),
  maxdepth: codehikeBlockAnnotationSchema(z.coerce.number().int().positive()).optional(),
}));

export const projectContentSchema = z.object({
  file: z.array(projectFileSchema).optional(),
  summary: codehikeBlockAnnotationSchema().optional(),
  children: z.custom<ReactNode>(),
});

const projectMetadataSchema = contentMetadataSchema.extend({
  kind: z.string(),
  status: z.string(),
  repo: z.url(),
  entryDepth: z.number().int().positive().optional(),
  maxDepth: z.number().int().positive().optional(),
});

export type ProjectPage = {
  title: string,
  slug: string,
  content: ReactNode,
  toc: Awaited<ReturnType<typeof tocElementsToTree>>,
  entryDepth?: number,
  maxDepth?: number,
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

function isEmptyFragment(node: ReactNode): boolean {
  if (!isValidElement(node) || node.type !== Fragment) return false;

  const { children } = node.props as { children?: ReactNode };
  return children === undefined;
}

function projectPageContent(section: z.infer<typeof projectFileSchema>) {
  if (!isEmptyFragment(section.children)) {
    return section.children;
  }

  const annotationContent = [
    section.entrydepth?.children,
    section.maxdepth?.children,
    section.slug?.children,
  ].find((node) => node !== undefined && !isEmptyFragment(node));

  return annotationContent ?? section.children;
}

export class ProjectResource extends ContentResource<
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
      rawMdxContent,
      metadata] = await Promise.all([
        this.content,
        this.toc,
        this.rawMdxContent,
        this.metadata,
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
          entryDepth: metadata.entryDepth,
          maxDepth: metadata.maxDepth,
        },
        ...file.map((section, index) => ({
          title: section.title,
          slug: section.slug?.title ?? section.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/(^-|-$)/g, ''),
          content: projectPageContent(section),
          toc: tocElementsToTree(partitions[index + 1] ?? []),
          entryDepth: section.entrydepth
            ? Number(section.entrydepth.title)
            : metadata.entryDepth,
          maxDepth: section.maxdepth
            ? Number(section.maxdepth.title)
            : metadata.maxDepth,
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
