'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { apiCreateLead } from '@/lib/api';
import { CaptchaField } from './captcha-field';
import { LegalConsent } from './legal-consent';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function NewsletterForm() {
  const t = useTranslations('footer');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [legalValid, setLegalValid] = useState(false);

  const emailValid = EMAIL_RE.test(email.trim());
  const canSubmit = emailValid && captchaValid && legalValid && !busy;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    try {
      await apiCreateLead({ name: 'Newsletter', email, message: 'Inscription newsletter', source: 'NEWSLETTER' });
      setDone(true);
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return <p className="text-success text-sm font-semibold">{t('newsletterSuccess')}</p>;
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletterPlaceholder')}
          className={`flex-1 min-w-0 h-10 border px-3 bg-surface text-sm ${
            email && !emailValid ? 'border-danger' : 'border-border'
          }`}
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-10 px-4 bg-brand-grad text-onbrand font-semibold text-sm flex-none disabled:opacity-50"
        >
          {t('newsletterButton')}
        </button>
      </div>
      <CaptchaField onValidChange={setCaptchaValid} />
      <LegalConsent onValidChange={setLegalValid} />
    </form>
  );
}
