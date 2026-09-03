import type { Metadata } from 'next';
import { headers } from 'next/headers';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { variantSelector } from '@sabinmarcu/website-theme';
import { notFound } from 'next/navigation';
import {
  Experiments,
} from '@/experiments';
import { getThemeVariant } from '@/theme';
import { withExperiment } from '@/experiments/components/withExperiment';
import { isLocale } from '@/i18n/locales';
import {
  isConfiguredLocaleDomain,
  localeDomain,
} from '@/i18n/domains';
import {
  rootBackgroundStyle,
  scanLinesStyle,
} from '../layout.css';

const metadata: Metadata = {
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

// Runs before first paint so pixel-locked patterns (scanlines) never render at
// the wrong period. Re-runs on resize to catch zoom and monitor changes.
const devicePixelRatioScript = '(()=>{const s=()=>document.documentElement.style.setProperty(\'--dpr\',String(window.devicePixelRatio||1));s();window.addEventListener(\'resize\',s)})()';

export namespace RootLayout {
  export type Props = (
    & LayoutProps<'/[locale]'>
    & withExperiment.Props<'scanlines'>
  );
}

export async function generateMetadata(
  { params }: LayoutProps<'/[locale]'>,
): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return metadata;
  }

  const host = (await headers()).get('host')?.split(':', 1)[0] ?? '';
  const domain = localeDomain(locale);
  if (!isConfiguredLocaleDomain(host) || !domain) {
    return {
      ...metadata,
      robots: {
        follow: false,
        index: false,
      },
    };
  }

  return {
    ...metadata,
    metadataBase: new URL(`https://${domain.domain}`),
  };
}

export default withExperiment('scanlines')(
  async function RootLayout({
    children,
    scanlines,
    params,
  }: RootLayout.Props) {
    const { locale } = await params;
    if (!isLocale(locale)) {
      notFound();
    }
    return (
      <html
        lang={locale}
        {...{ [variantSelector]: await getThemeVariant() }}
      >
        <head>
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: devicePixelRatioScript }}
          />
        </head>
        <NextIntlClientProvider locale={locale}>
          <body className={rootBackgroundStyle}>
            {children}
            <Experiments />
            {scanlines ? <div className={scanLinesStyle} /> : null}
          </body>
        </NextIntlClientProvider>
      </html>
    );
  },
);
