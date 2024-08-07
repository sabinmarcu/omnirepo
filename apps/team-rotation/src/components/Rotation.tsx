import { focusAtom } from 'jotai-optics';
import type {
  PrimitiveAtom,
} from 'jotai/vanilla';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
} from '@mui/material';
import type { RotationType } from '../state/types.ts';
import { TitleEditor } from './TitleEditor.tsx';

interface RotationProperties {
  atom: PrimitiveAtom<RotationType>
}

export function Rotation({ atom }: RotationProperties) {
  const nameAtom = useMemo(
    () => (
      focusAtom(atom, (optics) => optics.prop('name'))
    ) as unknown as PrimitiveAtom<string>,
    [atom],
  );
  return (
    <Card>
      <CardContent>
        <TitleEditor atom={nameAtom} />
      </CardContent>
    </Card>
  );
}
