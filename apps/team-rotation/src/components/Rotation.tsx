import { useState } from 'react';
import { RotationDisplay } from './Rotation.display.tsx';
import { RotationCard } from './Rotation.style.tsx';
import type { RotationEditProperties } from './Rotation.edit.tsx';
import { RotationEdit } from './Rotation.edit.tsx';
import { useDndSortable } from '../hooks/useDndSortable.ts';

export type RotationComponentProperties = Omit<RotationEditProperties, 'onToggle'>;
export function Rotation({
  atom,
  onRemove,
}: RotationComponentProperties) {
  const [
    editing,
    setEditing,
  ] = useState(false);
  const onToggle = () => setEditing((previous) => !previous);
  const {
    dragHandleProps,
    rootProps,
  } = useDndSortable(atom);
  return (
    <RotationCard
      {...rootProps}
    >
      {editing
        ? (
          <RotationEdit
            atom={atom}
            onToggle={onToggle}
            onRemove={onRemove}
            dndProps={dragHandleProps}
          />
        )
        : (
          <RotationDisplay
            atom={atom}
            onToggle={onToggle}
            dndProps={dragHandleProps}
          />
        )}
    </RotationCard>
  );
}