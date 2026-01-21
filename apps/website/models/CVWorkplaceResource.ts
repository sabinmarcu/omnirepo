import {
  workplaceMasterMetadataSchema,
  workplaceSchema,
} from './CV.schema';
import { GenericMdxResource } from './GenericMdxResource';

export class CVWorkplaceResource extends GenericMdxResource<
  typeof workplaceSchema,
  typeof workplaceMasterMetadataSchema
> {
  static resourceDirectory = 'personal/cv/workplace';

  static resourceFilter = (path: string) => path.endsWith('.mdx');

  public contentSchema = workplaceSchema;

  public metadataSchema = workplaceMasterMetadataSchema;
}
