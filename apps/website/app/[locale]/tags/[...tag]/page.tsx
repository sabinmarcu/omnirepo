import type { Metadata } from 'next';
import type { families } from '@sabinmarcu/website-theme';
import { getTranslations } from 'next-intl/server';
import { TagPill } from '@/components/TagPill';
import { ShowcaseList } from '@/components/ShowcaseList';
import { ProjectList } from '@/components/ProjectList';
import { isIgnoredTag } from '@/constants/ignoredTagPatterns';
import {
  getPathname,
  redirect,
} from '@/i18n/navigation';
import {
  isLocale,
  type Locale,
} from '@/i18n/locales';
import { canonicalMetadata } from '@/i18n/metadata';
import { TranslationFallbackNotice } from '@/i18n/TranslationFallbackNotice';
import { Navigation } from '@/layouts/Navigation';
import { PageLayout } from '@/layouts/PageLayout';
import {
  ContentIndex,
  type ContentType,
  type IndexEntry,
} from '@/models/ContentIndex';
import type { ShowcaseResource } from '@/models/ShowcaseResource';
import { SnippetResource } from '@/models/SnippetResource';
import { ProjectResource } from '@/models/ProjectResource';
import {
  normalizeTagSegment,
  parseTag,
  tagFromPathSegments,
  tagMatchesPrefix,
  type TagId,
} from '@/models/Tag';
import {
  canonicalTag,
  expandTags,
  tagLabel,
  tagRegistry,
} from '@/models/TagRegistry';
import { TagResource } from '@/models/TagResource';
import { ToolResource } from '@/models/ToolResource';
import { redirect404 } from '@/utils/routes.ssr';
import { Typography } from '@/components/primitives/Typography';
import { TagResult } from '../components/TagResult';
import {
  resultGroupStyle,
  resultListStyle,
  tagDescriptionStyle,
  tagFooterStyle,
  tagHeaderStyle,
  tagListStyle,
  tagPageStyle,
} from './page.css';

const contentTypeOrder: ContentType[] = [
  'tool',
  'snippet',
  'project',
  'cv-project',
  'experience',
  'publication',
  'degree',
  'skill',
  'article',
];

const contentTypeThemeFamilies: Record<Exclude<ContentType, 'skill'>, typeof families[number]> = {
  article: 'articles',
  'cv-project': 'personal',
  degree: 'personal',
  experience: 'personal',
  project: 'projects',
  publication: 'personal',
  snippet: 'snippets',
  tool: 'projects',
};

function canonicalSegments(segments: string[]): string[] | undefined {
  if (segments.length === 0 || segments.length > 3) {
    return undefined;
  }
  const normalized = segments.map(normalizeTagSegment);
  return normalized.every(Boolean) ? normalized : undefined;
}

