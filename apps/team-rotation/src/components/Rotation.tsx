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
  const sortable = useDndSortable(atom);
  return (
    <RotationCard
      {...sortable}
    >
      {editing
        ? <RotationEdit atom={atom} onToggle={onToggle} onRemove={onRemove} />
        : <RotationDisplay atom={atom} onToggle={onToggle} />}
    </RotationCard>
  );
}
