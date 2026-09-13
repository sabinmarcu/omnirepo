import { getTranslations } from 'next-intl/server';
import { cls } from '@/utils/cls';
import { ThemedLink } from './primitives/ThemedLink';
import {
  tagPillStyle,
} from './TagPill.css';
import {
  ProjectResource,
  type ProjectStatus,
} from '@/models/ProjectResource';
import { statusPillStyle } from './StatusPill.css';

export namespace StatusPill {
  export type Props = {
    status: ProjectStatus,
    deprecatedFor?: string,
  };
}

export async function StatusPill(props: StatusPill.Props) {
  const { status } = props;
  if (status === 'deprecated') {
    const translate = await getTranslations('status');
    const { deprecatedFor } = props;
    if (!deprecatedFor) {
      return null;
    }

    const Project = await ProjectResource.fromSlug(deprecatedFor);
    if (!Project) {
      return null;
    }
    const [
      slug,
      title,
    ] = await Promise.all([
      Project.slug,
      Project.title,
    ]);

    return (
      <ThemedLink
        href={{
          pathname: '/projects/[slug]',
          params: { slug },
        }}
      >
        <span className={cls(tagPillStyle, statusPillStyle({ status }))}>
          {translate('deprecatedFor', { title })}
        </span>
      </ThemedLink>
    );
  }

  const translate = await getTranslations('status.status');

  return (
    <span className={cls(tagPillStyle, statusPillStyle({ status }))}>
      <span>{translate(status)}</span>
    </span>
  );
}
