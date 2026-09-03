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
import type { ContentLocation } from '@/models/ContentIndex';
import type { Locale } from '@/i18n/locales';

export namespace ExperienceItem {
  export type Props = (
    & ExperienceItemMetadata
    & ExperienceItemData
    & { tagResult?: boolean }
    & { sourceLink?: { location: ContentLocation, locale: Locale } }
  );
}

export function ExperienceItem({
  metadata,
  tagResult,
  sourceLink,
  ...props
}: ExperienceItem.Props) {
  const {
    children,
  } = 'experience' in props
    ? props.experience
    : props.project;
  const summary = (
    <>
      <ExperienceItemTitle {...props} metadata={metadata} sourceLink={sourceLink} />
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
      {tagResult
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
