import { getTranslations } from 'next-intl/server';
import type { SlideDeckResource } from '@/models/SlideDeckResource';
import {
  contentDateToDate,
  formatContentDate,
} from '@/models/ContentResource';
import { tagLabel } from '@/models/TagRegistry';
import { ContentCard } from '@/components/ContentCard';
import { contentCardUpdatedStyle } from '@/components/ContentCard.css';
import { projectListStyle } from '@/components/ProjectList.css';
import { showcaseListStyle } from '@/components/ShowcaseList.css';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { TagPill } from '@/components/TagPill';
import { cls } from '@/utils/cls';

export namespace DeckList {
  export type Props = {
    empty: string,
    locale: string,
    resources: SlideDeckResource[],
  };
}

export async function DeckList({
  empty, locale, resources,
}: DeckList.Props) {
  const [translate, translateMetadata] = await Promise.all([
    getTranslations('search'),
    getTranslations('projects'),
  ]);
  if (resources.length === 0) return <p>{empty}</p>;

  return (
    <div className={cls(showcaseListStyle, projectListStyle)}>
      {await Promise.all(resources.map(async (resource) => {
        const [id, slug, title, description, tags, modifiedAt] = await Promise.all([
          resource.id,
          resource.slug,
          resource.title,
          resource.description,
          resource.tags,
          resource.modifiedAt,
        ]);
        return (
          <ContentCard
            key={id}
            title={<ThemedLink href={`/slides/${slug}`}>{title}</ThemedLink>}
            kind={translate('types.slide-deck')}
            metadata={(
              <p className={contentCardUpdatedStyle}>
                <time dateTime={contentDateToDate(modifiedAt).toISOString().slice(0, 10)}>
                  {translateMetadata('lastUpdated', { date: formatContentDate(modifiedAt, locale) })}
                </time>
              </p>
            )}
            summary={description}
            tags={tags.map((tag) => (
              <TagPill key={tag} id={tag} label={tagLabel(tag, (label) => label)} />
            ))}
          />
        );
      }))}
    </div>
  );
}
