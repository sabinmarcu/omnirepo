import type { CVDegreeItem } from '@/models/CV.types';
import { cls } from '@/utils/cls';
import { ExperienceItemTitle } from './Experience.item.title';
import { ExperienceItemDuration } from './Experience.item.duration';
import { ExperienceItemLocation } from './Experience.item.location';
import { grids } from './Experience.item.grid';
import { experienceItemStyles } from './Experience.item.css';
import { degreeItemStyles } from './Degree.item.css';

export namespace DegreeItem {
  export type Props = (
    CVDegreeItem
  );
}

export function DegreeItem({
  degree: {
    title, from, to,
  },
  metadata,
}: DegreeItem.Props) {
  return (
    <section
      className={cls(
        experienceItemStyles,
        degreeItemStyles,
      )}
    >
      <ExperienceItemTitle
        {...{ experience: { title } } as any}
        metadata={metadata}
      />

      <div {...grids.selector('metadata')}>
        <ExperienceItemLocation metadata={metadata} />
        <ExperienceItemDuration {...{
          experience: {
            to,
            from,
          },
        } as any} />
      </div>
    </section>
  );
}