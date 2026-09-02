import {
  type NextProxy,
  NextResponse,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { isRouteWIP } from './utils/routes';
import { isConfiguredLocaleDomain } from './i18n/domains';
import { isLocale } from './i18n/locales';
import {
  fallbackRouting,
  routing,
} from './i18n/routing';

const handleDomainI18nRouting = createMiddleware(routing);
const handleFallbackI18nRouting = createMiddleware(fallbackRouting);

export const proxy: NextProxy = (request) => {
  const [, firstSegment, ...remainingSegments] = request.nextUrl.pathname.split('/');
  const pathname = isLocale(firstSegment)
    ? `/${remainingSegments.join('/')}`
    : request.nextUrl.pathname;

  if (isRouteWIP(pathname)) {
    return NextResponse.redirect(new URL('/404', request.url));
  }
  return isConfiguredLocaleDomain(request.nextUrl.hostname)
    ? handleDomainI18nRouting(request)
    : handleFallbackI18nRouting(request);
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
