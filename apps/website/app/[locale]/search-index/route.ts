import { isLocale } from '@/i18n/locales';
import { searchCorpus } from '@/models/SearchCorpus.server';

export async function GET(
  _request: Request,
  { params }: RouteContext<'/[locale]/search-index'>,
) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return Response.json({ error: 'Unknown locale.' }, { status: 404 });
  }

  return Response.json(await searchCorpus(locale), {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
