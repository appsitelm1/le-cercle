'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { apiAcceptContract, apiDeleteListing, apiDuplicateListing, apiMyListings, apiMyProfessional, apiPay } from '@/lib/api';
import { getToken } from '@/lib/auth';

type Item = {
  key: string;
  label: string;
  status: string;
  contract?: { id: number; status: string } | null;
  subscription?: { id: number; status: string; endDate?: string | null } | null;
};

export default function EspaceProPage() {
  const t = useTranslations('professionals');
  const pt = useTranslations('publish');
  const pf = useTranslations('profile');
  const locale = useLocale();
  const [items, setItems] = useState<Item[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthed(true);
    const [d, mine] = await Promise.all([apiMyProfessional(token), apiMyListings(token)]);
    setMyListings(mine);
    const list: Item[] = [];
    if (d.agent) {
      list.push({
        key: 'agent',
        label: t('becomeAgent'),
        status: d.agent.status,
        contract: d.agent.contract,
        subscription: d.agent.subscription,
      });
    }
    (d.agencies ?? []).forEach((a: any) =>
      list.push({ key: `agency-${a.id}`, label: a.name, status: a.status, contract: a.contract, subscription: a.subscription }),
    );
    (d.developers ?? []).forEach((x: any) =>
      list.push({ key: `dev-${x.id}`, label: x.name, status: x.status, contract: x.contract, subscription: x.subscription }),
    );
    setItems(list);
    setLoading(false);
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  async function accept(id: number) {
    const token = getToken()!;
    await apiAcceptContract(id, token);
    await load();
  }
  async function pay(id: number) {
    const token = getToken()!;
    await apiPay(id, token);
    await load();
  }
  async function duplicate(id: number) {
    const token = getToken()!;
    await apiDuplicateListing(id, token);
    await load();
  }
  async function remove(id: number) {
    if (!window.confirm(pt('confirmDelete'))) return;
    const token = getToken()!;
    await apiDeleteListing(id, token);
    await load();
  }

  if (loading) {
    return (
      <main className="max-w-[760px] mx-auto px-4 py-10">
        <p className="text-text-muted">…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="max-w-[760px] mx-auto px-4 py-10">
        <Link href={`/${locale}/connexion`} className="text-brand-text font-semibold">
          {t('loginToSee')}
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[760px] mx-auto px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{t('dashboard')}</h1>
        <Link href={`/${locale}/profil`} className="text-sm text-brand-text font-semibold">{pf('title')}</Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-5 border border-border p-5 flex flex-col gap-3">
          <p className="text-text-muted">{t('noProfessional')}</p>
          <div className="flex gap-2">
            <Link href={`/${locale}/inscription-agent`} className="h-10 px-4 bg-brand-grad text-onbrand font-semibold inline-flex items-center">
              {t('becomeAgent')}
            </Link>
            <Link href={`/${locale}/inscription-agence`} className="h-10 px-4 border border-border font-semibold inline-flex items-center">
              {t('becomeAgency')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          {items.map((it) => (
            <div key={it.key} className="border border-border p-4">
              <div className="font-semibold">{it.label}</div>
              <StatusLine it={it} t={t} />
              {it.contract?.status === 'SENT' && (
                <button onClick={() => accept(it.contract!.id)} className="mt-3 h-10 px-4 bg-brand-grad text-onbrand font-semibold">
                  {t('acceptContract')}
                </button>
              )}
              {it.subscription?.status === 'PENDING_PAYMENT' && (
                <button onClick={() => pay(it.subscription!.id)} className="mt-3 h-10 px-4 bg-brand-grad text-onbrand font-semibold">
                  {t('payActivate')}
                </button>
              )}
              {it.status === 'ACTIVE' && it.subscription?.endDate && (
                <p className="text-sm text-text-muted mt-2">
                  {t('expiration')} : {new Date(it.subscription.endDate).toLocaleDateString(locale)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mes annonces */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{pt('myListings')}</h2>
        <Link href={`/${locale}/publier`} className="h-10 px-4 bg-brand-grad text-onbrand font-semibold inline-flex items-center">
          {pt('publishButton')}
        </Link>
      </div>
      {myListings.length === 0 ? (
        <p className="text-text-muted text-sm mt-3">{pt('noListings')}</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {myListings.map((l) => (
            <div key={l.id} className="border border-border p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{l.title}</div>
                <div className="text-xs text-text-muted">{l.ref} · {l.city?.name} · {pt('status')}: {l.status}</div>
              </div>
              <div className="flex gap-1 flex-none">
                <Link href={`/${locale}/publier/${l.id}`} className="h-8 px-2.5 border border-border inline-flex items-center text-xs font-semibold hover:bg-surface-2">
                  {pt('edit')}
                </Link>
                <button onClick={() => duplicate(l.id)} className="h-8 px-2.5 border border-border inline-flex items-center text-xs font-semibold hover:bg-surface-2">
                  {pt('duplicate')}
                </button>
                <button onClick={() => remove(l.id)} className="h-8 px-2.5 border border-danger text-danger inline-flex items-center text-xs font-semibold hover:bg-surface-2">
                  {pt('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function StatusLine({ it, t }: { it: Item; t: (k: string) => string }) {
  if (it.status === 'ACTIVE') {
    return <p className="text-success font-semibold mt-1">{t('statusActive')}</p>;
  }
  if (it.status === 'PAYMENT_RECEIVED' || it.status === 'VERIFYING') {
    return <p className="text-info font-semibold mt-1">{t('validating')}</p>;
  }
  return <p className="text-warning font-semibold mt-1">{t('statusIncomplete')}</p>;
}
