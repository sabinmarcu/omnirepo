import { focusAtom } from 'jotai-optics';
import { storageAtom } from './storage.ts';

export const pageTitleAtom = focusAtom(
  storageAtom,
  (optics) => optics.prop('pageTitle'),
);
