import { categoriesMap } from './categories';
import {
  extendCategory,
  normalizeNavigationList,
} from './utils';

export const getHomepageNavigation = (translate: (key: string) => string) => normalizeNavigationList([
  {
    ...categoriesMap.personal,
    text: translate('about'),
  },
  extendCategory('personal', ({ href }) => ({

    href: `${href}/cv`,
    text: translate('cv'),
  })),
  extendCategory('personal', ({ href }) => ({
    href: `${href}/stack`,
    text: translate('stack'),
  })),
  {
    ...categoriesMap.projects,
    text: translate('activeProjects'),
  },
  {
    ...categoriesMap.articles,
    text: translate('articles'),
  },
  {
    ...categoriesMap.ramblings,
    text: translate('blog'),
  },
  {
    ...categoriesMap.projects,
    href: '/tools',
    text: translate('tools'),
  },
  {
    ...categoriesMap.snippets,
    text: translate('snippets'),
  },
] as const);
