'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { apiMyListings, getAuth } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Icon } from '@/components/icons';

export default function ActivitesPage() {
  const t = useTranslations('dash');
  const [listings, setListings] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.all([apiMyListings(token), getAuth('/leads', token)]).then(([l, ld]) => {
      setListings(l);
      setLeads(Array.isArray(ld) ? ld : []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-text-muted">…</p>;

  const events: any[] = [
    ...leads.map((l) => ({ type: 'lead', date: l.createdAt, text: `Lead : ${l.name ?? ''}`, sub: l.listing?.title })),
    ...listings.map((l) => ({ type: 'listing', date: l.createdAt, text: l.title, sub: `${l.views ?? 0} ${t('viewsLabel')} · ${l.status}` })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main>
      <h1 className="text-xl font-semibold tracking-tight">{t('activities')}</h1>
      {events.length === 0 ? (
        <p className="text-text-muted text-sm mt-4">{t('noData')}</p>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-border-soft border border-border">
          {events.slice(0, 40).map((e, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Icon name={e.type === 'lead' ? 'chat' : 'building2'} size={16} className="text-brand-text flex-none" />
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{e.text}</div>
                <div className="text-xs text-text-muted">{e.sub} · {e.date ? new Date(e.date).toLocaleString() : ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
