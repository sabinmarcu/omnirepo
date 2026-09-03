import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TagPill } from '@/components/TagPill';
import { isIgnoredTag } from '@/constants/ignoredTagPatterns';
import { isLocale } from '@/i18n/locales';
import { canonicalMetadata } from '@/i18n/metadata';
import { Navigation } from '@/layouts/Navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { ContentIndex } from '@/models/ContentIndex';
import {
  parseTag,
  type TagId,
} from '@/models/Tag';
import {
  promotedTags,
  tagLabel,
} from '@/models/TagRegistry';
import { redirect404 } from '@/utils/routes.ssr';
import {
  tagListStyle,
  tagsPageStyle,
  tagSectionStyle,
} from './page.css';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/tags'>): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Tags',
    ...await canonicalMetadata(locale, '/tags'),
  };
}

function rootTags(tags: TagId[]): TagId[] {
  const roots = new Set<TagId>();
  for (const id of tags) {
    const tag = parseTag(id);
    if (tag.namespace !== 'org') {
      roots.add(tag.segments.length > 1 ? tag.segments[0] : id);
    }
  }
  return [...roots].toSorted((left, right) => left.localeCompare(right));
}

export default async function TagsPage({
  params,
}: PageProps<'/[locale]/tags'>) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return redirect404();
  }
  const [translate, index] = await Promise.all([
    getTranslations('tags'),
    ContentIndex.forLocale(locale),
  ]);
  const labels = translate.raw('labels') as Record<string, string>;
  const label = (id: TagId) => tagLabel(id, (key) => labels[key] ?? key);

  return (
    <>
      <Navigation />
      <PageLayout>
        <main className={tagsPageStyle}>
          <header>
            <h1>{translate('title')}</h1>
          </header>
          <section className={tagSectionStyle}>
            <h2>{translate('promoted')}</h2>
            <div className={tagListStyle}>
              {promotedTags.filter((id) => !isIgnoredTag(id)).map((id) => (
                <TagPill
                  key={id}
                  id={id}
                  label={label(id)}
                  count={index.byTagPrefix(id).length}
                />
              ))}
            </div>
          </section>
          <section className={tagSectionStyle}>
            <h2>{translate('browse')}</h2>
            <div className={tagListStyle}>
              {rootTags(index.tags.filter((id) => !isIgnoredTag(id))).map((id) => (
                <TagPill
                  key={id}
                  id={id}
                  label={label(id)}
                  count={index.byTagPrefix(id).length}
                />
              ))}
            </div>
          </section>
        </main>
      </PageLayout>
    </>
  );
}
