import { getTranslations } from 'next-intl/server';
import { getListings } from '@/lib/api';
import { ListingCard } from '@/components/listing-card';
import { SearchBar } from '@/components/search-bar';
import { SortSelect } from '@/components/sort-select';

type Params = { locale: string };
type SearchParams = { [key: string]: string | string[] | undefined };

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function RecherchePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'listings' });

  const data = await getListings({
    transactions: first(searchParams.transactions),
    typeIds: first(searchParams.typeIds),
    countryIds: first(searchParams.countryIds),
    cityIds: first(searchParams.cityIds),
    cityId: first(searchParams.cityId),
    bedrooms: first(searchParams.bedrooms),
    bathrooms: first(searchParams.bathrooms),
    surfaceMin: first(searchParams.surfaceMin),
    priceMin: first(searchParams.priceMin),
    priceMax: first(searchParams.priceMax),
    sort: first(searchParams.sort),
    q: first(searchParams.q),
    limit: 24,
  });

  return (
    <main className="mx-auto px-4 md:px-6 py-6">
      <SearchBar />

      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-text-muted">{t('count', { count: data.total })}</p>
        <SortSelect searchParams={searchParams} />
      </div>

      {data.items.length === 0 ? (
        <p className="text-text-muted mt-6">{t('noResults')}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 mt-4">
          {data.items.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </main>
  );
}
