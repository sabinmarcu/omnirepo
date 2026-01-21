import { categoriesMap } from './categories';
import {
  extendCategory,
  normalizeNavigationList,
} from './utils';

export const homepageNavigation = normalizeNavigationList([
  {
    ...categoriesMap.personal,
    text: 'About Me',
  },
  extendCategory('personal', ({ href }) => ({

    href: `${href}/cv`,
    text: 'My CV',
  })),
  extendCategory('personal', ({ href }) => ({
    href: `${href}/stack`,
    text: 'My Tech Stack',
  })),
  {
    ...categoriesMap.projects,
    text: 'Active Projects',
  },
  {
    ...categoriesMap.articles,
    text: 'Articles',
  },
  {
    ...categoriesMap.ramblings,
    text: 'Blog',
  },
  {
    ...categoriesMap.snippets,
    text: 'Code Snippets',
  },
] as const);
