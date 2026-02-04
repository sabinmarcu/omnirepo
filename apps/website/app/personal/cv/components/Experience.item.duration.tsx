import type { Simplify } from '@sabinmarcu/types';
import { grids } from './Experience.item.grid';
import type {
  ExperienceItemData,
} from './Experience.item.types';
import { pickExperienceField } from './Experience.item.utils';

export namespace ExperienceItemDuration {
  export type Props = Simplify<(
    & ExperienceItemData
  )>;
}
export function ExperienceItemDuration(
  props: ExperienceItemDuration.Props,
) {
  const { to, from } = {
    to: pickExperienceField(props, 'to'),
    from: pickExperienceField(props, 'from'),
  };
  if (!to && !from) {
    return null;
  }
  return (
    <p {...grids.selector('duration')}>{from} - {to}</p>
  );
}
