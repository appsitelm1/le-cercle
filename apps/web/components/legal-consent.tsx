'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export function LegalConsent({
  required = true,
  onValidChange,
}: {
  required?: boolean;
  onValidChange?: (ok: boolean) => void;
}) {
  const t = useTranslations('legal');
  const locale = useLocale();
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);

  function toggleTerms(v: boolean) {
    setTerms(v);
    onValidChange?.(!required || v);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-start gap-2 text-xs text-text-muted cursor-pointer">
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => toggleTerms(e.target.checked)}
          className="w-4 h-4 mt-0.5"
        />
        <span>
          {t('terms')}{' '}
          <Link href={`/${locale}/cgv`} className="text-brand-text underline">CGV</Link>{' · '}
          <Link href={`/${locale}/confidentialite`} className="text-brand-text underline">{t('privacy')}</Link>{' · '}
          <Link href={`/${locale}/cookies`} className="text-brand-text underline">{t('cookies')}</Link>
        </span>
      </label>
      <label className="flex items-start gap-2 text-xs text-text-muted cursor-pointer">
        <input
          type="checkbox"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
          className="w-4 h-4 mt-0.5"
        />
        <span>{t('marketing')}</span>
      </label>
    </div>
  );
}
