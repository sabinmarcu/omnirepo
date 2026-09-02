import { overviewSchema } from './CV.schema';
import { MdxResource } from './MdxResource';

export class CVOverviewResource extends MdxResource<typeof overviewSchema> {
  static resourceDirectory = 'personal/cv';

  static resourceFilter = (path: string) => (
    /^personal\/cv\/overview(?:\.ro)?\.mdx$/.test(path)
  );

  public contentSchema = overviewSchema;
}
