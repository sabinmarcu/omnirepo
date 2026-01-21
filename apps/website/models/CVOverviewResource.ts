import { overviewSchema } from './CV.schema';
import { MdxResource } from './MdxResource';

export class CVOverviewResource extends MdxResource<typeof overviewSchema> {
  static resourceDirectory = 'personal/cv';

  static resourceFilter = (path: string) => path === 'personal/cv/overview.mdx';

  public contentSchema = overviewSchema;
}
