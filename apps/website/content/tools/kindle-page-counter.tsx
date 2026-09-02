'use client';

import type { FormEvent } from 'react';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  useTranslations,
} from 'next-intl';
import {
  sectionStyles,
  rootStyles,
  wrapperStyles,
} from './kindle-page-counter.css';

// Maths:
//  words per row: 12
//  rows per page: 34
//  locations per page: 10139 - 10155 = 16
//  current page: 10139
//  last page: 16209 = 16
//  words per page: 240
//  pages per novel: 240

const useOnInput = <T extends unknown>(
  setter: ReturnType<typeof useState<T>>[1],
  processor?: (input: string) => T | undefined,
) => {
  const onInput = useCallback(
    ({ currentTarget: { value } }: FormEvent<HTMLInputElement>) => {
      setter(processor?.(value) ?? value as any);
    },
    [setter, processor],
  );
  return onInput;
};

export default function KindlePageCounter() {
  const translate = useTranslations('kindlePageCounter');
  const [wordsPerRow, setWordsPerRow] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(0);
  const [locationsPerPage, setLocationsPerPage] = useState(0);
  const wordsPerPage = useMemo(
    () => wordsPerRow * rowsPerPage,
    [wordsPerRow, rowsPerPage],
  );

  const [currentLocation, setCurrentLocation] = useState(0);
  const currentKindlePage = useMemo(
    () => currentLocation / locationsPerPage,
    [currentLocation, locationsPerPage],
  );
  const currentPage = useMemo(
    () => Number.parseInt(`${(currentKindlePage * wordsPerPage) / 240}`, 10),
    [currentKindlePage, wordsPerPage],
  );

  const [lastLocation, setLastLocation] = useState(0);
  const lastKindlePage = useMemo(
    () => lastLocation / locationsPerPage,
    [lastLocation, locationsPerPage],
  );
  const lastPage = useMemo(
    () => Number.parseInt(`${(lastKindlePage * wordsPerPage) / 240}`, 10),
    [lastKindlePage, wordsPerPage],
  );

  const onSetWordsPerRow = useOnInput(setWordsPerRow as any, Number.parseInt);
  const onSetRowsPerPage = useOnInput(setRowsPerPage as any, Number.parseInt);
  const onSetLocationsPerPage = useOnInput(setLocationsPerPage as any, Number.parseInt);
  const onSetCurrentLocation = useOnInput(setCurrentLocation as any, Number.parseInt);
  const onSetLastLocation = useOnInput(setLastLocation as any, Number.parseInt);
  return (
    <main className={rootStyles}>
      <div className={wrapperStyles}>
        <section className={sectionStyles}>
          <label>
            <span>{translate('wordsPerRow')}</span>
            <input type="number" value={wordsPerRow} onInput={onSetWordsPerRow} />
          </label>
          <label>
            <span>{translate('rowsPerPage')}</span>
            <input type="number" value={rowsPerPage} onInput={onSetRowsPerPage} />
          </label>
          <label>
            <span>{translate('locationsPerPage')}</span>
            <input type="number" value={locationsPerPage} onInput={onSetLocationsPerPage} />
          </label>
          <label>
            <span>{translate('currentLocation')}</span>
            <input type="number" value={currentLocation} onInput={onSetCurrentLocation} />
          </label>
          <label>
            <span>{translate('lastLocation')}</span>
            <input type="number" value={lastLocation} onInput={onSetLastLocation} />
          </label>
        </section>
        <section className={sectionStyles}>
          <h2>{translate('results')}</h2>
          <label>
            <span>{translate('currentPage')}</span>
            <input type="number" value={currentPage} onInput={() => {}} />
          </label>
          <label>
            <span>{translate('totalPages')}</span>
            <input type="number" value={lastPage} onInput={() => {}} />
          </label>
        </section>
      </div>
    </main>
  );
}
