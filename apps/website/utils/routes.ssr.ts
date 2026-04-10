import { headersMap } from '@/proxy.constants';
import { headers } from 'next/headers';
import {
  redirect,
  RedirectType,
} from 'next/navigation';

const getRouteHeader = async (header: keyof typeof headersMap) => {
  const headersList = await headers();
  const pathname = headersList.get(headersMap[header]);
  return pathname!;
};

export const getPathname = async () => (
  getRouteHeader('pathname')
);

export const getHash = async () => (
  getRouteHeader('hash')
);

export const getQuery = async () => (
  getRouteHeader('query')
);

export const redirect404 = () => (
  redirect('/404' as any, RedirectType.replace)
);