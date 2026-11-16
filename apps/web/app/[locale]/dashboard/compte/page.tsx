'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { apiMyProfessional, getAuth } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Icon } from '@/components/icons';

export default function ComptePage() {
  const t = useTranslations('dash');
  const pr = useTranslations('profile');
  const locale = useLocale();
  const [me, setMe] = useState<any>(null);
  const [pro, setPro] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.all([getAuth('/auth/me', token), apiMyProfessional(token)]).then(([m, p]) => {
      setMe(m);
      setPro(p);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-text-muted">…</p>;

  const name = [me?.firstName, me?.lastName].filter(Boolean).join(' ') || me?.email;

  return (
    <main className="max-w-2xl">
      <h1 className="text-xl font-semibold tracking-tight">{t('account')}</h1>
      <div className="mt-4 border border-border p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-surface-2 flex items-center justify-center text-text-muted flex-none">
            <Icon name="user" size={32} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-lg">{name}</div>
            <div className="text-sm text-text-muted">{me?.email}</div>
            <div className="text-sm text-text-muted">{me?.role?.slug ?? me?.role}</div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div><span className="text-text-muted">{pr('phone')}: </span>{pro?.agent?.phone ?? '—'}</div>
          <div><span className="text-text-muted">{pr('bio')}: </span>{pro?.agent?.bio ?? '—'}</div>
        </div>
        <Link href={`/${locale}/profil`} className="mt-4 h-10 px-4 border border-border inline-flex items-center font-semibold text-sm">
          {pr('title')}
        </Link>
      </div>
    </main>
  );
}
