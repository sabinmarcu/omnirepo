import { PageLayout } from '@/layouts/PageLayout';
import { Typography } from '@/components/mdx/Typography';
import { SnippetResource } from '@/models/SnippetResource';
import { TOCLayout } from '@/layouts/TOCLayout';
import { snippetLayoutPageStyles } from './layout.css';

// export const dynamicParams = false;
// export const dynamic = 'force-static';
//
// export async function generateStaticParams() {
//   const snippets = await SnippetResource.getList();
//   const slugs = snippets
//     .flatMap(
//       ({ subpages, slug }) => (
//         subpages
//           .filter(({ slug }) => slug)
//           .map(
//             ({ slug: subpage }) => ({
//               slug,
//               subpage,
//             }),
//           )
//       ),
//     );
//
//   return slugs;
// }

export default async function SnippetLayoutPage(props: LayoutProps<'/snippets/[slug]/[subpage]'>) {
  const { params, children } = props;
  const { slug, subpage } = await params;

  const snippet = await SnippetResource.fromSlug(slug);
  if (!snippet) {
    return null;
  }

  const page = await snippet.getPage(subpage);
  if (!page) {
    return null;
  }

  const title = await snippet.title;
  const pageSlug = await page.slug;
  const toc = await page.toc;
  const content = await page.content;
  if (pageSlug === 'overview') {
    return (
      <TOCLayout className={snippetLayoutPageStyles} toc={toc}>
        <Typography as="h1">{title}</Typography>
        {children}
      </TOCLayout>
    );
  }

  const Layout = (Array.isArray(content) && content.length > 1)
    ? TOCLayout
    : PageLayout;
  return (
    <Layout className={snippetLayoutPageStyles} toc={toc}>
      <Typography as="h1">Source: {await page.title}</Typography>
      {children}
    </Layout>
  );
}
