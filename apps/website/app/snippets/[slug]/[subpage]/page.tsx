import type {
  Metadata,
} from 'next';
import { redirect404 } from '@/utils/routes.ssr';
import {
  snippetSlugs,
} from '@/data/snippets/snippets';
import { Code } from '@/components/Code';
import { Typography } from '@/components/mdx/Typography';
import { PageLayout } from '@/layouts/PageLayout';
import { resolveSnippetPage } from './data';
import { codeSectionStyle } from './page.css';

export async function generateStaticParams() {
  return snippetSlugs;
}

export async function generateMetadata(props: PageProps<'/snippets/[slug]/[subpage]'>): Promise<Metadata> {
  return resolveSnippetPage(props, {
    onError: () => ({}),
    onSuccess: (subpage) => ({
      title: subpage.title,
    }),
  });
}

export default async function SnippetPageSubpage(
  props: PageProps<'/snippets/[slug]/[subpage]'>,
) {
  return resolveSnippetPage(props, {
    onError: () => redirect404(),
    onSuccess: async (subpage) => {
      if (subpage.content && Array.isArray(subpage.content)) {
        return (
          <>
            {subpage.content
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
                  ? (<p>{comment}</p>)
                  : null}
                <PageLayout.Code variant={variant}>
                  <Code code={content} />
                </PageLayout.Code>
              </section>
              ))}
          </>
        );
      }

      return subpage.content;
    },
  });
}
