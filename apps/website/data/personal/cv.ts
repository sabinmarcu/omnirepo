import { compareTimeline } from '@/utils/date';
import {
  experiences,
  projects,
  degrees,
} from './cv.workplace';

export { overview } from './cv.overview';

const filterCollection = <
  Key extends string,
>(property: Key) => <
  T extends { [key in Key]: compareTimeline.Timeline },
>(
      input: T[],
      predicate: (input: T) => boolean,
    ) => (
      input.filter(predicate)
        .sort((a, b) => compareTimeline(
          a[property],
          b[property],
        ))
    );

const filterExperiences = filterCollection('experience');
const filterProjects = filterCollection('project');
const filterDegrees = filterCollection('degree');

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

export const filteredDegrees = filterDegrees(degrees, () => true);

console.dir({ filteredDegrees }, { depth: null });
