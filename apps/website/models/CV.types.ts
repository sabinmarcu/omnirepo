import type z from 'zod';
import type {
  overviewSchema,
  workplaceSchema,
  workplaceMasterMetadataSchema,
} from './CV.schema';

export type CVOverview = z.infer<typeof overviewSchema>;

export type CVWorkplaceData = z.infer<typeof workplaceSchema>;
export type CVWorkplaceMetadata = z.infer<typeof workplaceMasterMetadataSchema>;
export type CVWorkplaceEntry = {
  data: CVWorkplaceData,
  metadata: CVWorkplaceMetadata,
};

export type CVExperienceItem = {
  experience: NonNullable<CVWorkplaceData['experience']>[number],
  metadata: CVWorkplaceMetadata,
};

export type CVProjectItem = {
  project: NonNullable<CVWorkplaceData['project']>[number],
  metadata: CVWorkplaceMetadata,
};

export type CVDegreeItem = {
  degree: NonNullable<CVWorkplaceData['degree']>[number],
  metadata: CVWorkplaceMetadata,
};

export type CVRawPublicationItem = {
  publication: NonNullable<CVWorkplaceData['publication']>[number],
  metadata: CVWorkplaceMetadata,
};

export type CVPublicationItem = {
  publication: Omit<CVRawPublicationItem['publication'], 'year'> & {
    from: string,
    to: string,
  },
  metadata: CVWorkplaceMetadata,
};

export type CVPublicationGroups = Record<string, CVPublicationItem[]>;

export type CVViewModel = {
  overview: CVOverview,
  experiences: CVExperienceItem[],
  projects: CVProjectItem[],
  degrees: CVDegreeItem[],
  publications: CVPublicationItem[],
  extracurricularExperiences: CVExperienceItem[],
  unknownExperiences: CVExperienceItem[],
  featuredExperiences: CVExperienceItem[],
  extendedExperiences: CVExperienceItem[],
  opensourceProjects: CVProjectItem[],
  personalProjects: CVProjectItem[],
  academicProjects: CVProjectItem[],
  competitionProjects: CVProjectItem[],
  unknownProjects: CVProjectItem[],
  featuredProjects: CVProjectItem[],
  extendedProjects: CVProjectItem[],
  filteredDegrees: CVDegreeItem[],
  filteredPublications: CVPublicationItem[],
  zippedPublications: CVPublicationGroups,
};
