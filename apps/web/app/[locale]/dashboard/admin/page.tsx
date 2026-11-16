'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  apiAdminCreateUser,
  apiAdminDeleteUser,
  apiAdminListings,
  apiAdminSetStatus,
  apiAdminSetUserStatus,
  apiAdminStats,
  apiAdminUpdateUser,
  apiAdminUsers,
  apiGetSettings,
  apiPatchSettings,
} from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Icon } from '@/components/icons';

type Tab = 'stats' | 'listings' | 'users' | 'settings';

export default function AdminPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const [tab, setTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [userFilter, setUserFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editF, setEditF] = useState({ firstName: '', lastName: '', email: '' });
  const [newUser, setNewUser] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'AGENT' });
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthed(true);
    const [s, l, u, cfg] = await Promise.all([
      apiAdminStats(token).catch(() => null),
      apiAdminListings(token, 'PENDING').catch(() => []),
      apiAdminUsers(token).catch(() => []),
      apiGetSettings(token).catch(() => null),
    ]);
    setStats(s);
    setListings(Array.isArray(l) ? l : []);
    setUsers(Array.isArray(u) ? u : []);
    setSettings(cfg);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setListingStatus(id: number, status: string) {
    const token = getToken()!;
    await apiAdminSetStatus(token, id, status);
    await load();
  }

  async function setUserStatus(id: number, status: string) {
    const token = getToken()!;
    await apiAdminSetUserStatus(token, id, status);
    await load();
  }
  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken()!;
    await apiPatchSettings(token, settings ?? {});
    await load();
  }

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken()!;
    await apiAdminCreateUser(token, newUser).catch(() => {});
    setNewUser({ email: '', password: '', firstName: '', lastName: '', role: 'AGENT' });
    await load();
  }

  async function delUser(id: number) {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    const token = getToken()!;
    await apiAdminDeleteUser(token, id).catch(() => {});
    await load();
  }

  function openEdit(u: any) {
    setEditingId(u.id);
    setEditF({ firstName: u.firstName ?? '', lastName: u.lastName ?? '', email: u.email ?? '' });
  }
  async function saveUser(id: number) {
    const token = getToken()!;
    await apiAdminUpdateUser(token, id, editF).catch(() => {});
    setEditingId(null);
    await load();
  }

  if (loading) return <p className="text-text-muted">…</p>;
  if (!authed) {
    return (
      <main>
        <Link href={`/${locale}/connexion`} className="text-brand-text font-semibold">{t('loginToSee')}</Link>
      </main>
    );
  }

  const tabBtn = (k: Tab, label: string) => (
    <button onClick={() => setTab(k)} className={`h-10 px-4 text-sm font-semibold border-b-2 ${tab === k ? 'border-brand text-brand-text' : 'border-transparent text-text-muted'}`}>
      {label}
    </button>
  );

  return (
    <main>
      <h1 className="text-xl font-semibold tracking-tight">{t('title')}</h1>

      <div className="flex gap-1 border-b border-border-soft mt-3 overflow-x-auto">
        {tabBtn('stats', t('stats'))}
        {tabBtn('listings', t('listings'))}
        {tabBtn('users', t('users'))}
        {tabBtn('settings', t('settingsTitle'))}
      </div>

      {tab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            [t('listings'), stats?.listings, 'listings' as Tab, undefined as string | undefined],
            [t('users'), stats?.users, 'users' as Tab, '' as string | undefined],
            [t('agents'), stats?.agents, 'users' as Tab, 'AGENT' as string | undefined],
            [t('agencies'), stats?.agencies, 'users' as Tab, 'AGENCY' as string | undefined],
            [t('developers'), stats?.developers, 'users' as Tab, 'PROMOTER' as string | undefined],
            [t('leads'), stats?.leads, null, undefined],
            [t('payments'), stats?.payments, null, undefined],
            [t('activeSubscriptions'), stats?.activeSubscriptions, null, undefined],
          ].map(([label, v, target, role]) => (
            <button
              key={label as string}
              onClick={() => {
                if (!target) return;
                setTab(target as Tab);
                if (role !== undefined) {
                  setRoleFilter(role);
                  setUserFilter('');
                }
              }}
              className={`border border-border p-4 text-left ${target ? 'hover:bg-surface-2 cursor-pointer' : 'cursor-default'}`}
            >
              <div className="text-2xl font-bold">{v ?? 0}</div>
              <div className="text-xs text-text-muted">{label as string}</div>
            </button>
          ))}
        </div>
      )}

      {tab === 'listings' && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-text-muted">{t('pendingListings')}</h2>
          {listings.length === 0 ? (
            <p className="text-text-muted text-sm mt-2">{t('noPending')}</p>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              {listings.map((l) => (
                <div key={l.id} className="border border-border p-3 flex items-center justify-between gap-2 flex-wrap">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{l.title}</div>
                    <div className="text-xs text-text-muted">{l.ref} · {l.city?.name} · {l.status}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => setListingStatus(l.id, 'PUBLISHED')} className="h-8 px-3 border border-success text-success text-xs font-semibold">
                      {t('publish')}
                    </button>
                    <button onClick={() => setListingStatus(l.id, 'REJECTED')} className="h-8 px-3 border border-danger text-danger text-xs font-semibold">
                      {t('reject')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="mt-4 flex flex-col gap-4">
          <form onSubmit={addUser} className="border border-border p-4 grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
            <input required value={newUser.email} onChange={(e) => setNewUser((s) => ({ ...s, email: e.target.value }))} placeholder="email" className="h-10 border border-border px-3 bg-surface" />
            <input required value={newUser.password} onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))} placeholder="mot de passe" className="h-10 border border-border px-3 bg-surface" />
            <input value={newUser.firstName} onChange={(e) => setNewUser((s) => ({ ...s, firstName: e.target.value }))} placeholder="prénom" className="h-10 border border-border px-3 bg-surface" />
            <input value={newUser.lastName} onChange={(e) => setNewUser((s) => ({ ...s, lastName: e.target.value }))} placeholder="nom" className="h-10 border border-border px-3 bg-surface" />
            <select value={newUser.role} onChange={(e) => setNewUser((s) => ({ ...s, role: e.target.value }))} className="h-10 border border-border px-2 bg-surface">
              {['AGENT', 'AGENCY', 'PROMOTER', 'ADMIN', 'ASSISTANT', 'USER'].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <button type="submit" className="h-10 bg-brand-grad text-onbrand font-semibold">Ajouter</button>
          </form>

          <div className="flex gap-2 flex-wrap">
            <input
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="Filtrer (nom, email)…"
              className="h-10 border border-border px-3 bg-surface max-w-xs"
            />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-10 border border-border px-2 bg-surface">
              <option value="">Tous les rôles</option>
              {['AGENT', 'AGENCY', 'PROMOTER', 'ADMIN', 'ASSISTANT', 'USER', 'OWNER'].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            {users
              .filter((u) => {
                const q = userFilter.toLowerCase();
                const role = u.role?.slug ?? u.role?.name ?? '';
                if (roleFilter && role !== roleFilter) return false;
                const hay = [u.firstName, u.lastName, u.email, role].join(' ').toLowerCase();
                return !q || hay.includes(q);
              })
              .map((u) => (
                <div key={u.id} className="border border-border">
                  <div className="p-3 flex items-center justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm">{[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email}</div>
                      <div className="text-xs text-text-muted">{u.email} · {u.role?.slug ?? u.role?.name} · {u.status}</div>
                    </div>
                    <div className="flex gap-1.5">
                      <Link href={`/${locale}/dashboard/admin/utilisateur/${u.id}`} className="h-8 px-3 border border-border text-xs font-semibold inline-flex items-center">Profil</Link>
                      {u.status !== 'ACTIVE' && (
                        <button onClick={() => setUserStatus(u.id, 'ACTIVE')} className="h-8 px-3 border border-success text-success text-xs font-semibold">Activer</button>
                      )}
                      {u.status === 'ACTIVE' && (
                        <button onClick={() => setUserStatus(u.id, 'SUSPENDED')} className="h-8 px-3 border border-warning text-warning text-xs font-semibold">Suspendre</button>
                      )}
                      <button onClick={() => delUser(u.id)} className="h-8 px-3 border border-danger text-danger text-xs font-semibold">Supprimer</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <form onSubmit={saveSettings} className="mt-4 max-w-md flex flex-col gap-3">
          <label className="text-sm flex flex-col gap-1">
            {t('brandName')}
            <input value={settings?.brandName ?? ''} onChange={(e) => setSettings((s: any) => ({ ...s, brandName: e.target.value }))} className="h-10 border border-border px-3 bg-surface" />
          </label>
          <label className="text-sm flex flex-col gap-1">
            {t('agentPrice')}
            <input type="number" value={settings?.agentPrice ?? ''} onChange={(e) => setSettings((s: any) => ({ ...s, agentPrice: Number(e.target.value) }))} className="h-10 border border-border px-3 bg-surface" />
          </label>
          <label className="text-sm flex flex-col gap-1">
            {t('agencyPrice')}
            <input type="number" value={settings?.agencyPrice ?? ''} onChange={(e) => setSettings((s: any) => ({ ...s, agencyPrice: Number(e.target.value) }))} className="h-10 border border-border px-3 bg-surface" />
          </label>
          <label className="text-sm flex flex-col gap-1">
            {t('developerPrice')}
            <input type="number" value={settings?.developerPrice ?? ''} onChange={(e) => setSettings((s: any) => ({ ...s, developerPrice: Number(e.target.value) }))} className="h-10 border border-border px-3 bg-surface" />
          </label>
          <button type="submit" className="h-11 bg-brand-grad text-onbrand font-semibold">{t('save')}</button>
        </form>
      )}
    </main>
  );
}
