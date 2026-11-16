'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { apiMineStats } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Icon } from '@/components/icons';

export default function StatsPage() {
  const t = useTranslations('dash');
  const [s, setS] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    apiMineStats(token).then((d) => {
      setS(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-text-muted">…</p>;

  const cards = [
    { icon: 'building2', label: t('totalListings'), value: s?.totalListings ?? 0 },
    { icon: 'eye', label: t('totalViews'), value: s?.totalViews ?? 0 },
    { icon: 'award', label: t('featured'), value: s?.featured ?? 0 },
    { icon: 'heart', label: t('favorites'), value: s?.favorites ?? 0 },
    { icon: 'chat', label: t('leads'), value: s?.leads ?? 0 },
  ];

  return (
    <main>
      <h1 className="text-xl font-semibold tracking-tight">{t('stats')}</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-border p-4">
            <Icon name={c.icon} size={20} className="text-brand-text" />
            <div className="text-2xl font-bold mt-2">{c.value}</div>
            <div className="text-xs text-text-muted">{c.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-8">{t('listingsByStatus')}</h2>
      <div className="border border-border mt-3 divide-y divide-border-soft">
        {s?.byStatus && Object.keys(s.byStatus).length > 0 ? (
          Object.entries(s.byStatus).map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-2 text-sm">
              <span className="text-text-muted">{k}</span>
              <span className="font-semibold">{v as number}</span>
            </div>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-text-muted">{t('noData')}</div>
        )}
      </div>
    </main>
  );
}
