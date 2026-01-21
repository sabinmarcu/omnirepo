import type { Simplify } from '@sabinmarcu/types';
import { grids } from './Experience.item.grid';
import type {
  ExperienceItemMetadata,
} from './Experience.item.types';

export namespace ExperienceItemLocation {
  export type Props = Simplify<(
    & ExperienceItemMetadata
  )>;
}
export function ExperienceItemLocation({ metadata }: ExperienceItemLocation.Props) {
  return (
    <>
      {metadata && metadata.location
        ? (<p {...grids.selector('location')}>{metadata.location}</p>)
        : null
      }
    </>
  );
}