'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { apiGetFavorites, type ListingSummary } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { ListingCard } from '@/components/listing-card';

export default function FavorisPage() {
  const t = useTranslations('listings');
  const locale = useLocale();
  const [items, setItems] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthed(true);
    apiGetFavorites(token)
      .then((f) => setItems(f.map((x) => x.listing)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto px-4 md:px-6 py-6">
      <h1 className="text-xl font-semibold tracking-tight">{t('favoritesTitle')}</h1>

      {loading ? (
        <p className="text-text-muted mt-4">…</p>
      ) : !authed ? (
        <p className="mt-4">
          <Link href={`/${locale}/connexion`} className="text-brand-text font-semibold">
            {t('loginToSee')}
          </Link>
        </p>
      ) : items.length === 0 ? (
        <p className="text-text-muted mt-4">{t('emptyFavorites')}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 mt-5">
          {items.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </main>
  );
}
