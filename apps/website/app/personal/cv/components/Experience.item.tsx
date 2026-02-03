import type z from 'zod';
import type {
  workplaceProjectSchema,
  workplaceExperienceSchema,
  workplaceMasterMetadataSchema,
} from '../schemas';
import {
  experienceItemStyles,
} from './Experience.item.css';
import { grids } from './Experience.item.grid';

export namespace ExperienceItem {
  export type Props = (
    & { metadata?: z.infer<typeof workplaceMasterMetadataSchema> }
    & (
      | { experience: z.infer<typeof workplaceExperienceSchema>[number] }
      | { project: z.infer<typeof workplaceProjectSchema>[number] }
    )
  );
}

export function ExperienceItem({
  metadata,
  ...props
}: ExperienceItem.Props) {
  const {
    title,
    to,
    from,
    children,
  } = 'experience' in props
    ? props.experience
    : props.project;
  return (
    <div className={experienceItemStyles}>
      <h3 {...grids.selector('title')}>
        <span>{title}</span>
        {metadata
          ? (<span>{metadata.company}</span>)
          : null
        }
      </h3>
      <p {...grids.selector('duration')}>{from} - {to}</p>
      {metadata
        ? (<p {...grids.selector('location')}>{metadata.location}</p>)
        : null
      }
      {children
        ? (
          <div {...grids.selector('content')}>
            {children}
          </div>
        )
        : null
      }
    </div>
  );
}

ExperienceItem.className = experienceItemStyles;
