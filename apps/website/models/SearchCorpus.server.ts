import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getTranslations } from 'next-intl/server';
import { isIgnoredTag } from '@/constants/ignoredTagPatterns';
import { contentPath } from '@/constants/paths';
import type { Locale } from '@/i18n/locales';
import { ContentIndex } from './ContentIndex';
import type { SearchDocument } from './SearchDocument';
import {
  parseTag,
  tagToPathSegments,
  type TagId,
} from './Tag';
import {
  canonicalTag,
  isTagNamespace,
  tagLabel,
  tagKind,
  tagRegistry,
} from './TagRegistry';
import { TagResource } from './TagResource';

const corpora = new Map<Locale, Promise<SearchDocument[]>>();

function contentText(source: string): string {
  return source
    .replaceAll(/^export const .+$/gm, '')
    .replaceAll(/^#{1,6}\s+![!a-z]+\s*/gm, '')
    .replaceAll(/[{}<>*_`[\]()]/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

async function tagDescription(id: TagId, locale: Locale): Promise<string> {
  const resource = await TagResource.fromId(id.replaceAll(':', '.'), locale);
  if (!resource) {
    return '';
  }

  const rawInput = await resource.rawInput;
  if (typeof rawInput !== 'string') {
    return '';
  }

  return contentText(await readFile(path.resolve(contentPath, rawInput), 'utf8'));
}

async function buildCorpus(locale: Locale): Promise<SearchDocument[]> {
  const [index, translate] = await Promise.all([
    ContentIndex.forLocale(locale),
    getTranslations({
      locale,
      namespace: 'tags',
    }),
  ]);
  const labels = translate.raw('labels') as Record<string, string>;
  const label = (id: TagId) => tagLabel(id, (key) => labels[key] ?? key);

  const contentDocuments: SearchDocument[] = index.entries
    .filter((entry) => entry.type !== 'skill')
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      text: [
        entry.title,
        entry.excerpt,
        entry.from,
        entry.to,
        ...entry.authoredTags.map(label),
        ...entry.tags.map(label),
      ].filter(Boolean).join(' '),
      type: entry.type,
      location: entry.location,
      locale: entry.locale,
      tags: entry.tags,
    }));

  const tagIds = new Set<TagId>([
    ...index.tags,
    ...Object.keys(tagRegistry),
  ]);
  const publicTagIds = [...tagIds].filter((id) => (
    !isTagNamespace(id)
    && canonicalTag(id) === id
    && parseTag(id).namespace !== 'org'
    && !isIgnoredTag(id)
  ));
  const tagDocuments = await Promise.all(publicTagIds.map(async (id): Promise<SearchDocument> => {
    const title = label(id);
    return {
      id: `tag:${id}`,
      title,
      text: [
        title,
        id.replaceAll(':', ' '),
        await tagDescription(id, locale),
      ].join(' '),
      type: 'tag',
      location: {
        pathname: '/tags/[...tag]',
        params: { tag: tagToPathSegments(id) },
      },
      locale,
      kind: tagKind(id),
      tags: [id],
    };
  }));

  return [...contentDocuments, ...tagDocuments]
    .toSorted((left, right) => left.title.localeCompare(right.title));
}

export function searchCorpus(locale: Locale): Promise<SearchDocument[]> {
  const cached = corpora.get(locale);
  if (cached) {
    return cached;
  }

  const corpus = buildCorpus(locale);
  corpora.set(locale, corpus);
  return corpus;
}
