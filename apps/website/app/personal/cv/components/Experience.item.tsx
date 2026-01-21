import {
  experienceItemStyles,
} from './Experience.item.css';
import { ExperienceItemDuration } from './Experience.item.duration';
import { grids } from './Experience.item.grid';
import { ExperienceItemLocation } from './Experience.item.location';
import { ExperienceItemSkills } from './Experience.item.skills';
import { ExperienceItemTitle } from './Experience.item.title';
import type {
  ExperienceItemData,
  ExperienceItemMetadata,
} from './Experience.item.types';

export namespace ExperienceItem {
  export type Props = (
    & ExperienceItemMetadata
    & ExperienceItemData
  );
}

export function ExperienceItem({
  metadata,
  ...props
}: ExperienceItem.Props) {
  const {
    children,
  } = 'experience' in props
    ? props.experience
    : props.project;
  return (
    <section className={experienceItemStyles}>
      <ExperienceItemTitle {...props} metadata={metadata} />
      {(metadata && metadata.location) || ((props as any).from)
        ? (
          <div {...grids.selector('metadata')}>
            <ExperienceItemDuration {...props} />
            <ExperienceItemLocation metadata={metadata} />
          </div>
        )
        : null}
      {children
        ? (
          <div {...grids.selector('content')}>
            {children}
          </div>
        )
        : null
      }
      <ExperienceItemSkills {...props} />
    </section>
  );
}

ExperienceItem.className = experienceItemStyles;
