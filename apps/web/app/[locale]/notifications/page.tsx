'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { apiListNotifications, apiMarkAllRead } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const locale = useLocale();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthed(true);
    setItems(await apiListNotifications(token));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function markAll() {
    const token = getToken()!;
    await apiMarkAllRead(token);
    await load();
  }

  if (loading) {
    return (
      <main className="max-w-[640px] mx-auto px-4 py-10">
        <p className="text-text-muted">…</p>
      </main>
    );
  }
  if (!authed) {
    return (
      <main className="max-w-[640px] mx-auto px-4 py-10">
        <Link href={`/${locale}/connexion`} className="text-brand-text font-semibold">
          {t('loginToSee')}
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[640px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{t('title')}</h1>
        {items.length > 0 && (
          <button onClick={markAll} className="text-sm text-brand-text font-semibold">
            {t('markAll')}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-text-muted mt-4">{t('empty')}</p>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {items.map((n) => (
            <div
              key={n.id}
              className={`border p-3 ${n.readAt ? 'border-border-soft' : 'border-brand bg-brand-tint'}`}
            >
              <div className="font-semibold text-sm">{n.title}</div>
              {n.body && <div className="text-sm text-text-muted mt-0.5">{n.body}</div>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
