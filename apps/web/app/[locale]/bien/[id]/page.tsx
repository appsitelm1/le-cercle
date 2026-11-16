import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getListing } from '@/lib/api';
import { FavoriteButton } from '@/components/favorite-button';
import { ContactForm } from '@/components/contact-form';
import { ListingGallery } from '@/components/listing-gallery';
import { PriceDisplay } from '@/components/price-display';

function Feature({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="border border-border-soft p-3">
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="font-semibold mt-0.5">{value}</dd>
    </div>
  );
}

export default async function BienPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'listings' });
  const listing = await getListing(params.id);
  if (!listing) notFound();

  return (
    <main className="max-w-[1100px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold tracking-tight">{listing.title}</h1>
      <p className="text-sm text-text-muted mt-1">
        {listing.city?.name}
        {listing.neighborhood ? ` · ${listing.neighborhood.name}` : ''} · {t('reference')}{' '}
        {listing.ref}
      </p>

      <div className="mt-4 grid md:grid-cols-[1fr_320px] gap-6">
        <div className="min-w-0">
          <ListingGallery images={listing.images ?? []} title={listing.title} />

          <section className="mt-6">
            <h2 className="text-lg font-semibold">{t('description')}</h2>
            <p className="text-sm mt-2 whitespace-pre-line">{listing.description}</p>
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-semibold">{t('features')}</h2>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 text-sm">
              <Feature label={t('surface')} value={listing.surface ? `${listing.surface} m²` : null} />
              <Feature label={t('bedrooms')} value={listing.bedrooms?.toString() ?? null} />
              <Feature label={t('bathrooms')} value={listing.bathrooms?.toString() ?? null} />
              {listing.features?.map((f) => (
                <Feature key={f.feature.name} label={f.feature.name} value={f.value} />
              ))}
            </dl>
          </section>

          {listing.lat != null && listing.lng != null && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold">{t('location')}</h2>
              <div className="mt-3 border border-border">
                <iframe
                  title="Carte"
                  width="100%"
                  height="320"
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.lng - 0.01}%2C${listing.lat - 0.01}%2C${listing.lng + 0.01}%2C${listing.lat + 0.01}&layer=mapnik&marker=${listing.lat}%2C${listing.lng}`}
                />
              </div>
            </section>
          )}
        </div>

        <aside className="md:sticky md:top-20 h-fit border border-border p-4 shadow-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <PriceDisplay price={Number(listing.price)} className="font-bold text-xl" />
              <div className="text-sm text-text-muted mt-1">
                {listing.type?.name} · {listing.transaction === 'RENT' ? t('rent') : t('sale')}
              </div>
            </div>
            <FavoriteButton listingId={listing.id} />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${listing.title} (${listing.ref})`)}`}
              target="_blank"
              rel="noreferrer"
              className="h-10 bg-whatsapp text-white font-semibold inline-flex items-center justify-center"
            >
              {t('whatsapp')}
            </a>
            <a
              href="tel:"
              className="h-10 border border-border font-semibold inline-flex items-center justify-center"
            >
              {t('call')}
            </a>
            <button className="h-10 bg-brand-grad text-onbrand font-semibold">{t('contact')}</button>
          </div>

          <div className="mt-4 pt-4 border-t border-border-soft">
            <ContactForm listingId={listing.id} />
          </div>
        </aside>
      </div>
    </main>
  );
}
