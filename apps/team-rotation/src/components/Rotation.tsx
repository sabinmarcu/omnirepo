import type { RotationProperties } from './Rotation.types.tsx';
import { RotationDisplay } from './Rotation.display.tsx';
import { RotationCard } from './Rotation.style.tsx';

export function Rotation({ atom }: RotationProperties) {
  return (
    <RotationCard>
      <RotationDisplay atom={atom} />
    </RotationCard>
  );
}
