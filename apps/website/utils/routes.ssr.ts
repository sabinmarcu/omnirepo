import {
  redirect,
} from '@/i18n/navigation';

export const redirect404 = () => (
  redirect('/404' as any)
);
