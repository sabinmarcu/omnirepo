import type { Metadata } from 'next';
import './globals.css';
import {
  Experiments,
} from '@/experiments';
import { getThemeVariant } from '@/theme';
import { variantSelector } from '@sabinmarcu/website-theme';
import { VT323 } from 'next/font/google';
import { withExperiment } from '@/experiments/components/withExperiment';
import { cls } from '@/utils/cls';
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

export const metadata: Metadata = {
  title: {
    default: 'Unknown Page',
    template: '%s | Sabin Marcu',
  },
  // manifest: '/site.webmanifest',
  // icons: {
  //   icon: [
  //     {
  //       url: '/favicon-96x96.png',
  //       sizes: '96x96',
  //       type: 'image/png',
  //     },
  //     {
  //       url: '/favicon.svg',
  //       type: 'image/svg+xml',
  //     },
  //   ],
  //   shortcut: ['/favicon.ico'],
  //   apple: [
  //     {
  //       url: '/apple-touch-icon.png',
  //       sizes: '180x180',
  //     },
  //   ],
  // },
};

export namespace RootLayout {
  export type Props = (
    & LayoutProps<'/'>
    & withExperiment.Props<'scanlines'>
  );
}

export default withExperiment('scanlines')(
  async function RootLayout({
    children,
    scanlines,
  }: RootLayout.Props) {
    return (
    <html
      lang="en"
      {...{ [variantSelector]: await getThemeVariant() }}
    >
      <body className={cls(
        rootFont.variable,
        rootFont.className,
        rootBackgroundStyle,
      )}>
        {children}
        <Experiments />
        {scanlines ? <div className={scanLinesStyle} /> : null}
      </body>
    </html>
    );
  },
);
