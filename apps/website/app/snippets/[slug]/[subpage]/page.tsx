import type {
  Metadata,
} from 'next';
import { redirect404 } from '@/utils/routes.ssr';
import { Code } from '@/components/Code';
import { Typography } from '@/components/mdx/Typography';
import { PageLayout } from '@/layouts/PageLayout';
import { SnippetResource } from '@/models/SnippetResource';
import { codeSectionStyle } from './page.css';

export async function generateMetadata(props: PageProps<'/snippets/[slug]/[subpage]'>): Promise<Metadata> {
  const { params } = props;
  const { slug, subpage } = await params;

  const snippet = await SnippetResource.fromSlug(slug);
  if (!snippet) {
    return {};
  }

  const page = snippet.getPage(subpage);
  if (!page) {
    return {};
  }

  return { title: page.title };
}

export default async function SnippetPageSubpage(
  props: PageProps<'/snippets/[slug]/[subpage]'>,
) {
  const { params } = props;
  const { slug, subpage } = await params;

  const snippet = await SnippetResource.fromSlug(slug);
  if (!snippet) {
    return redirect404();
  }

  const page = snippet.getPage(subpage);
  if (!page) {
    return redirect404();
  }
  if (page.content && Array.isArray(page.content)) {
    return (
      <>
        {page.content
          .filter(({ content }) => content.value)
          .map(({
            title,
            content,
            variant,
            comment,
          }) => (
          <section key={title} className={codeSectionStyle}>
            {title !== 'ROOT'
              ? (<Typography as="h2">{title}</Typography>)
              : null
            }
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

  return page.content;
}
