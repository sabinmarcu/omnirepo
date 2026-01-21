import type {
  CVExperienceItem,
  CVProjectItem,
  CVWorkplaceMetadata,
} from '@/models/CV.types';

export type ExperienceItemMetadata = { metadata?: CVWorkplaceMetadata };

export type ExperienceItemDataExperience = {
  experience: CVExperienceItem['experience']
};

export type ExperienceItemDataProject = {
  project: CVProjectItem['project']
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
