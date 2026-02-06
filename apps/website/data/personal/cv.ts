import { compareTimeline } from '@/utils/date';
import type { workplaces } from './cv.workplace';
import {
  experiences,
  projects,
  degrees,
  publications,
} from './cv.workplace';

export { overview } from './cv.overview';

const filterCollection = <
  Key extends keyof typeof workplaces[number]['data'],
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
const filterPublications = filterCollection('publication');

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

export const filteredPublications = filterPublications(publications, () => true);

export const zippedPublications: {
  [Key in typeof filteredPublications[number]['publication']['where']]: typeof filteredPublications
} = {} as any;

for (const publication of filteredPublications) {
  const { publication: { where: id } } = publication;
  zippedPublications[id] ??= [];
  zippedPublications[id].push(publication);
}
