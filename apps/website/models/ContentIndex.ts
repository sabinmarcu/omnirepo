import type { Locale } from '@/i18n/locales';
import type {
  CVDegreeItem,
  CVExperienceItem,
  CVProjectItem,
  CVPublicationItem,
} from './CV.types';
import {
  CVResource,
  getExperienceAnchor,
  getProjectAnchor,
} from './CVResource';
import { SnippetResource } from './SnippetResource';
import { ProjectResource } from './ProjectResource';
import {
  tagMatchesPrefix,
  type TagId,
} from './Tag';
import {
  tagRegistry,
  type TagRegistry,
} from './TagRegistry';
import { ToolResource } from './ToolResource';
import {
  deriveCvTags,
  deriveEntryTags,
  deriveProjectTags,
  deriveSkillTag,
  type EntryTagDerivation,
} from './tagDerivation';

export type ContentType =
  | 'cv-project' | 'project' | 'experience' | 'degree' | 'publication'
  | 'skill' | 'snippet' | 'tool' | 'article';

export type ContentLocation =
  | { pathname: '/personal/cv', hash?: string }
  | { pathname: '/tools/[slug]', params: { slug: string }, hash?: string }
  | { pathname: '/snippets/[slug]', params: { slug: string }, hash?: string }
  | { pathname: '/snippets/[slug]/[subpage]', params: { slug: string, subpage: string }, hash?: string }
  | { pathname: '/projects/[slug]', params: { slug: string }, hash?: string }
  | { pathname: '/tags/[...tag]', params: { tag: string[] } };

export type IndexEntry = {
  id: string,
  type: ContentType,
  title: string,
  location: ContentLocation,
  locale: Locale,
  excerpt?: string,
  /** Expanded, exclusions applied, deduplicated, sorted. The queryable set. */
  tags: TagId[],
  /** Pre-expansion tags as declared by content. */
  authoredTags: TagId[],
  from?: string,
  to?: string,
};

export type IndexEntryInput = Omit<IndexEntry, 'authoredTags' | 'tags'> & EntryTagDerivation;

type IndexProducer = (locale: Locale) => Promise<IndexEntryInput[]>;

function projectEntry(locale: Locale, item: CVProjectItem): IndexEntryInput {
  const { project, metadata } = item;
  return {
    id: `cv:project:${getProjectAnchor(item)}`,
    type: 'cv-project',
    title: project.title,
    location: {
      pathname: '/personal/cv',
      hash: getProjectAnchor(item),
    },
    locale,
    from: project.from,
    to: project.to,
    authoredTags: deriveCvTags({
      company: metadata.company,
      from: project.from,
      to: project.to,
      tag: project.tag,
      featured: project.featured,
      skills: project.skill,
    }),
  };
}

function experienceEntry(locale: Locale, item: CVExperienceItem): IndexEntryInput {
  const { experience, metadata } = item;
  return {
    id: `cv:experience:${getExperienceAnchor(item)}`,
    type: 'experience',
    title: experience.title,
    location: {
      pathname: '/personal/cv',
      hash: getExperienceAnchor(item),
    },
    locale,
    from: experience.from,
    to: experience.to,
    authoredTags: deriveCvTags({
      company: metadata.company,
      from: experience.from,
      to: experience.to,
      tag: experience.tag,
      featured: experience.featured,
    }),
  };
}

function degreeEntry(locale: Locale, item: CVDegreeItem): IndexEntryInput {
  const { degree, metadata } = item;
  return {
    id: `cv:degree:${getExperienceAnchor(item)}`,
    type: 'degree',
    title: degree.title,
    location: {
      pathname: '/personal/cv',
      hash: getExperienceAnchor(item),
    },
    locale,
    from: degree.from,
    to: degree.to,
    authoredTags: deriveCvTags({
      company: metadata.company,
      from: degree.from,
      to: degree.to,
    }),
  };
}

function publicationEntry(locale: Locale, item: CVPublicationItem): IndexEntryInput {
  const { publication, metadata } = item;
  return {
    id: `cv:publication:${publication.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`,
    type: 'publication',
    title: publication.title,
    location: { pathname: '/personal/cv' },
    locale,
    from: publication.from,
    to: publication.to,
    authoredTags: deriveCvTags({
      company: metadata.company,
      from: publication.from,
      to: publication.to,
    }),
  };
}

const cvProducer: IndexProducer = async (locale) => {
  const resource = CVResource.fromDefault(locale);
  const [skills, projects, experiences, degrees, publications] = await Promise.all([
    resource.skills,
    resource.projects,
    resource.experiences,
    resource.degrees,
    resource.publications,
  ]);

  return [
    ...skills.map((skill) => ({
      id: `cv:skill:${deriveSkillTag(skill)}`,
      type: 'skill' as const,
      title: skill,
      location: {
        pathname: '/personal/cv' as const,
        hash: 'heading-skills',
      },
      locale,
      authoredTags: [deriveSkillTag(skill)],
    })),
    ...projects.map((item) => projectEntry(locale, item)),
    ...experiences.map((item) => experienceEntry(locale, item)),
    ...degrees.map((item) => degreeEntry(locale, item)),
    ...publications.map((item) => publicationEntry(locale, item)),
  ];
};

