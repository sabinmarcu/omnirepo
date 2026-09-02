import type {
  CommonExperienceItemData,
  ExperienceItemData,
} from './Experience.item.types';

export function pickExperienceField(
  props: ExperienceItemData,
  field: keyof CommonExperienceItemData,
) {
  const unpackedProps = (
    'project' in props
      ? props.project
      : props.experience
  ) as unknown as CommonExperienceItemData;

  return unpackedProps[field];
}

export function getTOCSlug(
  props: ExperienceItemData | string,
  extra: { prefix?: string, suffix?: string } = {},
) {
  const title = typeof props === 'string'
    ? props
    : pickExperienceField(props, 'title');

  const { prefix, suffix } = extra;

  return [
    prefix,
    title,
    suffix,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replaceAll(/[ _-]/g, '-');
}

export function getTOCAnchor(
  props: ExperienceItemData,
  extra?: Parameters<typeof getTOCSlug>[1],
) {
  const slug = getTOCSlug(props, extra);
  return { id: slug };
}
