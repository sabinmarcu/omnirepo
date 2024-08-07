import { dateToState } from '../utils/date.ts';
import type { StateType } from './types.ts';

export const seedData = {
  pageTitle: 'This is my team!',
  startDate: dateToState(Date.now()),
} satisfies StateType;
