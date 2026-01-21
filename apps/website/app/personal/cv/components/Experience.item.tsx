import type z from 'zod';
import type {
  workplaceProjectSchema,
  workplaceExperienceSchema,
  workplaceMasterMetadataSchema,
} from '../schemas';
import {
  experienceItemStyles,
  grids,
} from './Experience.item.css';

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
      <h3 data-grid={grids.title}>
        <span>{title}</span>
        {metadata
          ? (<span>{metadata.company}</span>)
          : null
        }
      </h3>
      <p data-grid={grids.duration}>{from} - {to}</p>
      {metadata
        ? (<p data-grid={grids.location}>{metadata.location}</p>)
        : null
      }
      {children
        ? (
          <div data-grid={grids.content}>
            {children}
          </div>
        )
        : null
      }
    </div>
  );
}

ExperienceItem.className = experienceItemStyles;
