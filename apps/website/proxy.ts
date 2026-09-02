import {
  type NextProxy,
  NextResponse,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { isRouteWIP } from './utils/routes';
import { isLocale } from './i18n/locales';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export const proxy: NextProxy = (request) => {
  const [, firstSegment, ...remainingSegments] = request.nextUrl.pathname.split('/');
  const pathname = isLocale(firstSegment)
    ? `/${remainingSegments.join('/')}`
    : request.nextUrl.pathname;

  if (isRouteWIP(pathname)) {
    return NextResponse.redirect(new URL('/404', request.url));
  }
  return handleI18nRouting(request);
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
