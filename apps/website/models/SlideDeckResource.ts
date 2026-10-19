import { parse } from 'codehike';
import type { ReactNode } from 'react';
import z from 'zod';
import { codehikeBlockAnnotationSchema } from '@/utils/mdx';
import {
  tocElementsToTree,
  type TOCElement,
} from '@/utils/toc';
import {
  ContentResource,
  contentMetadataSchema,
} from './ContentResource';
import { lazy } from './lazy';
import type { tocSchema } from './schemas';

const slideAnnotationPattern = /^!!slide(?:\s|$)/;
const annotationPattern = /^!{1,2}[a-zA-Z][\w-]*(?:\s|$)/;

const slideAnnotationSchema = codehikeBlockAnnotationSchema(
  z.string().trim().min(1, 'Every `!!slide` annotation needs a title.'),
).and(z.object({
  // This must remain a plain optional field. The enum-keyed array helper requires
  // every declared key and would incorrectly make `!notes` mandatory.
  notes: codehikeBlockAnnotationSchema().optional(),
})).transform(({
  title,
  children,
  notes,
}) => ({
  children,
  notes: notes?.children,
  title,
}));

export const slideDeckContentSchema = z.object({
  children: z.custom<ReactNode>(),
  slide: z.array(slideAnnotationSchema)
    .min(1, 'A slide deck must contain at least one `# !!slide` block.'),
});

export const slideDeckMetadataSchema = contentMetadataSchema.extend({
  description: z.string().trim().min(1, 'A slide deck requires a non-empty description.'),
});

type SlideSection = z.infer<typeof slideAnnotationSchema>;
type SlideView = 'read' | 'present' | 'print';
type Toc = z.infer<typeof tocSchema>;

export type Slide = {
  id: string,
  title: string,
  children: ReactNode,
  notes?: ReactNode,
};

function flattenToc(toc: Toc): TOCElement[] {
  return toc.flatMap(({
    value,
    depth,
    attributes,
    children,
  }) => [
    {
      id: attributes.id,
      level: depth,
      title: value,
    },
    ...flattenToc(children),
  ]);
}

function missingSlideTocId(toc: unknown): string | undefined {
  if (!Array.isArray(toc)) return undefined;

  for (const entry of toc) {
    if (typeof entry === 'object' && entry !== null) {
      const candidate = entry as {
        attributes?: { id?: unknown },
        children?: unknown,
        depth?: unknown,
        value?: unknown,
      };
      const title = typeof candidate.value === 'string' ? candidate.value : undefined;

      if (
        candidate.depth === 1
        && title !== undefined
        && slideAnnotationPattern.test(title)
        && (typeof candidate.attributes?.id !== 'string' || !candidate.attributes.id.trim())
      ) {
        return title;
      }

      const missingChildId = missingSlideTocId(candidate.children);
      if (missingChildId !== undefined) return missingChildId;
    }
  }

  return undefined;
}

function readerTocEntries(toc: Toc): TOCElement[] {
  return toc.flatMap(({
    value, depth, attributes, children,
  }) => {
    const isSlide = slideAnnotationPattern.test(value);
    if (annotationPattern.test(value) && !isSlide) return [];
    return [
      {
        id: attributes.id,
        level: depth,
        title: isSlide ? value.replace(slideAnnotationPattern, '').trim() : value,
      },
      ...readerTocEntries(children),
    ];
  });
}

function slideTocEntries(toc: Toc): TOCElement[] {
  const slides = flattenToc(toc).filter((entry) => (
    entry.level === 1 && slideAnnotationPattern.test(entry.title)
  ));

  if (slides.length === 0) {
    throw new Error('The compiled TOC has no `# !!slide` entries. Keep slide headings at depth one.');
  }

  const seenIds = new Set<string>();
  for (const { id, title } of slides) {
    if (!id.trim()) {
      throw new Error(`The slide heading "${title}" has no emitted TOC ID.`);
    }
    if (seenIds.has(id)) {
      throw new Error(`The compiled TOC emitted duplicate slide ID "${id}". Slide heading IDs must be unique.`);
    }
    seenIds.add(id);
  }

  return slides;
}

function toSlides(
  sections: SlideSection[],
  toc: Toc,
  view: SlideView,
): Slide[] {
  const entries = slideTocEntries(toc);
  if (sections.length !== entries.length) {
    throw new Error(
      `Found ${sections.length} parsed \`!!slide\` blocks but ${entries.length} matching depth-one TOC entries. `
      + 'Keep every slide as a `# !!slide` heading.',
    );
  }

  return sections.map((section, index) => {
    const slide = {
      children: section.children,
      id: entries[index].id,
      title: section.title,
    };

    if (view === 'present' && section.notes !== undefined) {
      return {
        ...slide,
        notes: section.notes,
      };
    }

    return slide;
  });
}

async function loadSlideComponents() {
  // Rendering needs Next's CSS loader; metadata-only consumers run without it.
  const { getSlideMdxComponents } = await import('@/components/slides/SlideMdx');
  return getSlideMdxComponents;
}

export class SlideDeckResource extends ContentResource<
  typeof slideDeckContentSchema,
  typeof slideDeckMetadataSchema
> {
  static resourceDirectory = 'slides';

  public contentSchema = slideDeckContentSchema;

  public metadataSchema = slideDeckMetadataSchema;

  description = lazy(
    async () => (await this.metadata).description,
  );

  readerToc = lazy<Toc>(
    async () => tocElementsToTree(readerTocEntries(await this.validatedToc())),
  );

  slides = lazy<Slide[]>(
    async () => this.parseSlides('read'),
  );

  presentSlides = lazy<Slide[]>(
    async () => this.parseSlides('present'),
  );

  printSlides = lazy<Slide[]>(
    async () => this.parseSlides('print'),
  );

  private renderComponents = lazy(loadSlideComponents);

  private async parseSlides(view: SlideView): Promise<Slide[]> {
    const getSlideMdxComponents = await this.renderComponents;
    const compiled = await this.normalizedRawInput as { default: Parameters<typeof parse>[0] };
    const parsed = parse(compiled.default, {
      components: getSlideMdxComponents(view),
    });
    const content = slideDeckContentSchema.parse(parsed);

    return toSlides(content.slide, await this.validatedToc(), view);
  }

  private async validatedToc(): Promise<Toc> {
    const compiled = await this.normalizedRawInput as { toc?: unknown };
    const missingIdTitle = missingSlideTocId(compiled.toc);
    if (missingIdTitle !== undefined) {
      throw new Error(`The slide heading "${missingIdTitle}" has no emitted TOC ID.`);
    }

    return this.toc;
  }
}
