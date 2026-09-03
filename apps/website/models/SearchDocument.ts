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
  tags: TagId[],
};
