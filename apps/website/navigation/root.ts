import { categoriesMap } from './categories';
import { normalizeNavigationList } from './utils';

export const rootNavigation = normalizeNavigationList([
  {
    theme: 'base',
    text: 'Home',
    href: '/',
  },
  {
    ...categoriesMap.personal,
    text: 'Personal',
  },
  {
    ...categoriesMap.articles,
    text: 'Articles',
  },
  {
    ...categoriesMap.ramblings,
    text: 'Ramblings',
  },
  {
    ...categoriesMap.projects,
    href: '/tools',
    text: 'Tools',
  },
  {
    ...categoriesMap.snippets,
    text: 'Snippets',
  },
] as const);