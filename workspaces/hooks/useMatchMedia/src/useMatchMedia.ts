import {
  useDebugValue,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const useMatchMedia = (
  ...mediaQueries: (string | [string, string])[]
) => {
  const [
    matches,
    setMatches,
  ] = useState<boolean>(false);
  const queries = useMemo(
    () => mediaQueries.map((query) => {
      if (Array.isArray(query)) {
        const [
          key,
          value,
        ] = query;
        return `(${key}: ${value})`;
      }
      if (query.startsWith('(') && query.endsWith(')')) {
        return query;
      }
      if (query.startsWith('!')) {
        return query.slice(1);
      }
      return `(${query})`;
    }),
    [mediaQueries],
  );
  const matchMedia = useMemo(
    () => {
      const wnd = typeof window === 'undefined' ? undefined : window;
      if (!wnd) {
        return undefined;
      }
      return wnd.matchMedia(queries.join(', '));
    },
    [queries],
  );
  useEffect(
    () => {
      if (!matchMedia) {
        return undefined;
      }
      const handler = (match: MediaQueryListEvent | MediaQueryList) => setMatches(match.matches);
      matchMedia.addEventListener('change', handler);
      handler(matchMedia);
      return () => matchMedia.removeEventListener('change', handler);
    },
    [
      matchMedia,
      setMatches,
    ],
  );
  useDebugValue(matches);
  return matches;
};
