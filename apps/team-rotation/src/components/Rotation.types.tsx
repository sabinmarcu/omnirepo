import type { PrimitiveAtom } from 'jotai';
import type {
  RotationTeamType,
  RotationType,
} from '../state/types.js';
import type { useDndSortable } from '../hooks/useDndSortable.js';

export type RotationProperties = {
  atom: PrimitiveAtom<RotationType>,
  dndProps: ReturnType<typeof useDndSortable>['dragHandleProps'],
  onToggle: () => void,
};

export type RotationTeamProperties = {
  atom: PrimitiveAtom<RotationTeamType>,
};

export type RotationTeamListProperties = {
  atom: PrimitiveAtom<RotationTeamType['list']>,
};
