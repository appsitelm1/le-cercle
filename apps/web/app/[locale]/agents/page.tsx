'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getAgents } from '@/lib/api';
import { Icon } from '@/components/icons';

export default function AgentsPage() {
  const t = useTranslations('pro');
  const locale = useLocale();
  const [agents, setAgents] = useState<any[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    getAgents().then(setAgents);
  }, []);

  const filtered = agents.filter((a) => {
    const name = [a.user?.firstName, a.user?.lastName].filter(Boolean).join(' ').toLowerCase();
    return name.includes(q.trim().toLowerCase());
  });

  return (
    <main className="mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t('agentsTitle')}</h1>

      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t('searchAgent')}
        className="mt-4 h-10 w-full max-w-sm px-3 border border-border bg-surface text-sm"
      />

      {filtered.length === 0 ? (
        <p className="text-text-muted mt-4">{t('noResults')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {filtered.map((a) => (
            <div key={a.id} className="border border-border p-4 flex flex-col">
              <div className="aspect-square bg-surface-2 flex items-center justify-center text-text-muted">
                <Icon name="user" size={48} />
              </div>
              <div className="font-bold mt-3">
                {[a.user?.firstName, a.user?.lastName].filter(Boolean).join(' ') || 'Agent'}
              </div>
              {a.city?.name && <div className="text-sm text-text-muted mt-0.5 flex items-center gap-1"><Icon name="pin" size={13} />{a.city.name}</div>}
              {a.bio && <div className="text-sm text-text-muted mt-2">{a.bio}</div>}
              {a.phone && (
                <div className="text-sm mt-2 flex items-center gap-2 text-brand-text whitespace-nowrap">
                  <Icon name="phone" size={14} />
                  {a.phone}
                </div>
              )}
              <Link href={`/${locale}/recherche?authorId=${a.user?.id}`} className="mt-3 h-9 w-full flex items-center justify-center border border-border text-sm font-semibold text-text hover:bg-surface-2">
                {t('viewListings')}
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
