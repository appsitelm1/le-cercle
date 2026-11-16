'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { apiRegisterAgency } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function InscriptionAgencePage() {
  const t = useTranslations('professionals');
  const locale = useLocale();
  const router = useRouter();
  const [f, setF] = useState({ name: '', email: '', phone: '', whatsapp: '', website: '', address: '', cityId: '', description: '' });
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
      await apiRegisterAgency(
        {
          name: f.name,
          email: f.email,
          phone: f.phone,
          whatsapp: f.whatsapp,
          website: f.website,
          address: f.address,
          cityId: f.cityId ? Number(f.cityId) : undefined,
          description: f.description,
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
      <h1 className="text-xl font-semibold tracking-tight">{t('agencyTitle')}</h1>
      <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
        <Field label={t('name')} value={f.name} onChange={(v) => set('name', v)} required />
        <Field label={t('email')} value={f.email} onChange={(v) => set('email', v)} type="email" />
        <Field label={t('phone')} value={f.phone} onChange={(v) => set('phone', v)} />
        <Field label={t('whatsapp')} value={f.whatsapp} onChange={(v) => set('whatsapp', v)} />
        <Field label={t('website')} value={f.website} onChange={(v) => set('website', v)} />
        <Field label={t('address')} value={f.address} onChange={(v) => set('address', v)} />
        <Field label={t('city')} value={f.cityId} onChange={(v) => set('cityId', v)} type="number" />
        <Field label={t('description')} value={f.description} onChange={(v) => set('description', v)} />
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
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 border border-border px-3 mt-1 bg-surface"
      />
    </label>
  );
}
