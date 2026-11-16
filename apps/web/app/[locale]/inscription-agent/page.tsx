'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { apiRegisterAgent } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function InscriptionAgentPage() {
  const t = useTranslations('professionals');
  const locale = useLocale();
  const router = useRouter();
  const [f, setF] = useState({ firstName: '', lastName: '', phone: '', whatsapp: '', bio: '', licenseNumber: '', cityId: '', agencyId: '' });
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function set(k: string, v: string) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      router.push(`/${locale}/connexion`);
      return;
    }
    setBusy(true);
    setError('');
    try {
      await apiRegisterAgent(
        {
          firstName: f.firstName,
          lastName: f.lastName,
          phone: f.phone,
          whatsapp: f.whatsapp,
          bio: f.bio,
          licenseNumber: f.licenseNumber,
          cityId: f.cityId ? Number(f.cityId) : undefined,
          agencyId: f.agencyId ? Number(f.agencyId) : undefined,
        },
        token,
      );
      setDone(true);
    } catch {
      setError(t('error'));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main className="max-w-sm mx-auto px-4 py-12 text-center">
        <p className="text-success font-semibold">{t('received')}</p>
      </main>
    );
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold tracking-tight">{t('agentTitle')}</h1>
      <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
        <Field label={t('firstName')} value={f.firstName} onChange={(v) => set('firstName', v)} />
        <Field label={t('lastName')} value={f.lastName} onChange={(v) => set('lastName', v)} />
        <Field label={t('phone')} value={f.phone} onChange={(v) => set('phone', v)} />
        <Field label={t('whatsapp')} value={f.whatsapp} onChange={(v) => set('whatsapp', v)} />
        <Field label={t('bio')} value={f.bio} onChange={(v) => set('bio', v)} />
        <Field label={t('license')} value={f.licenseNumber} onChange={(v) => set('licenseNumber', v)} />
        <Field label={t('city')} value={f.cityId} onChange={(v) => set('cityId', v)} type="number" />
        <Field label={t('agency')} value={f.agencyId} onChange={(v) => set('agencyId', v)} type="number" />
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={busy} className="h-10 bg-brand-grad text-onbrand font-semibold">
          {t('submit')}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 border border-border px-3 mt-1 bg-surface"
      />
    </label>
  );
}
