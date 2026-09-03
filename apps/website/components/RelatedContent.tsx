import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import {
  ContentIndex,
  type IndexEntry,
} from '@/models/ContentIndex';
import {
  relatedContentLinkStyle,
  relatedContentListStyle,
  relatedContentStyle,
  relatedContentTypeStyle,
} from './RelatedContent.css';

export namespace RelatedContent {
  export type Props = {
    locale: Locale,
    entryIds: string[],
    excludeIdPrefix?: string,
    limit?: number,
  };
}

function rankedRelatedEntries(
  index: ContentIndex,
  entryIds: string[],
  excludeIdPrefix: string | undefined,
  limit: number,
): IndexEntry[] {
  const sourceIds = new Set(entryIds);
  const scores = new Map<string, { entry: IndexEntry, score: number }>();

  for (const entryId of entryIds) {
    for (const entry of index.related(entryId, index.entries.length)) {
      const excluded = (
        sourceIds.has(entry.id)
        || (excludeIdPrefix && entry.id.startsWith(excludeIdPrefix))
      );
      if (!excluded) {
        const current = scores.get(entry.id);
        scores.set(entry.id, {
          entry,
          score: (current?.score ?? 0) + 1,
        });
      }
    }
  }

  return [...scores.values()]
    .toSorted((left, right) => (
      right.score - left.score
      || (right.entry.from ?? '').localeCompare(left.entry.from ?? '')
      || left.entry.title.localeCompare(right.entry.title)
    ))
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export async function RelatedContent({
  locale,
  entryIds,
  excludeIdPrefix,
  limit = 5,
}: RelatedContent.Props) {
  const [translate, index] = await Promise.all([
    getTranslations('relatedContent'),
    ContentIndex.forLocale(locale),
  ]);
  const entries = rankedRelatedEntries(index, entryIds, excludeIdPrefix, limit);
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className={relatedContentStyle}>
      <h2>{translate('title')}</h2>
      <ul className={relatedContentListStyle}>
        {entries.map((entry) => (
          <li key={entry.id}>
            <ThemedLink decoration="none" className={relatedContentLinkStyle} href={entry.location}>
              <strong>{entry.title}</strong>
              <span className={relatedContentTypeStyle}>{entry.type}</span>
            </ThemedLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
