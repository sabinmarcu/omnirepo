import { focusAtom } from 'jotai-optics';
import { atom } from 'jotai';
import { splitAtom } from 'jotai/utils';
import { storedState } from './state.js';

export const dropRateAtom = focusAtom(
  storedState,
  (optic) => optic.prop('dropRate'),
);

export const percentDropRate = atom(
  (get) => get(dropRateAtom),
  (get, set, value: number) => {
    if (get(dropRateAtom) !== value && value > 0) {
      set(dropRateAtom, value);
    }
  },
);

export const upperLimitDropRate = atom(
  (get) => 100 / get(dropRateAtom),
);

export const unitDroprate = atom(
  (get) => get(dropRateAtom) / 100,
);

export const runsListAtom = focusAtom(
  storedState,
  (optic) => optic.prop('runsList'),
);

export const runsList = splitAtom(runsListAtom);

export const probabilityListAtom = focusAtom(
  storedState,
  (optic) => optic.prop('probabilityList'),
);

export const probabilityList = splitAtom(probabilityListAtom);
/**
 * x / 100 = 1 / y
 * x = 1 / y * 100
 * x * y = 100
 * y = 100 / x
 *
 * P(one drop) = 1 - (1 - p) ^ n
 * p = probability
 * n = number of tries
 * P = 1 - (1 - p) ^ n
 * (1 - p) ^ n = 1 - P
 * n = log(1 - P) / log(1 - p)
 * */
