'use client';

import type { PropsWithChildren } from 'react';
import {
  VT323,
} from 'next/font/google';
import { withExperiment } from '@/experiments/components/withExperiment';
import {
  rootBackgroundStyle,
  scanLinesStyle,
} from './layout.css';

const rootFont = VT323({
  variable: '--font-root',
  subsets: ['latin'],
  preload: true,
  weight: '400',
});

// eslint-disable-next-line prefer-arrow-callback
export const RootBodyLayout = withExperiment('scanlines')(function RootBodyLayout({
  children,
  scanlines,
}: Readonly<PropsWithChildren<withExperiment.Props<'scanlines'>>>) {
  return (
    <body
      className={[
        rootFont.variable,
        rootFont.className,
        rootBackgroundStyle,
      ].filter(Boolean).join(' ')}
      >
        {children}
        {scanlines
          ? <div className={scanLinesStyle} />
          : null}
    </body>
  );
});

