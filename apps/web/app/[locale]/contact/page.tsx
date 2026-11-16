'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { apiCreateLead } from '@/lib/api';
import { Icon } from '@/components/icons';
import { CaptchaField } from '@/components/captcha-field';
import { LegalConsent } from '@/components/legal-consent';

export default function ContactPage() {
  const t = useTranslations('nav');
  const [f, setF] = useState({ name: '', email: '', phone: '', role: 'Acheteur', subject: 'Vente', message: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [legalValid, setLegalValid] = useState(false);

  function set(k: string, v: string) {
    setF((s) => ({ ...s, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const msg = `[Je suis : ${f.role}] [Objet : ${f.subject}]\n${f.message}`;
      await apiCreateLead({ name: f.name, email: f.email, phone: f.phone, message: msg });
      setSent(true);
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  const infoRow = 'flex items-start gap-3';
  const infoIcon = 'w-10 h-10 border border-border flex items-center justify-center text-brand-text flex-none';

  return (
    <main className="mx-auto px-4 md:px-6 py-10 max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight">{t('contact')}</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Colonne contact */}
        <div className="border border-border p-6">
          <h2 className="font-bold tracking-tight uppercase text-lg">LE CERCLE IMMOBILIER</h2>
          <div className="mt-5 flex flex-col gap-4">
            <div className={infoRow}>
              <span className={infoIcon}><Icon name="pin" size={18} /></span>
              <div>
                <div className="text-xs text-text-muted font-semibold uppercase">Adresse</div>
                <div className="text-sm mt-0.5">12 Rue des Oulémas, Casablanca, Maroc</div>
              </div>
            </div>
            <div className={infoRow}>
              <span className={infoIcon}><Icon name="phone" size={18} /></span>
              <div>
                <div className="text-xs text-text-muted font-semibold uppercase">WhatsApp</div>
                <div className="text-sm mt-0.5">+212 6 00 00 00 00</div>
              </div>
            </div>
            <div className={infoRow}>
              <span className={infoIcon}><Icon name="mail" size={18} /></span>
              <div>
                <div className="text-xs text-text-muted font-semibold uppercase">Email</div>
                <div className="text-sm mt-0.5">contact@lecercle.ma</div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne formulaire */}
        <div className="border border-border p-6">
          {sent ? (
            <p className="text-success font-semibold">Message envoyé. Nous vous répondrons rapidement.</p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <label className="text-sm flex flex-col gap-1">
                Je suis
                <select value={f.role} onChange={(e) => set('role', e.target.value)} className="h-10 border border-border px-2 bg-surface">
                  {['Acheteur', 'Vendeur', 'Agent', 'Agence', 'Promoteur', 'Autre'].map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
              <label className="text-sm flex flex-col gap-1">
                Objet
                <select value={f.subject} onChange={(e) => set('subject', e.target.value)} className="h-10 border border-border px-2 bg-surface">
                  {['Vente', 'Achat', 'Location', 'Estimation', 'Partenariat', 'Autre'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="text-sm flex flex-col gap-1">
                Nom
                <input required value={f.name} onChange={(e) => set('name', e.target.value)} className="h-10 border border-border px-3 bg-surface" />
              </label>
              <label className="text-sm flex flex-col gap-1">
                Email
                <input required type="email" value={f.email} onChange={(e) => set('email', e.target.value)} className="h-10 border border-border px-3 bg-surface" />
              </label>
              <label className="text-sm flex flex-col gap-1">
                Téléphone
                <input value={f.phone} onChange={(e) => set('phone', e.target.value)} className="h-10 border border-border px-3 bg-surface" />
              </label>
              <label className="text-sm flex flex-col gap-1">
                Message
                <textarea required rows={4} value={f.message} onChange={(e) => set('message', e.target.value)} className="border border-border px-3 py-2 bg-surface" />
              </label>
              <CaptchaField onValidChange={setCaptchaValid} />
              <LegalConsent onValidChange={setLegalValid} />
              <button type="submit" disabled={busy || !captchaValid || !legalValid} className="h-11 bg-brand-grad text-onbrand font-semibold disabled:opacity-50">Envoyer</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
