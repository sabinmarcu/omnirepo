import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { TagPill } from '@/components/TagPill';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { withTooltip } from '@/components/Tooltip.hoc';
import { formatContentDate } from '@/models/ContentResource';
import { tagLabel } from '@/models/TagRegistry';
import { extendPathname } from '@/utils/routes';
import type { ProjectResource } from '@/models/ProjectResource';
import {
  projectCardHeaderStyle,
  projectCardKindStyle,
  projectCardMetaStyle,
  projectCardRepoStyle,
  projectCardTagsStyle,
  projectCardStatusStyle,
  projectCardTitleStyle,
  projectCardUpdatedStyle,
} from './ProjectCard.css';

export namespace ProjectCard {
  export type Props = {
    locale: string,
    pathname: string,
    resource: ProjectResource,
  };
}

const ProjectCardStatus = withTooltip(function ProjectCardStatus({
  tooltip,
}: { tooltip?: string }) {
  return (
    <span aria-label={tooltip} className={projectCardStatusStyle}>
      <Icon icon="check-circle" />
    </span>
  );
}, undefined, { position: 'left' });

function ProjectCardRepo({ href }: { href: string }) {
  return (
    <ThemedLink aria-label="GitHub" className={projectCardRepoStyle} href={href as any}>
      <Icon icon="github" />
    </ThemedLink>
  );
}

export async function ProjectCard(
  {
    locale, pathname, resource,
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
    repo,
    modifiedAt,
  ] = await Promise.all([
    getTranslations('projects'),
    resource.slug,
    resource.title,
    resource.kind,
    resource.status,
    resource.tags,
    resource.summary,
    resource.repo,
    resource.modifiedAt,
  ]);
  const href = extendPathname(pathname, slug) as any;

  return (
    <Card>
      <div
        className={projectCardHeaderStyle}
        {...{ [ThemedLink.undecoratedDataAttribute]: true }}
      >
        <Card.Title className={projectCardTitleStyle}>
          <ThemedLink href={href}>{title}</ThemedLink>
          <span className={projectCardKindStyle}>{kind}</span>
          <p className={projectCardUpdatedStyle}>
            {translate('lastUpdated', { date: formatContentDate(modifiedAt, locale) })}
          </p>
        </Card.Title>
        <ProjectCardStatus tooltip={status} />
        <ProjectCardRepo href={repo} />
      </div>
      {summary ? <div className={projectCardMetaStyle}>{summary}</div> : null}
      <div className={projectCardTagsStyle}>
        {tags.map((tag) => (
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
