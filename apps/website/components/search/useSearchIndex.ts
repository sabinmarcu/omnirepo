'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { SearchDocument } from '@/models/SearchDocument';
import { SearchIndex } from '@/models/SearchIndex';

export function useSearchIndex(corpusUrl: string) {
  const [documents, setDocuments] = useState<SearchDocument[]>();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const loadDocuments = async () => {
      try {
        const response = await fetch(corpusUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Search corpus request failed: ${response.status}`);
        }
        setDocuments(await response.json() as SearchDocument[]);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setLoadError(true);
      }
    };
    loadDocuments();
    return () => controller.abort();
  }, [corpusUrl]);

  return {
    index: useMemo(() => new SearchIndex(documents ?? []), [documents]),
    loaded: !!documents,
    loadError,
  };
}
