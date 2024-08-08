import {
  useAtom,
  useAtomValue,
} from 'jotai/react';
import { PlusOne } from '@mui/icons-material';
import { useCallback } from 'react';
import {
  rotationsAtom,
  rotationsListAtom,
} from '../state/atoms.ts';
import {
  RotationListAddButton,
  RotationsListWrapper,
} from './RotationsList.style.tsx';
import { Rotation } from './Rotation.tsx';
import { generateRotation } from '../state/seed.ts';
import type { RotationType } from '../state/types.ts';

export function RotationsList() {
  const [
    rotationsAtoms,
    setRotations,
  ] = useAtom(rotationsAtom);
  const rotations = useAtomValue(rotationsListAtom);
  const addRotation = useCallback(
    () => setRotations(
      (previousRotations) => [
        ...previousRotations,
        generateRotation(),
      ],
    ),
    [setRotations],
  );
  const removeRotation = useCallback(
    (rotation: RotationType) => () => {
      setRotations((oldRotations) => {
        const newRotations = oldRotations.filter((maybeRotation) => rotation !== maybeRotation);
        return newRotations;
      });
    },
    [setRotations],
  );
  return (
    <RotationsListWrapper>
      {rotations.map((atom, index) => (
        <Rotation
          atom={atom}
          key={`${atom}-${rotationsAtoms[index]['name']}`}
          onRemove={removeRotation(rotationsAtoms[index])}
        />
      ))}
      <RotationListAddButton onClick={addRotation}>
        <PlusOne />
      </RotationListAddButton>
    </RotationsListWrapper>
  );
}
