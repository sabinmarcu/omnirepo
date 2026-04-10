import { codehikeBlockAnnotationSchema } from '@/utils/mdx';
import z from 'zod';
import { ShowcaseResource } from './ShowcaseResource';
import { SourceResource } from './SourceResource';

export const snippetsFileSchema = codehikeBlockAnnotationSchema().and(
  z.object({
    source: codehikeBlockAnnotationSchema(),
    slug: codehikeBlockAnnotationSchema(),
    lang: codehikeBlockAnnotationSchema().optional(),
  }),
);

export const snippetsContentSchema = new ShowcaseResource('').contentSchema.extend({
  file: z.array(snippetsFileSchema),
});

export class SnippetResource extends ShowcaseResource<typeof snippetsContentSchema> {
  static resourceDirectory = 'snippets';

  public contentSchema = snippetsContentSchema;

  public files: SourceResource[] = [];

  protected async parse() {
    await super.parse();

    const baseDirectory = this.fileDefinition?.dirname;

    const { file: files } = this.content;
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

    const combinedFiles = [
      this.showcase,
      this.overview,
      ...fileSources,
    ].filter(Boolean);

    this.files = combinedFiles;
  }

  public getPage(page: string) {
    for (const file of this.files) {
      if (file.slug === page) {
        return file;
      }
    }
    return undefined;
  }

  public get subpages() {
    return this.files.map(({ slug }) => ({ slug }));
  }
}
