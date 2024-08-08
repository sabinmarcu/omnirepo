import type { PrimitiveAtom } from 'jotai';
import type {
  RotationTeamType,
  RotationType,
} from '../state/types.ts';

export type RotationProperties = {
  atom: PrimitiveAtom<RotationType>,
  onToggle: () => void,
};

export type RotationTeamProperties = {
  atom: PrimitiveAtom<RotationTeamType>,
};

export type RotationTeamListProperties = {
  atom: PrimitiveAtom<RotationTeamType['list']>,
};
