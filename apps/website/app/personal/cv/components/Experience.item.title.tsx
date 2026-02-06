import type { Simplify } from '@sabinmarcu/types';
import { NavigationAnchor } from '@/layouts/Navigation.anchor';
import { ThemedLink } from '@/components/ThemedLink';
import { grids } from './Experience.item.grid';
import type {
  ExperienceItemData,
  ExperienceItemMetadata,
} from './Experience.item.types';
import {
  getTOCAnchor,
  pickExperienceField,
} from './Experience.item.utils';

export namespace ExperienceItemTitle {
  export type Props = Simplify<(
    & ExperienceItemData
    & ExperienceItemMetadata
  )>;
}
export function ExperienceItemTitle({ metadata, ...props }: ExperienceItemTitle.Props) {
  const title = pickExperienceField(props, 'title');
  const prefix = 'project' in props ? 'project' : 'experience';
  const link = 'project' in props ? props.project.link : undefined;
  if (!title) {
    return null;
  }

  const inner = (
    <>
      <NavigationAnchor {...getTOCAnchor(props, { prefix })} />
      <span>{title}</span>
      {metadata
        ? (<span>{metadata.company}</span>)
        : null
      }
    </>
  );

  const final = link
    ? (<ThemedLink href={link as any}>{inner}</ThemedLink>)
    : inner;

  return (
    <h3
      {...grids.selector('title')}
    >
      {final}
    </h3>
  );
}
