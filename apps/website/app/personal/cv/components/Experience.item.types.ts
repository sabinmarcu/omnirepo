import type z from 'zod';
import type {
  workplaceExperienceSchema,
  workplaceMasterMetadataSchema,
  workplaceProjectSchema,
} from '../schemas';

export type ExperienceItemMetadata = { metadata?: z.infer<typeof workplaceMasterMetadataSchema> };

export type ExperienceItemDataExperience = {
  experience: z.infer<typeof workplaceExperienceSchema>[number]
};

export type ExperienceItemDataProject = {
  project: z.infer<typeof workplaceProjectSchema>[number]
};

export type ExperienceItemData = (
  | ExperienceItemDataExperience
  | ExperienceItemDataProject
);

export type CommonExperienceItemData = {
  [Key in
      keyof ExperienceItemDataExperience['experience']
      & keyof ExperienceItemDataProject['project']
  ]: ExperienceItemDataExperience['experience'][Key] & ExperienceItemDataProject['project'][Key]
};
