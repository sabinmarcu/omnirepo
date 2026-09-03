import type {
  Metadata,
} from 'next';
import { redirect404 } from '@/utils/routes.ssr';
import { canonicalMetadata } from '@/i18n/metadata';
import { TranslationFallbackNotice } from '@/i18n/TranslationFallbackNotice';
import { Code } from '@/components/Code';
import { Typography } from '@/components/primitives/Typography';
import { PageLayout } from '@/layouts/PageLayout';
import { SnippetResource } from '@/models/SnippetResource';
import { codeSectionStyle } from './page.css';

export async function generateMetadata(props: PageProps<'/[locale]/snippets/[slug]/[subpage]'>): Promise<Metadata> {
  const { params } = props;
  const {
    slug, subpage, locale,
  } = await params;

  const snippet = await SnippetResource.fromSlug(slug, locale);
  if (!snippet) {
    return {};
  }

  const page = await snippet.getPage(subpage);
  if (!page) {
    return {};
  }

  return {
    title: await page.title,
    ...await canonicalMetadata(
      locale,
      `/snippets/${await snippet.slug}/${await page.slug}`,
    ),
  };
}

export default async function SnippetPageSubpage(
  props: PageProps<'/[locale]/snippets/[slug]/[subpage]'>,
) {
  const { params } = props;
  const {
    slug, subpage, locale,
  } = await params;

  const snippet = await SnippetResource.fromSlug(slug, locale);
  if (!snippet) {
    return redirect404();
  }

  const page = await snippet.getPage(subpage);
  if (!page) {
    return redirect404();
  }

  const fallbackNotice = (
    <TranslationFallbackNotice locale={locale} resource={snippet} />
  );
  const content = await page.content;
  if (content && Array.isArray(content)) {
    return (
      <>
        {fallbackNotice}
        {content
          .filter(({ content }) => content.value)
          .map(({
            title,
            content,
            variant,
            comment,
          }) => (
            <section
              key={title}
              className={codeSectionStyle}
              {...{ [Typography.unstyledDataAttribute]: true }}
            >
              {title !== 'ROOT'
                ? (<Typography as="h2">{title}</Typography>)
                : null}
              {comment
                ? (<p dangerouslySetInnerHTML={{ __html: comment }} />)
                : null}
              <PageLayout.Code variant={variant}>
                <Code code={content} />
              </PageLayout.Code>
            </section>
          ))}
      </>
    );
  }

  return (
    <>
      {fallbackNotice}
      {content}
    </>
  );
}
