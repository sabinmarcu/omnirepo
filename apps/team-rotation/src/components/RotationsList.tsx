import {
  useAtom,
  useAtomValue,
} from 'jotai/react';
import { PlusOne } from '@mui/icons-material';
import { useCallback } from 'react';
import {
  rotationsAtom,
  rotationsListAtom,
} from '../state/atoms.js';
import {
  RotationListAddButton,
  RotationsListWrapper,
} from './RotationsList.style.jsx';
import { Rotation } from './Rotation.jsx';
import { generateRotation } from '../state/seed.js';
import { DndSort } from './DndSort.jsx';

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
    <DndSort atom={rotationsAtom}>
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
    </DndSort>
  );
}
