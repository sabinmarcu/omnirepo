import { nanoid } from 'nanoid';
import { dateToState } from '../utils/date.ts';
import type {
  RotationTeamType,
  RotationType,
  StateType,
} from './types.ts';

const possibleRotationNames = [
  'Weeklies',
  'Bi-Weeklies',
  'Monthlies',
  'Quartierlies',
  'Whenverlies',
];

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
    id: nanoid(),
  } satisfies RotationTeamType;
};

export const generateRotation = ({
  name,
  startDate,
  every,
  teams,
}: {
  name?: string,
  startDate?: string,
  every?: number,
  teams?: RotationTeamType[]
} = {}) => {
  const currentName = name ?? pickOneOf(possibleRotationNames);
  const currentStartDate = startDate ?? dateToState(Date.now());
  const currentEvery = every ?? getRandomInteger(1, 12);
  const currentTeams = teams ?? Array.from({ length: getRandomInteger(1, 3) })
    .map(() => generateList()) as RotationTeamType[];
  return {
    name: currentName,
    startDate: currentStartDate,
    every: currentEvery,
    teams: currentTeams,
    id: nanoid(),
  } satisfies RotationType;
};

export const seedData = {
  pageTitle: 'This is my team!',
  rotations: [
    generateRotation({
      name: 'Weeklies',
      every: 1,
      teams: [generateList()],
    }),
    generateRotation({
      name: 'Bi-Weeklies',
      every: 2,
      teams: [
        generateList(),
        generateList(),
      ],
    }),
    generateRotation({
      name: 'Monthlies',
      every: 4,
      teams: [generateList()],
    }),
  ],
} satisfies StateType;
