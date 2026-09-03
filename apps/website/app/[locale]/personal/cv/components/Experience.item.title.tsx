import type { Simplify } from '@sabinmarcu/types';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { Typography } from '@/components/primitives/Typography';
import type { ContentLocation } from '@/models/ContentIndex';
import type { Locale } from '@/i18n/locales';
import { NavigationAnchor } from '@/layouts/Navigation.anchor';
import { ProjectResource } from '@/models/ProjectResource';
import { tocAnchorProps } from '@/utils/toc';
import { grids } from './Experience.item.grid';
import type {
  ExperienceItemData,
  ExperienceItemMetadata,
} from './Experience.item.types';
import {
  pickExperienceField,
} from './Experience.item.utils';

export namespace ExperienceItemTitle {
  export type Props = Simplify<(
    & ExperienceItemData
    & ExperienceItemMetadata
    & { sourceLink?: { location: ContentLocation, locale: Locale } }
  )>;
}
export async function ExperienceItemTitle({
  metadata,
  sourceLink,
  ...props
}: ExperienceItemTitle.Props) {
  const title = pickExperienceField(props, 'title');
  if (!title) {
    return null;
  }
  const prefix = 'project' in props ? 'project' : 'experience';
  const canonical = 'project' in props ? props.project.canonical : undefined;
  let link: string | undefined;
  if ('project' in props) {
    link = props.project.link;
    if (canonical) {
      const project = await ProjectResource.fromSlug(canonical);
      link = project ? await project.repo : undefined;
    }
  }

  const anchor = tocAnchorProps(
    [
      title,
      prefix === 'experience'
        ? metadata?.company
        : undefined,
    ].filter(Boolean).join(' '),
    { prefix },
  );

  const inner = (
    <>
      <NavigationAnchor {...anchor} />
      <span>{title}</span>
      {metadata
        ? (<span>{metadata.company}</span>)
        : null}
    </>
  );

  // eslint-disable-next-line no-nested-ternary
  const final = sourceLink
    ? (
      <ThemedLink href={sourceLink.location} locale={sourceLink.locale}>
        {inner}
      </ThemedLink>
    )
    : (link
      ? (<ThemedLink href={link as any}>{inner}</ThemedLink>)
      : inner);

  return (
    <Typography
      as="h3"
      {...grids.selector('title')}
    >
      {final}
    </Typography>
  );
}
