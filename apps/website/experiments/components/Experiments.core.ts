import {
  getPathname,
  getQuery,
} from '@/utils/routes.ssr';
import { redirect } from 'next/navigation';

const queryParameter = 'experiments';

export async function experimentsDialogOpen() {
  'use server';

  const search = await getQuery();
  const params = new URLSearchParams(search);
  const open = params.has(queryParameter);

  return open ? 'open' : 'closed';
}

export async function toggleExperimentsDialog() {
  'use server';

  const search = await getQuery();
  const params = new URLSearchParams(search);
  if (params.has(queryParameter)) {
    params.delete(queryParameter);
  } else {
    params.append(queryParameter, '');
  }

  const url = [
    await getPathname(),
    params.toString(),
  ].join('?');

  redirect(url as any);
}
