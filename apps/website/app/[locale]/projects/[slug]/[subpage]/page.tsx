import type { Metadata } from 'next';
import { TranslationFallbackNotice } from '@/i18n/TranslationFallbackNotice';
import { canonicalMetadata } from '@/i18n/metadata';
import { TOCLayout } from '@/layouts/TOCLayout';
import { ProjectResource } from '@/models/ProjectResource';
import { redirect404 } from '@/utils/routes.ssr';

export async function generateMetadata({ params }: PageProps<'/[locale]/projects/[slug]/[subpage]'>): Promise<Metadata> {
  const {
    locale, slug, subpage,
  } = await params;
  const project = await ProjectResource.fromSlug(slug, locale);
  const page = project ? await project.getPage(subpage) : undefined;
  if (!project || !page) return {};
  return {
    title: page.title,
    ...await canonicalMetadata(locale, `/projects/${await project.slug}/${page.slug}`),
  };
}

export default async function ProjectSubpage({ params }: PageProps<'/[locale]/projects/[slug]/[subpage]'>) {
  const {
    locale, slug, subpage,
  } = await params;
  const project = await ProjectResource.fromSlug(slug, locale);
  const page = project ? await project.getPage(subpage) : undefined;
  if (!project || !page) return redirect404();
  return (
    <TOCLayout
      toc={page.toc}
      entryDepth={page.entryDepth}
      maxDepth={page.maxDepth}
    >
      <TranslationFallbackNotice locale={locale} resource={project} />
      {page.content}
    </TOCLayout>
  );
}
