import type { Metadata } from 'next';
import { headers } from 'next/headers';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { Stylesheet } from '@sabinmarcu/stylesheet/react';
import { themeResetCSS } from '@sabinmarcu/theme';
import { serializeThemeManifests } from '@sabinmarcu/theme-core';
import {
  createWebsiteTheme,
  themeValues,
  variantSelector,
} from '@sabinmarcu/website-theme';
import { notFound } from 'next/navigation';
import {
  experimentEnabled,
  Experiments,
} from '@/experiments';
import { withExperiment } from '@/experiments/components/withExperiment';
import { getThemeVariant } from '@/theme';
import { WebsiteThemeDevtools } from '@/theme/ThemeDevtools';
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
    const websiteTheme = createWebsiteTheme();
    websiteTheme(themeValues);
    const themeDevtools = await experimentEnabled('themeDevtools');
    const manifestJson = themeDevtools ? JSON.stringify(websiteTheme.manifest()) : undefined;
    const manifests = manifestJson === undefined ? undefined : [JSON.parse(manifestJson)];
    const selection = await getThemeVariant();
    return (
      <html
        lang={locale}
        {...{ [variantSelector]: selection === 'system' ? undefined : selection }}
      >
        <head>
          <style
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: themeResetCSS }}
          />
          <Stylesheet stylesheet={websiteTheme.stylesheet} />
          {/* Inert discovery metadata for the theme devtools browser extension. */}
          {manifests
            ? (
              <script
                type="application/json"
                data-theme-manifests=""
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: serializeThemeManifests(manifests) }}
              />
            )
            : null}
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: devicePixelRatioScript }}
          />
        </head>
        <NextIntlClientProvider locale={locale}>
          <body className={rootBackgroundStyle}>
            {children}
            <Experiments />
            {manifests ? <WebsiteThemeDevtools manifests={manifests} /> : null}
            {scanlines ? <div className={scanLinesStyle} /> : null}
          </body>
        </NextIntlClientProvider>
      </html>
    );
  },
);
