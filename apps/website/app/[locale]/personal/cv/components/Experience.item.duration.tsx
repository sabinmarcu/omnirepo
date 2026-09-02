import type { Simplify } from '@sabinmarcu/types';
import {
  getLocale,
  getTranslations,
} from 'next-intl/server';
import { grids } from './Experience.item.grid';
import type {
  ExperienceItemData,
} from './Experience.item.types';
import { pickExperienceField } from './Experience.item.utils';

const monthIndexes: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

function formatTimelineDate(value: string, locale: string, present: string) {
  if (/^present$/i.test(value)) {
    return present;
  }

  const year = /^(\d{4})$/.exec(value)?.[1];
  if (year) {
    return new Intl.DateTimeFormat(locale, {
      timeZone: 'UTC',
      year: 'numeric',
    }).format(new Date(Date.UTC(Number(year), 0)));
  }

  const monthAndYear = /^([A-Za-z]+) (\d{4})$/.exec(value);
  const month = monthAndYear
    ? monthIndexes[monthAndYear[1].toLowerCase()]
    : undefined;
  if (monthAndYear && month !== undefined) {
    const formatted = new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC',
      year: 'numeric',
    }).format(new Date(Date.UTC(Number(monthAndYear[2]), month)));
    return [
      formatted[0].toLocaleUpperCase(locale),
      formatted.slice(1),
    ].join('');
  }

  return value;
}

export namespace ExperienceItemDuration {
  export type Props = Simplify<(
    & ExperienceItemData
  )>;
}
export async function ExperienceItemDuration(
  props: ExperienceItemDuration.Props,
) {
  const { to, from } = {
    to: pickExperienceField(props, 'to'),
    from: pickExperienceField(props, 'from'),
  };
  if (!to && !from) {
    return null;
  }
  const [locale, translate] = await Promise.all([
    getLocale(),
    getTranslations('dates'),
  ]);
  const present = translate('present');
  const formattedFrom = typeof from === 'string'
    ? formatTimelineDate(from, locale, present)
    : from;
  const formattedTo = typeof to === 'string'
    ? formatTimelineDate(to, locale, present)
    : to;
  return (
    <p {...grids.selector('duration')}>
      {formattedFrom}
      {formattedTo ? ` - ${formattedTo}` : ''}
    </p>
  );
}
