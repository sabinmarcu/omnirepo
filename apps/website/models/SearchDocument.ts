import type { Locale } from '@/i18n/locales';
import type { TagKind } from './TagRegistry';
import type { ContentLocation } from './ContentIndex';
import type { TagId } from './Tag';

export type SearchDocumentType =
  | 'tag'
  | 'project' | 'experience' | 'degree' | 'publication'
  | 'skill' | 'snippet' | 'tool' | 'article';

export type SearchDocument = {
  id: string,
  title: string,
  text: string,
  type: SearchDocumentType,
  location: ContentLocation,
  locale: Locale,
  kind?: TagKind,
  tags: TagId[],
};
