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
    & { tagProject?: boolean }
  );
}

export function ExperienceItem({
  metadata,
  tagProject,
  ...props
}: ExperienceItem.Props) {
  const {
    children,
  } = 'experience' in props
    ? props.experience
    : props.project;
  const summary = (
    <>
      <ExperienceItemTitle {...props} metadata={metadata} />
      {(metadata && metadata.location) || ((props as any).from)
        ? (
          <div {...grids.selector('metadata')}>
            <ExperienceItemDuration {...props} />
            <ExperienceItemLocation metadata={metadata} />
          </div>
        )
        : null}
    </>
  );
  return (
    <section className={experienceItemStyles}>
      {tagProject
        ? (
          <div {...grids.selector('summary')}>
            {summary}
          </div>
        )
        : summary}
      {children
        ? (
          <div {...grids.selector('content')}>
            {children}
          </div>
        )
        : null}
      <ExperienceItemSkills {...props} />
    </section>
  );
}

ExperienceItem.className = experienceItemStyles;
