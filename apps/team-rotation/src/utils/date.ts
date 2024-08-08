import dayjs from 'dayjs';

dayjs.locale('ro');

const romanianDateFormat = 'DD.MM.YYYY';
export const parseDate = (input: Parameters<typeof dayjs>[0]) => (
  typeof input === 'string'
    ? dayjs(input, romanianDateFormat, 'ro')
    : dayjs(input)
);
export const dateToState = (input: Parameters<typeof dayjs>[0]) => (
  parseDate(input).format(romanianDateFormat)
);