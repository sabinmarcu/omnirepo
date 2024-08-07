import { dateToState } from '../utils/date.ts';
import type { StateType } from './types.ts';

export const seedData = {
  pageTitle: 'This is my team!',
  startDate: dateToState(Date.now()),
  rotations: [
    { name: 'Dailies' },
    { name: 'Weeklies' },
    { name: 'Biweeklies' },
  ],
} satisfies StateType;
