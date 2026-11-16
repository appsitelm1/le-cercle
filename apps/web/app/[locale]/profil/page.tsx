'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { apiMyProfessional, apiUpdateProfile, getAuth } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Icon } from '@/components/icons';

export default function ProfilPage() {
  const t = useTranslations('profile');
  const locale = useLocale();
  const [me, setMe] = useState<any>(null);
  const [agent, setAgent] = useState<any>(null);
  const [f, setF] = useState({ bio: '', phone: '', whatsapp: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthed(true);
    const [u, d] = await Promise.all([getAuth('/auth/me', token), apiMyProfessional(token)]);
    if (u && !Array.isArray(u)) setMe(u);
    if (d.agent) {
      setAgent(d.agent);
      setF({ bio: d.agent.bio ?? '', phone: d.agent.phone ?? '', whatsapp: d.agent.whatsapp ?? '' });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken()!;
    await apiUpdateProfile({ bio: f.bio, phone: f.phone, whatsapp: f.whatsapp }, token);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    await load();
  }

  if (loading) {
    return <main className="max-w-xl mx-auto px-4 py-8"><p className="text-text-muted">…</p></main>;
  }
  if (!authed) {
    return (
      <main className="max-w-xl mx-auto px-4 py-8">
        <Link href={`/${locale}/connexion`} className="text-brand-text font-semibold">{t('loginToSee')}</Link>
      </main>
    );
  }

  const name = [me?.firstName, me?.lastName].filter(Boolean).join(' ') || me?.email || '';

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>

      <div className="mt-5 border border-border p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-surface-2 flex items-center justify-center text-text-muted flex-none">
            <Icon name="user" size={32} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-lg">{name}</div>
            <div className="text-sm text-text-muted">{me?.email}</div>
            <div className="text-sm text-text-muted">{me?.role}</div>
          </div>
        </div>

        {agent && (
          <form onSubmit={save} className="mt-5 flex flex-col gap-3">
            <div className="text-sm text-text-muted">{agent?.city?.name} · {agent?.status}</div>
            <label className="text-sm flex flex-col gap-1">
              {t('bio')}
              <textarea rows={3} value={f.bio} onChange={(e) => setF((p) => ({ ...p, bio: e.target.value }))} className="border border-border px-3 py-2 bg-surface" />
            </label>
            <label className="text-sm flex flex-col gap-1">
              {t('phone')}
              <input value={f.phone} onChange={(e) => setF((p) => ({ ...p, phone: e.target.value }))} className="h-10 border border-border px-3 bg-surface" />
            </label>
            <label className="text-sm flex flex-col gap-1">
              {t('whatsapp')}
              <input value={f.whatsapp} onChange={(e) => setF((p) => ({ ...p, whatsapp: e.target.value }))} className="h-10 border border-border px-3 bg-surface" />
            </label>
            <button type="submit" className="h-11 bg-brand-grad text-onbrand font-semibold">
              {saved ? '✓' : t('save')}
            </button>
          </form>
        )}

        {!agent && (
          <div className="mt-4 flex items-center gap-3">
            <p className="text-text-muted text-sm">{t('noAgent')}</p>
            <Link href={`/${locale}/inscription-agent`} className="inline-flex h-9 px-3 bg-brand-grad text-onbrand font-semibold text-sm items-center">
              {t('becomeAgent')}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
