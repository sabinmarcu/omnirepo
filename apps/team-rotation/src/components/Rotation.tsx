import { useState } from 'react';
import type { RotationProperties } from './Rotation.types.tsx';
import { RotationDisplay } from './Rotation.display.tsx';
import { RotationCard } from './Rotation.style.tsx';
import { RotationEdit } from './Rotation.edit.tsx';

export type RotationComponentProperties = Omit<RotationProperties, 'onToggle'>;
export function Rotation({ atom }: RotationComponentProperties) {
  const [
    editing,
    setEditing,
  ] = useState(false);
  const onToggle = () => setEditing((previous) => !previous);
  return (
    <RotationCard>
      {editing
        ? <RotationEdit atom={atom} onToggle={onToggle} />
        : <RotationDisplay atom={atom} onToggle={onToggle} />}
    </RotationCard>
  );
}
