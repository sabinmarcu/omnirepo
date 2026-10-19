import { getTranslations } from 'next-intl/server';
import { ContentCard } from '@/components/ContentCard';
import { TagPill } from '@/components/TagPill';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { formatContentDate } from '@/models/ContentResource';
import { tagLabel } from '@/models/TagRegistry';
import { extendPathname } from '@/utils/routes';
import type { ProjectResource } from '@/models/ProjectResource';
import { contentCardUpdatedStyle } from './ContentCard.css';
import { projectCardStyle } from './ProjectCard.css';
import { StatusPill } from '@/components/StatusPill';

export namespace ProjectCard {
  export type Props = {
    locale: string,
    pathname: string,
    resource: ProjectResource,
  };
}

export async function ProjectCard(
  {
    locale,
    pathname,
    resource,
  }: ProjectCard.Props,
) {
  const [
    translate,
    slug,
    title,
    kind,
    status,
    tags,
    summary,
    modifiedAt,
    deprecatedFor,
  ] = await Promise.all([
    getTranslations('projects'),
    resource.slug,
    resource.title,
    resource.kind,
    resource.status,
    resource.tags,
    resource.summary,
    resource.modifiedAt,
    resource.deprecatedFor,
  ]);
  const href = extendPathname(pathname, slug) as any;

  return (
    <ContentCard
      className={projectCardStyle({ status })}
      title={<ThemedLink href={href}>{title}</ThemedLink>}
      kind={kind}
      metadata={(
        <p className={contentCardUpdatedStyle}>
          {translate('lastUpdated', { date: formatContentDate(modifiedAt, locale) })}
        </p>
      )}
      badges={(
        <>
          <StatusPill status={status} />
          {deprecatedFor && <StatusPill status="deprecated" deprecatedFor={deprecatedFor} />}
        </>
      )}
      summary={summary}
      tags={tags.filter((tag) => !tag.startsWith('project:status:')).map((tag) => (
        <TagPill key={tag} id={tag} label={tagLabel(tag, (id) => id)} />
      ))}
    />
  );
}
