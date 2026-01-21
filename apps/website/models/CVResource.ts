import { compareTimeline } from '@/utils/date';
import {
  tocElementsToTree,
  tocSlug,
} from '@/utils/toc';
import type {
  CVDegreeItem,
  CVExperienceItem,
  CVProjectItem,
  CVPublicationGroups,
  CVPublicationItem,
  CVViewModel,
  CVWorkplaceEntry,
} from './CV.types';
import { Resource } from './Resource';
import { CVOverviewResource } from './CVOverviewResource';
import { CVWorkplaceResource } from './CVWorkplaceResource';
import { lazy } from './lazy';

type TimelineCollectionItem<Key extends string> = {
  [K in Key]: compareTimeline.Timeline
};

function filterCollection<Key extends string>(property: Key) {
  return <T extends TimelineCollectionItem<Key>>(
    input: T[],
    predicate: (item: T) => boolean,
  ) => (
    input
      .filter(predicate)
      .sort((a, b) => compareTimeline(a[property], b[property]))
  );
}

function getExperienceAnchorTitle(item: CVExperienceItem | CVDegreeItem) {
  return [
    'experience' in item
      ? item.experience.title
      : item.degree.title,
    item.metadata.company,
  ].filter(Boolean).join(' ');
}

function getExperienceAnchor(item: CVExperienceItem | CVDegreeItem) {
  return tocSlug(getExperienceAnchorTitle(item), { prefix: 'experience' });
}

function getProjectAnchor(item: CVProjectItem) {
  return tocSlug(item.project.title, { prefix: 'project' });
}

function getHeadingAnchor(title: string) {
  return tocSlug(title, { prefix: 'heading' });
}

export class CVResource extends Resource {
  private shouldCollectTOC = false;

  private tocList: tocElementsToTree.Element[] = [];

  private tocIds = new Set<string>();

  static fromDefault() {
    return this.from('personal/cv');
  }

  collectTOC() {
    this.shouldCollectTOC = true;
    this.tocList = [];
    this.tocIds = new Set<string>();
  }

  get toc() {
    return tocElementsToTree(this.tocList);
  }

  private pushTOC(element: tocElementsToTree.Element) {
    if (!this.shouldCollectTOC) {
      return;
    }

    if (this.tocIds.has(element.id)) {
      return;
    }

    this.tocIds.add(element.id);
    this.tocList.push(element);
  }

  public tocSection(
    title: string,
  ) {
    this.pushTOC({
      title,
      level: 2,
      id: getHeadingAnchor(title),
    });
    return title;
  }

  private tocExperienceItems(items: Array<CVExperienceItem | CVDegreeItem>) {
    for (const item of items) {
      this.pushTOC({
        title: getExperienceAnchorTitle(item),
        level: 3,
        id: getExperienceAnchor(item),
      });
    }
  }

  private tocProjectItems(items: CVProjectItem[]) {
    for (const item of items) {
      this.pushTOC({
        title: item.project.title,
        level: 3,
        id: getProjectAnchor(item),
      });
    }
  }

  overviewResource = lazy(
    async () => CVOverviewResource.from('personal/cv/overview.mdx'),
  );

  workplaceResources = lazy(
    async () => CVWorkplaceResource.getList(),
  );

  overview = lazy(
    async () => (await this.overviewResource).content,
  );

  skills = lazy(
    async () => {
      const overview = await this.overview;
      return overview.skills;
    },
    { cached: false },
  );

  languages = lazy(
    async () => {
      const overview = await this.overview;
      return overview.languages;
    },
    { cached: false },
  );

  workplaces = lazy<CVWorkplaceEntry[]>(
    async () => {
      const resources = await this.workplaceResources;
      return Promise.all(resources.map(async (resource) => ({
        data: await resource.content,
        metadata: await resource.metadata,
      })));
    },
  );

  experiences = lazy<CVExperienceItem[]>(
    async () => this.normalizeCollection('experience'),
  );

  projects = lazy<CVProjectItem[]>(
    async () => this.normalizeCollection('project'),
  );

  degrees = lazy<CVDegreeItem[]>(
    async () => this.normalizeCollection('degree'),
  );

  publications = lazy<CVPublicationItem[]>(
    async () => (
      (await this.normalizeCollection('publication')).map((item) => {
        const {
          publication: { year, ...rest },
          metadata,
        } = item;

        return {
          publication: {
            from: year,
            to: year,
            ...rest,
          },
          metadata,
        };
      })
    ),
  );