function relatedTags(entries: IndexEntry[], current: TagId): Array<[TagId, number]> {
  const counts = new Map<TagId, Set<string>>();
  for (const entry of entries) {
    for (const tag of entry.tags) {
      const excluded = (
        parseTag(tag).namespace === 'org'
        || isIgnoredTag(tag)
        || tagMatchesPrefix(tag, current)
        || tagMatchesPrefix(current, tag)
      );
      if (!excluded) {
        const entryIds = counts.get(tag) ?? new Set<string>();
        entryIds.add(entry.id);
        counts.set(tag, entryIds);
      }
    }
  }
  return [...counts]
    .map(([tag, entryIds]) => [tag, entryIds.size] as [TagId, number])
    .toSorted((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 8);
}

function matchingAuthoredTags(entry: IndexEntry, current: TagId): TagId[] {
  return entry.authoredTags.filter((tag) => (
    expandTags([tag]).some((expanded) => tagMatchesPrefix(expanded, current))
  ));
}

function isShowcaseResource<Resource extends ShowcaseResource>(
  resource: Resource | undefined,
): resource is Resource {
  return !!resource;
}

async function getShowcaseResources(
  type: ContentType,
  entries: IndexEntry[],
  locale: Locale,
): Promise<ShowcaseResource[]> {
  if (type === 'tool') {
    const resources = await Promise.all(entries.flatMap((entry) => (
      entry.location.pathname === '/tools/[slug]'
        ? [ToolResource.fromSlug(entry.location.params.slug, locale)]
        : []
    )));
    return resources.filter(isShowcaseResource);
  }
  if (type === 'snippet') {
    const resources = await Promise.all(entries.flatMap((entry) => (
      entry.location.pathname === '/snippets/[slug]'
        ? [SnippetResource.fromSlug(entry.location.params.slug, locale)]
        : []
    )));
    return resources.filter(isShowcaseResource);
  }
  return [];
}

async function getProjectResources(
  entries: IndexEntry[],
  locale: Locale,
): Promise<ProjectResource[]> {
  const resources = await Promise.all(entries.flatMap((entry) => (
    entry.location.pathname === '/projects/[slug]'
      ? [ProjectResource.fromSlug(entry.location.params.slug, locale)]
      : []
  )));
  return resources.filter((resource): resource is ProjectResource => !!resource);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/tags/[...tag]'>): Promise<Metadata> {
  const { locale, tag } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const segments = canonicalSegments(tag);
  if (!segments) {
    return {};
  }
  const pathname = getPathname({
    locale,
    href: {
      pathname: '/tags/[...tag]',
      params: { tag: segments },
    },
  });
  return {
    title: segments.at(-1),
    ...await canonicalMetadata(locale, pathname),
  };
}

export default async function TagPage({
  params,
}: PageProps<'/[locale]/tags/[...tag]'>) {
  const { locale, tag } = await params;
  if (!isLocale(locale)) {
    return redirect404();
  }
  const segments = canonicalSegments(tag);
  if (!segments) {
    return redirect404();
  }
  if (segments.some((segment, index) => segment !== tag[index])) {
    return redirect({
      locale,
      href: {
        pathname: '/tags/[...tag]',
        params: { tag: segments },
      },
    });
  }

  const requestedId = tagFromPathSegments(segments);
  const id = canonicalTag(requestedId);
  if (id !== requestedId) {
    return redirect({
      locale,
      href: {
        pathname: '/tags/[...tag]',
        params: { tag: id.split(':') },
      },
    });
  }
  if (parseTag(id).namespace === 'org') {
    return redirect404();
  }

  const [translate, index] = await Promise.all([
    getTranslations('tags'),
    ContentIndex.forLocale(locale),
  ]);
  if (!index.has(id) && !tagRegistry[id]) {
    return redirect404();
  }

  const labels = translate.raw('labels') as Record<string, string>;
  const label = (tagId: TagId) => tagLabel(tagId, (key) => labels[key] ?? key);
  const entries = index.byTagPrefix(id);
  const related = relatedTags(entries, id);
  const description = await TagResource.fromId(id.replaceAll(':', '.'), locale);
  const resultSections = await Promise.all(contentTypeOrder.map(async (type) => {
    if (type === 'skill') {
      return null;
    }
    const typeEntries = entries.filter((entry) => entry.type === type);
    if (typeEntries.length === 0) {
      return null;
    }
    const showcaseResources = await getShowcaseResources(type, typeEntries, locale);
    const projectResources = type === 'project'
      ? await getProjectResources(typeEntries, locale)
      : [];
    let resultContent = (
      <ul className={resultListStyle}>
        {typeEntries.map((entry) => {
          const matchedTags = matchingAuthoredTags(entry, id);
          const matchedVia = matchedTags.includes(id)
            ? undefined
            : translate('matchedVia', {
              tags: matchedTags.map(label).join(', '),
            });
          return (
            <TagResult
              key={entry.id}
              entry={entry}
              locale={locale}
              matchedVia={matchedVia}
            />
          );
        })}
      </ul>
    );
    if (showcaseResources.length > 0) {
      resultContent = (
        <ShowcaseList
          resources={showcaseResources}
          pathname={type === 'tool' ? '/tools' : '/snippets'}
        />
      );
    }
    if (projectResources.length > 0) {
      resultContent = <ProjectList locale={locale} pathname="/projects" resources={projectResources} />;
    }
    return (
      <PageLayout
        disableFooter
        data-theme-family={contentTypeThemeFamilies[type]}
        className={resultGroupStyle}
        data-content-type={type}
        key={type}
      >
        <h3>
          {translate(`types.${type}`)}
          {' '}
          (
          {typeEntries.length}
          )
        </h3>
        {resultContent}
      </PageLayout>
    );
  }));

  return (
    <>
      <Navigation />
      <main>
        <header>
          <PageLayout className={tagPageStyle} disableFooter>
            <div className={tagHeaderStyle}>
              <Typography as="h1">{label(id)}</Typography>
              {description
                ? (
                  <div className={tagDescriptionStyle}>
                    <TranslationFallbackNotice locale={locale} resource={description} />
                    {await description.content}
                  </div>
                )
                : null}
            </div>
          </PageLayout>
        </header>
        {related.length > 0
          ? (
            <PageLayout
              disableFooter
              data-theme-family="base"
              className={resultGroupStyle}
              data-content-type="related"
              {...{ [Typography.unstyledDataAttribute]: true }}
            >
              <Typography as="h3">{translate('related')}</Typography>
              <div className={tagListStyle}>
                {related.map(([relatedId, count]) => (
                  <TagPill
                    key={relatedId}
                    id={relatedId}
                    label={label(relatedId)}
                    count={count}
                  />
                ))}
              </div>
            </PageLayout>
          )
          : null}
        {entries.length === 0
          ? <PageLayout><p>{translate('empty')}</p></PageLayout>
          : resultSections}
        <PageLayout className={tagFooterStyle} />
      </main>
    </>
  );
}
