import type { Simplify } from '@sabinmarcu/types';
import { NavigationAnchor } from '@/layouts/Navigation.anchor';
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
  if (!title) {
    return null;
  }
  return (
    <h3
      {...grids.selector('title')}
    >
      <NavigationAnchor {...getTOCAnchor(props, { prefix })} />
      <span>{title}</span>
      {metadata
        ? (<span>{metadata.company}</span>)
        : null
      }
    </h3>
  );
}
