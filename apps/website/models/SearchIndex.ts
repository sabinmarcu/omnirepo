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

    const groupedResults = new Map<string, Array<{ document: SearchDocument, score: number }>>();
    for (const { id, score } of this.engine.search(normalizedQuery)) {
      const document = this.documentsById.get(String(id));
      if (document && (type === 'all' || document.type === type)) {
        const groupId = document.supersededBy ?? document.id;
        const group = groupedResults.get(groupId) ?? [];
        group.push({
          document,
          score,
        });
        groupedResults.set(groupId, group);
      }
    }

    return [...groupedResults.values()]
      .map((group) => group.toSorted((left, right) => (
        right.score - left.score
        || Number(right.document.type === 'project') - Number(left.document.type === 'project')
      )))
      .map(([primary, ...secondary]) => ({
        ...primary.document,
        secondaryResults: secondary.map(({ document }) => document),
      }))
      .slice(0, limit);
  }
}
