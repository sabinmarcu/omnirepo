import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TranslationFallbackNotice } from '@/i18n/TranslationFallbackNotice';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { Icon } from '@/components/Icon';
import { Typography } from '@/components/primitives/Typography';
import { isLocale } from '@/i18n/locales';
import { canonicalMetadata } from '@/i18n/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { TOCLayout } from '@/layouts/TOCLayout';
import { ProjectResource } from '@/models/ProjectResource';
import { formatContentDate } from '@/models/ContentResource';
import { redirect404 } from '@/utils/routes.ssr';
import {
  projectDatesStyle,
  projectResourceLinksStyle,
  projectResourceLinkStyle,
} from './page.css';

export async function generateMetadata(
  { params }: PageProps<'/[locale]/projects/[slug]'>,
): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await ProjectResource.fromSlug(slug, locale);
  if (!project) return {};
  const localizedPathnames = Object.fromEntries(await Promise.all(
    (await project.variants).map(async (variant) => [
      await variant.locale,
      `/projects/${await variant.slug}`,
    ]),
  ));
  return {
    title: await project.title,
    ...await canonicalMetadata(
      locale,
      `/projects/${await project.slug}`,
      localizedPathnames,
    ),
  };
}

export default async function ProjectPage({ params }: PageProps<'/[locale]/projects/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return redirect404();
  const project = await ProjectResource.fromSlug(slug, locale);
  if (!project) return redirect404();
  const page = await project.getPage(await project.slug);
  if (!page) return redirect404();
  const [
    translate,
    createdAt,
    modifiedAt,
    repo,
    links,
    releases,
    aur,
    npm,
  ] = await Promise.all([
    getTranslations('projects'),
    project.createdAt,
    project.modifiedAt,
    project.repo,
    project.links,
    project.releases,
    project.aur,
    project.npm,
  ]);
  return (
    <TOCLayout
      toc={page.toc}
      entryDepth={page.entryDepth}
      maxDepth={page.maxDepth}
    >
      <TranslationFallbackNotice locale={locale} resource={project} />
      <Typography as="h1">{await project.title}</Typography>
      <p className={projectDatesStyle}>
        {translate('createdAndLastUpdated', {
          createdAt: formatContentDate(createdAt, locale),
          modifiedAt: formatContentDate(modifiedAt, locale),
        })}
      </p>
      <PageLayout.Inset>
        <div className={projectResourceLinksStyle}>
          <ThemedLink className={projectResourceLinkStyle} href={repo}>
            <Icon icon="github" />
            GitHub
          </ThemedLink>
          {links
            ? Object.entries(links).map(([name, url]) => (
              <ThemedLink key={name} className={projectResourceLinkStyle} href={url}>
                {name}
              </ThemedLink>
            ))
            : null}
        </div>
        {releases || aur || npm
          ? (
            <div className={projectResourceLinksStyle}>
              {npm
                ? (
                  <ThemedLink className={projectResourceLinkStyle} href={`https://www.npmjs.com/package/${npm}`}>
                    {`NPM: ${npm}`}
                  </ThemedLink>
                )
                : null}
              {releases
                ? (
                  <ThemedLink className={projectResourceLinkStyle} href={`${repo}/releases`}>
                    {translate('githubRelease')}
                  </ThemedLink>
                )
                : null}
              {aur
                ? aur.map((aurPackage) => (
                  <ThemedLink className={projectResourceLinkStyle} href={`https://aur.archlinux.org/packages/${aurPackage}`}>
                    {`AUR: ${aurPackage}`}
                  </ThemedLink>
                ))
                : null}
            </div>
          )
          : null}
      </PageLayout.Inset>
      {page.content}
    </TOCLayout>
  );
}
