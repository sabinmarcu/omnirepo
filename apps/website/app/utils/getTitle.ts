import { rootTitle } from './getTitle.constants';

export function getTitle(
  ...partials: string[]
) {
  if (partials.length > 0) {
    const partialText = partials.join(' - ');
    return `${partialText} -- ${rootTitle}`;
  }
  return rootTitle;
}
