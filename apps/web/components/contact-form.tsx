'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { apiCreateLead } from '@/lib/api';
import { CaptchaField } from './captcha-field';
import { LegalConsent } from './legal-consent';

export function ContactForm({ listingId }: { listingId: number }) {
  const t = useTranslations('contact');
  const [f, setF] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [legalValid, setLegalValid] = useState(false);

  function set(k: string, v: string) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await apiCreateLead({
        listingId,
        name: f.name,
        email: f.email,
        phone: f.phone,
        message: f.message,
        source: 'FORM',
      });
      setSent(true);
    } catch {
      setError(t('error'));
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return <p className="text-success font-semibold text-sm">{t('sent')}</p>;
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 text-sm">
      <h3 className="font-semibold">{t('title')}</h3>
      <input required placeholder={t('name')} value={f.name} onChange={(e) => set('name', e.target.value)} className="h-10 border border-border px-3 bg-surface" />
      <input type="email" placeholder={t('email')} value={f.email} onChange={(e) => set('email', e.target.value)} className="h-10 border border-border px-3 bg-surface" />
      <input placeholder={t('phone')} value={f.phone} onChange={(e) => set('phone', e.target.value)} className="h-10 border border-border px-3 bg-surface" />
      <textarea required rows={3} placeholder={t('message')} value={f.message} onChange={(e) => set('message', e.target.value)} className="border border-border px-3 py-2 bg-surface" />
      {error && <p className="text-danger text-xs">{error}</p>}
      <CaptchaField onValidChange={setCaptchaValid} />
      <LegalConsent onValidChange={setLegalValid} />
      <button type="submit" disabled={busy || !captchaValid || !legalValid} className="h-10 bg-brand-grad text-onbrand font-semibold disabled:opacity-50">
        {t('send')}
      </button>
    </form>
  );
}
