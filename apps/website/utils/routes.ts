import { WIPRoutes } from '@/constants/wiplist';
import createRouteMatcher from '@tscircuit/routematch';

export const getRoute = (pathname?: string) => {
  const currentPathname = pathname;
  if (!currentPathname) {
    return null;
  }

  const segments = currentPathname.split('/').filter(Boolean);
  return segments;
};

export const matchRoute = (
  route: string[] | string,
  pathname?: string,
) => {
  const currentPathname = pathname;
  const routes = Array.isArray(route)
    ? route
    : [route];

  if (!currentPathname) {
    return false;
  }

  const matcher = createRouteMatcher(routes);

  return matcher(currentPathname);
};

export const extendPathname = (
  pathname: string,
  segment: string,
) => [pathname, segment].join('/');

export const getRouteCategory = (pathname: string) => {
  const route = getRoute(pathname);
  if (!route) {
    return undefined;
  }
  const [category] = route;
  return category;
};

export const isRouteWIP = (pathname: string) => (
  matchRoute(WIPRoutes as unknown as string[], pathname)
);
