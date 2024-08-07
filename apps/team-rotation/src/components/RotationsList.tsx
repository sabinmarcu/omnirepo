import {
  useAtom,
} from 'jotai/react';
import {
  rotationsListAtom,
} from '../state/atoms.ts';
import { RotationsListWrapper } from './RotationsList.style.tsx';
import { Rotation } from './Rotation.tsx';

export function RotationsList() {
  const [rotations] = useAtom(rotationsListAtom);
  return (
    <RotationsListWrapper>
      {rotations.map((atom) => (
        <Rotation atom={atom} key={`${atom}`} />
      ))}
    </RotationsListWrapper>
  );
}
