import { focusAtom } from 'jotai-optics';
import { splitAtom } from 'jotai/utils';
import { storageAtom } from './storage.ts';

export const pageTitleAtom = focusAtom(
  storageAtom,
  (optics) => optics.prop('pageTitle'),
);

export const startDateAtom = focusAtom(
  storageAtom,
  (optics) => optics.prop('startDate'),
);

export const rotationsAtom = focusAtom(
  storageAtom,
  (optics) => optics.prop('rotations'),
);

export const rotationsListAtom = splitAtom(rotationsAtom);
