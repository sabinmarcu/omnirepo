import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProjectList } from '@/components/ProjectList';
import { canonicalMetadata } from '@/i18n/metadata';
import { Navigation } from '@/layouts/Navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { sortByModifiedAt } from '@/models/ContentResource';
import { ProjectResource } from '@/models/ProjectResource';

export async function generateMetadata({ params }: PageProps<'/[locale]/projects'>): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Projects',
    ...await canonicalMetadata(locale, '/projects'),
  };
}

export default async function ProjectsPage({ params }: PageProps<'/[locale]/projects'>) {
  const { locale } = await params;
  const translate = await getTranslations('lists');
  const projects = await sortByModifiedAt(await ProjectResource.getLocalizedList(locale));

  return (
    <RootPageLayout theme="projects">
      <Navigation />
      <PageLayout>
        {projects.length === 0
          ? <p>{translate('noProjects')}</p>
          : <ProjectList locale={locale} pathname="/projects" resources={projects} />}
      </PageLayout>
    </RootPageLayout>
  );
}
