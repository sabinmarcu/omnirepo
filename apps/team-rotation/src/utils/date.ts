import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';

dayjs.extend(localizedFormat);
dayjs.locale('ro');

export const dateToState = (input: Parameters<typeof dayjs>[0]) => (
  dayjs(input, 'DD.MM.YYYY', 'ro').format('L')
);
