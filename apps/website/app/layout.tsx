import type { Metadata } from 'next';
import './globals.css.ts';
import {
  Experiments,
  ExperimentsContextProvider,
  getExperiments,
} from '@/experiments';
import { getThemeVariant } from '@/theme';
import { variantSelector } from '@sabinmarcu/website-theme';
import { RootBodyLayout } from './layout.runtime';

export const metadata: Metadata = {
  title: {
    default: 'Unknown Page',
    template: '%s | Sabin Marcu',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      {...{ [variantSelector]: await getThemeVariant() }}
    >
      <ExperimentsContextProvider data={await getExperiments()}>
        <RootBodyLayout>
          {children}
          <Experiments />
        </RootBodyLayout>
      </ExperimentsContextProvider>
    </html>
  );
}

/* <span className={scanLinesStyle}></span> */
