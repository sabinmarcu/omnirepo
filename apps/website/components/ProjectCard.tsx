import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { TagPill } from '@/components/TagPill';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { withTooltip } from '@/components/Tooltip.hoc';
import { resolveTag } from '@/models/TagRegistry';
import { extendPathname } from '@/utils/routes';
import type { ProjectResource } from '@/models/ProjectResource';
import {
  projectCardHeaderStyle,
  projectCardKindStyle,
  projectCardMetaStyle,
  projectCardRepoStyle,
  projectCardSkillsStyle,
  projectCardStatusStyle,
  projectCardTitleStyle,
} from './ProjectCard.css';

export namespace ProjectCard {
  export type Props = {
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

export async function ProjectCard({ pathname, resource }: ProjectCard.Props) {
  const [slug, title, kind, status, skills, summary, repo] = await Promise.all([
    resource.slug,
    resource.title,
    resource.kind,
    resource.status,
    resource.skills,
    resource.summary,
    resource.repo,
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
        </Card.Title>
        <ProjectCardStatus tooltip={status} />
        <ProjectCardRepo href={repo} />
      </div>
      {summary ? <div className={projectCardMetaStyle}>{summary}</div> : null}
      <div className={projectCardSkillsStyle}>
        {skills.map((skill) => (
          <TagPill
            key={skill}
            id={resolveTag('skills', skill)}
            label={skill}
          />
        ))}
      </div>
    </Card>
  );
}