const toolProducer: IndexProducer = async (locale) => {
  const resources = await ToolResource.getLocalizedList(locale);
  return Promise.all(resources.map(async (resource) => ({
    id: `tool:${await resource.id}`,
    type: 'tool' as const,
    title: await resource.title,
    location: {
      pathname: '/tools/[slug]' as const,
      params: { slug: await resource.slug },
    },
    locale,
    authoredTags: (await resource.skills).map(deriveSkillTag),
  })));
};

const snippetProducer: IndexProducer = async (locale) => {
  const resources = await SnippetResource.getLocalizedList(locale);
  return Promise.all(resources.map(async (resource) => ({
    id: `snippet:${await resource.id}`,
    type: 'snippet' as const,
    title: await resource.title,
    location: {
      pathname: '/snippets/[slug]' as const,
      params: { slug: await resource.slug },
    },
    locale,
    authoredTags: (await resource.skills).map(deriveSkillTag),
  })));
};

const projectProducer: IndexProducer = async (locale) => {
  const resources = await ProjectResource.getLocalizedList(locale);
  return Promise.all(resources.map(async (resource) => ({
    id: `project:${await resource.id}`,
    type: 'project' as const,
    title: await resource.title,
    excerpt: await resource.summary,
    location: {
      pathname: '/projects/[slug]' as const,
      params: { slug: await resource.slug },
    },
    locale,
    authoredTags: deriveProjectTags({
      kind: await resource.kind,
      status: await resource.status,
      skills: await resource.skills,
    }),
  })));
};

const producers: IndexProducer[] = [
  cvProducer,
  toolProducer,
  snippetProducer,
  projectProducer,
];

function compareEntries(left: IndexEntry, right: IndexEntry) {
  return (
    (right.from ?? '').localeCompare(left.from ?? '')
    || left.title.localeCompare(right.title)
  );
}

const indexes = new Map<Locale, Promise<ContentIndex>>();

export class ContentIndex {
  private readonly entriesByTag = new Map<TagId, IndexEntry[]>();

  readonly entries: IndexEntry[];

  constructor(entries: IndexEntryInput[], registry: TagRegistry = tagRegistry) {
    this.entries = entries.map((entry) => ({
      ...entry,
      ...deriveEntryTags(entry, registry),
    }));

    for (const entry of this.entries) {
      for (const tag of entry.tags) {
        const tagEntries = this.entriesByTag.get(tag) ?? [];
        tagEntries.push(entry);
        this.entriesByTag.set(tag, tagEntries);
      }
    }
  }

  static forLocale(locale: Locale): Promise<ContentIndex> {
    const cached = indexes.get(locale);
    if (cached) {
      return cached;
    }

    const index = (async () => {
      const entryGroups = await Promise.all(producers.map((producer) => producer(locale)));
      return new ContentIndex(entryGroups.flat());
    })();
    indexes.set(locale, index);
    return index;
  }

  get tags(): TagId[] {
    return [...this.entriesByTag.keys()].toSorted((left, right) => left.localeCompare(right));
  }

  has(id: TagId): boolean {
    return this.byTagPrefix(id).length > 0;
  }

  byTag(id: TagId): IndexEntry[] {
    return [...(this.entriesByTag.get(id) ?? [])].toSorted(compareEntries);
  }

  byTagPrefix(prefix: TagId): IndexEntry[] {
    const matches = new Map<string, IndexEntry>();
    for (const [tag, entries] of this.entriesByTag) {
      if (tagMatchesPrefix(tag, prefix)) {
        for (const entry of entries) {
          matches.set(entry.id, entry);
        }
      }
    }
    return [...matches.values()].toSorted(compareEntries);
  }

  counts(): Map<TagId, number> {
    return new Map([...this.entriesByTag].map(([tag, entries]) => [tag, entries.length]));
  }

  related(entryId: string, limit = 5): IndexEntry[] {
    const entry = this.entries.find((candidate) => candidate.id === entryId);
    if (!entry) {
      return [];
    }

    return this.entries
      .filter((candidate) => candidate.id !== entry.id)
      .map((candidate) => ({
        candidate,
        overlap: candidate.tags.filter((tag) => entry.tags.includes(tag)).length,
      }))
      .filter(({ overlap }) => overlap > 0)
      .toSorted((left, right) => (
        right.overlap - left.overlap
        || compareEntries(left.candidate, right.candidate)
      ))
      .slice(0, limit)
      .map(({ candidate }) => candidate);
  }
}
