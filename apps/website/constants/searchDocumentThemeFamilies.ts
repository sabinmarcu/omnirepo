import type { families } from '@sabinmarcu/website-theme';
import type { SearchDocumentType } from '@/models/SearchDocument';

export const searchDocumentThemeFamilies: Record<SearchDocumentType, typeof families[number]> = {
  article: 'articles',
  'cv-project': 'personal',
  degree: 'personal',
  experience: 'personal',
  project: 'projects',
  publication: 'personal',
  skill: 'personal',
  snippet: 'snippets',
  tag: 'base',
  tool: 'projects',
};
