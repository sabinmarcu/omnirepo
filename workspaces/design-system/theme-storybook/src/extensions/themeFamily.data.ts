import { setupTheme as websiteThemes } from '@sabinmarcu/website/theme';
import { themes } from '../config/themes.js';

const compileFamilies = <Families extends string>(input: Families[]) => (
  input.map((family) => ({
    value: family,
    title: `${family[0].toUpperCase()}${family.slice(1)} Theme`,
  })) as {
    value: Families,
    title: string,
  }[]
);

const playgroundSelectionList = compileFamilies(themes.families);

const websiteSelectionList = compileFamilies(
  websiteThemes.families
    .filter(
      (it) => !themes.families.includes(it as any),
    ) as unknown as Exclude<
    typeof websiteThemes.families[number],
    typeof themes.families[number]
    >[],
);

export const themeMapping = {
  playground: {
    title: 'Playground',
    list: playgroundSelectionList,
  },
  website: {
    title: 'Website',
    list: websiteSelectionList,
  },
} as const;
