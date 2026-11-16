'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { apiLogin } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { CaptchaField } from '@/components/captcha-field';

export default function ConnexionPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await apiLogin(email, password);
      setToken(r.accessToken);
      router.push(`/${locale}/favoris`);
    } catch {
      setError(t('error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="bg-pattern min-h-[70vh] py-10 px-4">
      <div className="max-w-sm mx-auto">
        <h1 className="text-xl font-semibold tracking-tight">{t('title')}</h1>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
          <label className="text-sm">
            {t('email')}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 border border-border px-3 mt-1 bg-surface"
            />
          </label>
          <label className="text-sm">
            {t('password')}
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 border border-border px-3 mt-1 bg-surface"
            />
          </label>
          {error && <p className="text-danger text-sm">{error}</p>}
          <CaptchaField onValidChange={setCaptchaValid} />
          <button
            type="submit"
            disabled={busy || !captchaValid}
            className="h-10 bg-brand-grad text-onbrand font-semibold disabled:opacity-50"
          >
            {t('submit')}
          </button>
          <p className="text-xs text-text-muted">Démo : admin@lecercle.test / demo1234</p>
        </form>
        <Link href={`/${locale}/inscription`} className="block text-center text-sm text-brand-text font-semibold mt-4">
          Créer un compte
        </Link>
      </div>
    </main>
  );
}
