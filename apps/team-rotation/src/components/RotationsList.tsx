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
    (rotation: string) => () => {
      setRotations((oldRotations) => {
        const newRotations = oldRotations.filter(
          (maybeRotation) => rotation !== maybeRotation.id,
        );
        return newRotations;
      });
    },
    [setRotations],
  );
  return (
    <RotationsListWrapper>
      {rotationsAtoms.map((rotation, index) => (
        <Rotation
          atom={rotations[index]}
          key={rotation.id}
          onRemove={removeRotation(rotation.id)}
        />
      ))}
      <RotationListAddButton onClick={addRotation}>
        <PlusOne />
      </RotationListAddButton>
    </RotationsListWrapper>
  );
}