  extracurricularExperiences = lazy<CVExperienceItem[]>(
    async () => filterCollection('experience')(
      await this.experiences,
      ({ experience: { tag } }) => tag === 'extracurricular',
    ),
  );

  unknownExperiences = lazy<CVExperienceItem[]>(
    async () => filterCollection('experience')(
      await this.experiences,
      ({ experience: { tag } }) => tag === 'unknown',
    ),
  );

  featuredExperiences = lazy<CVExperienceItem[]>(
    async () => {
      const list = filterCollection('experience')(
        await this.unknownExperiences,
        ({ experience: { featured } }) => featured,
      );

      this.tocExperienceItems(list);

      return list;
    },
    { cached: false },
  );

  extendedExperiences = lazy<CVExperienceItem[]>(
    async () => {
      const list = filterCollection('experience')(
        await this.unknownExperiences,
        ({ experience: { featured } }) => !featured,
      );

      this.tocExperienceItems(list);

      return list;
    },
    { cached: false },
  );

  opensourceProjects = lazy<CVProjectItem[]>(
    async () => {
      const list = filterCollection('project')(
        await this.projects,
        ({ project: { tag } }) => tag === 'opensource',
      );

      this.tocProjectItems(list);

      return list;
    },
    { cached: false },
  );

  personalProjects = lazy<CVProjectItem[]>(
    async () => {
      const list = filterCollection('project')(
        await this.projects,
        ({ project: { tag } }) => tag === 'personal',
      );

      this.tocProjectItems(list);

      return list;
    },
    { cached: false },
  );

  academicProjects = lazy<CVProjectItem[]>(
    async () => {
      const list = filterCollection('project')(
        await this.projects,
        ({ project: { tag } }) => tag === 'academic',
      );

      this.tocProjectItems(list);

      return list;
    },
    { cached: false },
  );

  competitionProjects = lazy<CVProjectItem[]>(
    async () => {
      const list = filterCollection('project')(
        await this.projects,
        ({ project: { tag } }) => tag === 'competition',
      );

      this.tocProjectItems(list);

      return list;
    },
    { cached: false },
  );

  unknownProjects = lazy<CVProjectItem[]>(
    async () => filterCollection('project')(
      await this.projects,
      ({ project: { tag } }) => tag === 'unknown',
    ),
  );

  featuredProjects = lazy<CVProjectItem[]>(
    async () => filterCollection('project')(
      await this.unknownProjects,
      ({ project: { featured } }) => featured,
    ),
  );

  extendedProjects = lazy<CVProjectItem[]>(
    async () => filterCollection('project')(
      await this.unknownProjects,
      ({ project: { featured } }) => !featured,
    ),
  );

  filteredDegrees = lazy<CVDegreeItem[]>(
    async () => {
      const list = filterCollection('degree')(
        await this.degrees,
        () => true,
      );

      this.tocExperienceItems(list);

      return list;
    },
    { cached: false },
  );

  filteredPublications = lazy<CVPublicationItem[]>(
    async () => filterCollection('publication')(
      await this.publications,
      () => true,
    ),
  );

  
  featuredWorkProjects = lazy<CVProjectItem[]>(
    async () => {
      const list = filterCollection('project')(
        await this.unknownProjects,
        ({ project: { featured } }) => featured,
      );
      this.tocProjectItems(list);
      return list;
    },
    { cached: false },
  )
  
  extendedWorkProjects = lazy<CVProjectItem[]>(
    async () => {
      const list = filterCollection('project')(
        await this.unknownProjects,
        ({ project: { featured } }) => !featured,
      );
      this.tocProjectItems(list);
      return list;
    },
    { cached: false },
  );

  zippedPublications = lazy<CVPublicationGroups>(
    async () => {
      const result: CVPublicationGroups = {};
      const publications = await this.filteredPublications;

      for (const publication of publications) {
        const {
          publication: { where: source },
        } = publication;

        result[source] ??= [];
        result[source].push(publication);
      }

      return result;
    },
  );


  private async normalizeCollection<Key extends keyof CVWorkplaceEntry['data']>(
    key: Key,
  ) {
    const workplaces = await this.workplaces;

    return workplaces.flatMap(({ data, metadata }) => {
      const list = data[key];

      return list?.map((element) => ({
        [key]: element,
        metadata,
      })) ?? [];
    }) as any[];
  }
}
