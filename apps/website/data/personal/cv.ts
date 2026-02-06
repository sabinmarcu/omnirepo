import { compareTimeline } from '@/utils/date';
import {
  experiences,
  projects,
} from './cv.workplace';

export { overview } from './cv.overview';

const filterExperiences = (
  input: typeof experiences,
  predicate: (input: typeof experiences[number]) => boolean,
) => (
  input.filter(predicate)
    .sort((
      { experience: experienceA },
      { experience: experienceB },
    ) => compareTimeline(experienceA, experienceB))
);

const filterProjects = (
  input: typeof projects,
  predicate: (input: typeof projects[number]) => boolean,
) => (
  input.filter(predicate)
    .sort((
      { project: projectA },
      { project: projectB },
    ) => compareTimeline(projectA, projectB))
);

export const extracurricularExperiences = filterExperiences(
  experiences,
  ({ experience: { tag } }) => tag === 'extracurricular',
);

export const unknownExperiences = filterExperiences(
  experiences,
  ({ experience: { tag } }) => tag === 'unknown',
);

export const featuredExperiences = filterExperiences(
  unknownExperiences,
  ({ experience: { featured } }) => featured,
);

export const extendedExperiences = filterExperiences(
  unknownExperiences,
  ({ experience: { featured } }) => !featured,
);

export const opensourceProjects = filterProjects(
  projects,
  (({ project: { tag } }) => tag === 'opensource'),
);

export const personalProjects = filterProjects(
  projects,
  (({ project: { tag } }) => tag === 'personal'),
);

export const academicProjects = filterProjects(
  projects,
  (({ project: { tag } }) => tag === 'academic'),
);

export const competitionProjects = filterProjects(
  projects,
  (({ project: { tag } }) => tag === 'competition'),
);

export const unknownProjects = filterProjects(
  projects,
  (({ project: { tag } }) => tag === 'unknown'),
);

export const featuredProjects = filterProjects(
  unknownProjects,
  ({ project: { featured } }) => featured,
);

export const extendedProjects = filterProjects(
  unknownProjects,
  ({ project: { featured } }) => !featured,
);
