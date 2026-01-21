import { headers } from 'next/headers';
import {
  redirect,
  RedirectType,
} from 'next/navigation';

export const getPathname = async () => {
  const headersList = await headers();
  const pathname = headersList.get('x-current-path');
  return pathname!;
};

export const redirect404 = () => (
  redirect('/404' as any, RedirectType.replace)
);
