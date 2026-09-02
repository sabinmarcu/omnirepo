import { categoriesMap } from './categories';
import { normalizeNavigationList } from './utils';

export const getRootNavigation = (translate: (key: string) => string) => normalizeNavigationList([
  {
    theme: 'base',
    text: translate('home'),
    href: '/',
  },
  {
    ...categoriesMap.personal,
    text: translate('personal'),
  },
  {
    ...categoriesMap.articles,
    text: translate('articles'),
  },
  {
    ...categoriesMap.ramblings,
    text: translate('ramblings'),
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