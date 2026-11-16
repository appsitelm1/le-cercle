'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { apiAdminDeleteUser, apiAdminSetUserStatus, apiAdminUpdateUser, apiAdminUser } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Icon } from '@/components/icons';

export default function UserProfilePage({ params }: { params: { locale: string; id: string } }) {
  const t = useTranslations('admin');
  const locale = useLocale();
  const router = useRouter();
  const [u, setU] = useState<any>(null);
  const [f, setF] = useState({ firstName: '', lastName: '', email: '' });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    const d = await apiAdminUser(token, Number(params.id)).catch(() => null);
    if (d) {
      setU(d);
      setF({ firstName: d.firstName ?? '', lastName: d.lastName ?? '', email: d.email ?? '' });
    }
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    const token = getToken()!;
    await apiAdminUpdateUser(token, Number(params.id), f).catch(() => {});
    await load();
  }
  async function setStatus(status: string) {
    const token = getToken()!;
    await apiAdminSetUserStatus(token, Number(params.id), status).catch(() => {});
    await load();
  }
  async function del() {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    const token = getToken()!;
    await apiAdminDeleteUser(token, Number(params.id)).catch(() => {});
    router.push(`/${locale}/dashboard/admin`);
  }

  if (loading) return <main><p className="text-text-muted">…</p></main>;
  if (!u) return <main><p className="text-text-muted">Utilisateur introuvable.</p></main>;

  const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email;

  return (
    <main className="max-w-2xl">
      <Link href={`/${locale}/dashboard/admin`} className="text-sm text-brand-text font-semibold">← {t('title')}</Link>
      <h1 className="text-xl font-semibold tracking-tight mt-2">{name}</h1>

      <div className="mt-4 border border-border p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-surface-2 flex items-center justify-center text-text-muted flex-none">
            <Icon name="user" size={32} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-lg">{name}</div>
            <div className="text-sm text-text-muted">{u.email}</div>
            <div className="text-sm text-text-muted">{u.role?.slug ?? u.role?.name} · {u.status}</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input value={f.firstName} onChange={(e) => setF((s) => ({ ...s, firstName: e.target.value }))} placeholder="Prénom" className="h-9 border border-border px-2 bg-surface" />
          <input value={f.lastName} onChange={(e) => setF((s) => ({ ...s, lastName: e.target.value }))} placeholder="Nom" className="h-9 border border-border px-2 bg-surface" />
          <input value={f.email} onChange={(e) => setF((s) => ({ ...s, email: e.target.value }))} placeholder="Email" className="h-9 border border-border px-2 bg-surface" />
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          <button onClick={save} className="h-9 px-4 bg-brand-grad text-onbrand text-xs font-semibold">Enregistrer</button>
          {u.status !== 'ACTIVE' ? (
            <button onClick={() => setStatus('ACTIVE')} className="h-9 px-4 border border-success text-success text-xs font-semibold">Activer</button>
          ) : (
            <button onClick={() => setStatus('SUSPENDED')} className="h-9 px-4 border border-warning text-warning text-xs font-semibold">Suspendre</button>
          )}
          <button onClick={del} className="h-9 px-4 border border-danger text-danger text-xs font-semibold">Supprimer</button>
        </div>

        {u.agent && (
          <div className="mt-5 border-t border-border-soft pt-4">
            <h2 className="font-semibold text-sm">Agent</h2>
            <div className="text-sm text-text-muted mt-1">{u.agent.bio}</div>
            <div className="text-sm text-text-muted">{u.agent.phone} · {u.agent.city?.name} · {u.agent.status}</div>
          </div>
        )}
        {(u.agencies ?? []).map((a: any) => (
          <div key={a.id} className="mt-3 border-t border-border-soft pt-3">
            <h2 className="font-semibold text-sm">Agence : {a.name}</h2>
            <div className="text-sm text-text-muted">{a.phone} · {a.city?.name} · {a.status}</div>
          </div>
        ))}
        {(u.developers ?? []).map((d: any) => (
          <div key={d.id} className="mt-3 border-t border-border-soft pt-3">
            <h2 className="font-semibold text-sm">Promoteur : {d.name}</h2>
            <div className="text-sm text-text-muted">{d.phone} · {d.city?.name} · {d.status}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
