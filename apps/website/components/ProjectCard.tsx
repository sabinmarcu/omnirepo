import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/Card';
import { TagPill } from '@/components/TagPill';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { formatContentDate } from '@/models/ContentResource';
import { tagLabel } from '@/models/TagRegistry';
import { extendPathname } from '@/utils/routes';
import type { ProjectResource } from '@/models/ProjectResource';
import {
  projectCardHeaderStyle,
  projectCardKindStyle,
  projectCardMetaStyle,
  projectCardSectionStyle,
  projectCardTitleStyle,
  projectCardUpdatedStyle,
  projectCardTagsListStyle,
  projectCardStyle,
} from './ProjectCard.css';
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
    <Card className={projectCardStyle({ status })}>
      <div
        className={projectCardHeaderStyle}
        {...{ [ThemedLink.undecoratedDataAttribute]: true }}
      >
        <Card.Title className={projectCardTitleStyle}>
          <ThemedLink href={href}>{title}</ThemedLink>
          <span className={projectCardKindStyle}>{kind}</span>
        </Card.Title>
        <div className={projectCardSectionStyle}>
          <p className={projectCardUpdatedStyle}>
            {translate('lastUpdated', { date: formatContentDate(modifiedAt, locale) })}
          </p>
        </div>
        <div className={projectCardSectionStyle}>
          <StatusPill status={status} />
          {deprecatedFor && <StatusPill status="deprecated" deprecatedFor={deprecatedFor} />}
        </div>
      </div>
      {summary ? <div className={projectCardMetaStyle}>{summary}</div> : null}
      <div className={projectCardTagsListStyle}>
        {tags.filter((tag) => !tag.startsWith('project:status:')).map((tag) => (
          <TagPill
            key={tag}
            id={tag}
            label={tagLabel(tag, (id) => id)}
          />
        ))}
      </div>
    </Card>
  );
}
