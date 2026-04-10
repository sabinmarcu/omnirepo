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

  const page = snippet.getPage(subpage);
  if (!page) {
    return null;
  }

  const { title } = snippet;
  if (page.slug === 'overview') {
    return (
      <TOCLayout className={snippetLayoutPageStyles} toc={page.toc}>
        <Typography as="h1">{title}</Typography>
        {children}
      </TOCLayout>
    );
  }
  const { content } = page;

  const Layout = (Array.isArray(content) && content.length > 1)
    ? TOCLayout
    : PageLayout;
  return (
    <Layout className={snippetLayoutPageStyles} toc={page.toc}>
      <Typography as="h1">Source: {page.title}</Typography>
      {children}
    </Layout>
  );
}
