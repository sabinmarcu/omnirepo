import MiniSearch from 'minisearch';
import type {
  SearchDocument,
  SearchDocumentType,
} from './SearchDocument';

export class SearchIndex {
  private readonly documentsById: Map<string, SearchDocument>;

  private readonly engine: MiniSearch<SearchDocument>;

  constructor(documents: SearchDocument[]) {
    this.documentsById = new Map(
      documents.map((document) => [document.id, document]),
    );
    this.engine = new MiniSearch<SearchDocument>({
      fields: ['title', 'text', 'tags'],
      storeFields: ['id'],
      searchOptions: {
        boost: {
          title: 4,
          tags: 2,
        },
        fuzzy: 0.2,
        prefix: true,
      },
    });
    this.engine.addAll(documents);
  }

  search(
    query: string,
    type: SearchDocumentType | 'all' = 'all',
    limit = 30,
  ): SearchDocument[] {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return [];
    }

    return this.engine.search(normalizedQuery)
      .map(({ id }) => this.documentsById.get(String(id)))
      .filter((document): document is SearchDocument => (
        !!document && (type === 'all' || document.type === type)
      ))
      .slice(0, limit);
  }
}
