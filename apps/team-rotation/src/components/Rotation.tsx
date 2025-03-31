import {
  useMemo,
  useState,
} from 'react';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { RotationDisplay } from './Rotation.display.jsx';
import { RotationCard } from './Rotation.style.jsx';
import type { RotationEditProperties } from './Rotation.edit.jsx';
import { RotationEdit } from './Rotation.edit.jsx';
import { useDndSortable } from '../hooks/useDndSortable.js';
import { parseDate } from '../utils/date.js';

export type RotationComponentProperties = Omit<RotationEditProperties, 'onToggle' | 'dndProps'>;
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
  const {
    startDate, every,
  } = useAtomValue(atom);
  const weeksUntilChange = useMemo(
    () => {
      const weekSinceStart = dayjs(Date.now()).diff(parseDate(startDate), 'week');
      const rotationsSinceStart = Math.floor(weekSinceStart % every);
      return rotationsSinceStart;
    },
    [
      startDate,
      every,
    ],
  );
  const isActiveThisWeek = weeksUntilChange === 0;
  return (
    <RotationCard
      isActive={isActiveThisWeek}
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
