const compileFamilies = <Families extends string>(input: readonly Families[]) => (
  input.map((family) => ({
    value: family,
    title: `${family[0].toUpperCase()}${family.slice(1)} Theme`,
  })) as {
    value: Families,
    title: string,
  }[]
);

export const themeMapping = {
  playground: {
    title: 'Playground',
    list: compileFamilies(['base', 'red', 'blue', 'green']),
  },
  website: {
    title: 'Website',
    list: compileFamilies([
      'personal',
      'projects',
      'articles',
      'ramblings',
      'snippets',
      'neutral',
    ]),
  },
} as const;
