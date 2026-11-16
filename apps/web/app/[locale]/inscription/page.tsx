'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { apiRegisterPro, getCities } from '@/lib/api';
import { CaptchaField } from '@/components/captcha-field';
import { LegalConsent } from '@/components/legal-consent';

export default function InscriptionPage() {
  const t = useTranslations('professionals');
  const locale = useLocale();
  const [role, setRole] = useState('USER');
  const [f, setF] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', whatsapp: '', bio: '', licenseNumber: '', name: '', website: '', description: '', cityId: '' });
  const [cities, setCities] = useState<any[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [legalValid, setLegalValid] = useState(false);

  useEffect(() => {
    getCities().then(setCities);
  }, []);

  function set(k: string, v: string) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await apiRegisterPro({
        role,
        email: f.email,
        password: f.password,
        firstName: f.firstName,
        lastName: f.lastName,
        phone: f.phone,
        whatsapp: f.whatsapp,
        bio: f.bio,
        licenseNumber: f.licenseNumber,
        name: f.name,
        website: f.website,
        description: f.description,
        cityId: f.cityId ? Number(f.cityId) : undefined,
      });
      setDone(true);
    } catch {
      setError(t('error'));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main className="max-w-md mx-auto px-4 py-12 text-center">
        <p className="text-success font-semibold">{t('received')}</p>
        <p className="text-sm text-text-muted mt-2">{t('pendingMessage')}</p>
      </main>
    );
  }

  return (
    <main className="bg-pattern min-h-[70vh] py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-semibold tracking-tight">{t('createAccount')}</h1>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['USER', 'OWNER', 'AGENT', 'AGENCY', 'PROMOTER'] as const).map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              className={`h-10 border text-sm font-semibold ${role === r ? 'bg-brand text-onbrand border-brand' : 'border-border-soft text-text-muted'}`}
            >
              {r === 'AGENT' ? t('agent') : r === 'AGENCY' ? t('agencyLabel') : r === 'PROMOTER' ? t('promoter') : r === 'OWNER' ? t('seller') : t('buyer')}
            </button>
          ))}
        </div>

        <Field label={t('email')} value={f.email} onChange={(v) => set('email', v)} type="email" />
        <Field label={t('password')} value={f.password} onChange={(v) => set('password', v)} type="password" />
        <Field label={t('firstName')} value={f.firstName} onChange={(v) => set('firstName', v)} />
        <Field label={t('lastName')} value={f.lastName} onChange={(v) => set('lastName', v)} />
        <Field label={t('phone')} value={f.phone} onChange={(v) => set('phone', v)} />

        {role === 'AGENT' && (
          <>
            <Field label={t('whatsapp')} value={f.whatsapp} onChange={(v) => set('whatsapp', v)} />
            <Field label={t('bio')} value={f.bio} onChange={(v) => set('bio', v)} />
            <Field label={t('license')} value={f.licenseNumber} onChange={(v) => set('licenseNumber', v)} />
          </>
        )}
        {(role === 'AGENCY' || role === 'PROMOTER') && (
          <>
            <Field label={t('companyName')} value={f.name} onChange={(v) => set('name', v)} />
            <Field label={t('website')} value={f.website} onChange={(v) => set('website', v)} />
            <Field label={t('description')} value={f.description} onChange={(v) => set('description', v)} />
          </>
        )}

        <label className="text-sm flex flex-col gap-1">
          {t('city')}
          <select value={f.cityId} onChange={(e) => set('cityId', e.target.value)} className="h-10 border border-border px-2 bg-surface">
            <option value="">—</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>

        {error && <p className="text-danger text-sm">{error}</p>}
        <CaptchaField onValidChange={setCaptchaValid} />
        <LegalConsent onValidChange={setLegalValid} />
        <button type="submit" disabled={busy || !captchaValid || !legalValid} className="h-11 bg-brand-grad text-onbrand font-semibold disabled:opacity-50">
          {t('createAccount')}
        </button>
      </form>

        <p className="text-sm text-text-muted mt-4">
          Déjà un compte ?{' '}
          <Link href={`/${locale}/connexion`} className="text-brand-text font-semibold">Connexion</Link>
        </p>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="text-sm">
      {label}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10 border border-border px-3 mt-1 bg-surface" />
    </label>
  );
}
