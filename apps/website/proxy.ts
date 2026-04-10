import {
  type NextProxy,
  NextResponse,
} from 'next/server';
import { headersMap } from './proxy.constants';

export const proxy: NextProxy = (request, event) => {
  if (event) {
    const headers = new Headers(request.headers);
    headers.set(headersMap.pathname, request.nextUrl.pathname);
    headers.set(headersMap.hash, request.nextUrl.hash);
    headers.set(headersMap.query, request.nextUrl.search);
    return NextResponse.next({ request: { headers } });
  }
  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
