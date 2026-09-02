import { codehikeBlockAnnotationSchema } from '@/utils/mdx';
import z from 'zod';
import {
  ShowcaseResource,
  showcaseContentSchema,
} from './ShowcaseResource';
import { SourceResource } from './SourceResource';
import { lazy } from './lazy';

export const snippetsFileSchema = codehikeBlockAnnotationSchema().and(
  z.object({
    source: codehikeBlockAnnotationSchema(),
    slug: codehikeBlockAnnotationSchema(),
    lang: codehikeBlockAnnotationSchema().optional(),
  }),
);

export const snippetsContentSchema = showcaseContentSchema.extend({
  file: z.array(snippetsFileSchema),
});

export class SnippetResource extends ShowcaseResource<typeof snippetsContentSchema> {
  static resourceDirectory = 'snippets';

  static translatable = true;

  public contentSchema = snippetsContentSchema;

  files = lazy<SourceResource[]>(
    async () => {
      const pathDefinition = await this.pathDefinition;
      const baseDirectory = pathDefinition?.dirname;
      const { file: files } = await this.content;

      const fileSources = await Promise.all(
        files.map((file) => SourceResource.from(
          file.source.title,
          {
            prefix: baseDirectory,
            metadata: {
              title: file.title,
              slug: file.slug?.title,
              lang: file.lang?.title,
            },
          },
        )),
      );

      const showcase = await this.showcase;
      const overview = await this.overview;

      return [
        showcase,
        overview,
        ...fileSources,
      ].filter(Boolean) as SourceResource[];
    },
  );

  subpages = lazy<{ slug: string }[]>(
    async () => {
      const files = await this.files;
      return Promise.all(
        files.map(async (file) => ({ slug: await file.slug })),
      );
    },
  );

  async getPage(page: string) {
    const files = await this.files;
    for (const file of files) {
      if (await file.slug === page) {
        return file;
      }
    }

    return undefined;
  }
}
