'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getAuth } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { ListingCard } from '@/components/listing-card';

export default function FavorisPage() {
  const t = useTranslations('dash');
  const [favs, setFavs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    getAuth('/favorites', token).then((d) => {
      setFavs(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-text-muted">…</p>;

  const listings = favs.map((f) => f.listing).filter(Boolean);

  return (
    <main>
      <h1 className="text-xl font-semibold tracking-tight">{t('favorites')}</h1>
      {listings.length === 0 ? (
        <p className="text-text-muted text-sm mt-4">{t('noData')}</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </main>
  );
}
