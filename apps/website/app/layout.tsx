import type { Metadata } from 'next';
import './globals.css';
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
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      {
        url: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
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
