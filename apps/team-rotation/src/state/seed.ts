import { dateToState } from '../utils/date.ts';
import type {
  RotationTeamType,
  StateType,
} from './types.ts';

const possibleNames = [
  'John',
  'Jane',
  'Steve',
  'Bob',
  'Johnny',
] as const;

const possibleSurnames = [
  'Doe',
  'White',
  'Black',
  'Carpenter',
  'Odinsson',
  'Lokisson',
  'Thorsson',
  'Jefferson',
] as const;

const getRandomInteger = (max: number, min = 1) => (
  Number.parseInt(`${Math.random() * (max - min) + min}`, 10)
);

const pickOneOf = (list: readonly string[]) => {
  const index = getRandomInteger(list.length);
  return list[index];
};

const generateList = () => {
  const numberOfItems = getRandomInteger(5, 2);

  const list = Array.from({ length: numberOfItems }).map(
    () => `${pickOneOf(possibleNames)} ${pickOneOf(possibleSurnames)}`,
  );

  const name = `Team ${String.fromCodePoint(getRandomInteger(25) + 65)}`;
  return {
    name,
    list,
  } satisfies RotationTeamType;
};

export const seedData = {
  pageTitle: 'This is my team!',
  rotations: [
    {
      name: 'Weeklies',
      startDate: dateToState(Date.now()),
      every: 1,
      teams: [generateList()],
    },
    {
      name: 'Bi-Weeklies',
      startDate: dateToState(Date.now()),
      every: 2,
      teams: [
        generateList(),
        generateList(),
      ],
    },
    {
      name: 'Monthlies',
      startDate: dateToState(Date.now()),
      every: 4,
      teams: [generateList()],
    },
  ],
} satisfies StateType;