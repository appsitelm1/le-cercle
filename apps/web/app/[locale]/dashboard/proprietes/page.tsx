'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  apiDeleteListing,
  apiDuplicateListing,
  apiMyListings,
  apiSetLabels,
  apiSetListingStatus,
  getAuth,
  getLabels,
} from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Icon } from '@/components/icons';

const STATUS_STYLE: Record<string, string> = {
  DRAFT: 'text-text-muted',
  PENDING: 'text-warning',
  PUBLISHED: 'text-success',
  SOLD: 'text-info',
  RENTED: 'text-info',
  PAUSED: 'text-warning',
  REJECTED: 'text-danger',
  EXPIRED: 'text-text-muted',
};

function labelName(l: any, locale: string) {
  if (!l) return '';
  return l[`name${locale === 'ar' ? 'Ar' : locale === 'en' ? 'En' : locale === 'es' ? 'Es' : 'Fr'}`] ?? l.nameFr;
}

export default function ProprietesPage() {
  const t = useTranslations('dash');
  const pt = useTranslations('publish');
  const locale = useLocale();
  const [items, setItems] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    const [mine, me, lbls] = await Promise.all([apiMyListings(token), getAuth('/auth/me', token), getLabels()]);
    setItems(mine);
    setLabels(lbls);
    setIsAdmin(me?.role?.slug === 'ADMIN' || me?.role === 'ADMIN');
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(fn: () => Promise<any>) {
    try {
      await fn();
    } catch {}
    await load();
  }

  function setStatus(id: number, status: string, featured?: boolean) {
    const token = getToken()!;
    act(() => apiSetListingStatus(id, status, featured, token));
  }

  async function toggleLabel(id: number, labelId: number, current: number[]) {
    const next = current.includes(labelId) ? current.filter((x) => x !== labelId) : [...current, labelId];
    const token = getToken()!;
    await act(() => apiSetLabels(id, next, token));
  }

  async function del(id: number) {
    if (!window.confirm(pt('confirmDelete'))) return;
    const token = getToken()!;
    await act(() => apiDeleteListing(id, token));
  }

  function toggleSelect(id: number) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  function selectAll() {
    setSelected(selected.length === items.length ? [] : items.map((l) => l.id));
  }
  function exportData(format: 'csv' | 'excel' | 'pdf') {
    const rows = items.filter((l) => selected.includes(l.id));
    if (rows.length === 0) return;
    if (format === 'pdf') {
      const html = `<html><head><meta charset="utf-8"><title>Annonces</title></head><body><h1>Annonces</h1><table border="1" cellspacing="0" cellpadding="6"><tr><th>Réf</th><th>Titre</th><th>Catégorie</th><th>Description</th><th>Statut</th><th>Ville</th><th>Prix</th><th>Vues</th><th>Images</th></tr>${rows.map((l) => `<tr><td>${l.ref}</td><td>${l.title}</td><td>${l.type?.name ?? ''}</td><td>${l.description ?? ''}</td><td>${l.status}</td><td>${l.city?.name ?? ''}</td><td>${l.price} ${l.currencyCode}</td><td>${l.views ?? 0}</td><td>${(l.images ?? []).map((im: any) => im.url).join('<br>')}</td></tr>`).join('')}</table><script>window.print()</script></body></html>`;
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(html);
        w.document.close();
      }
      return;
    }
    const headers = ['Réf', 'Titre', 'Catégorie', 'Description', 'Statut', 'Ville', 'Prix', 'Vues', 'Images', 'Étiquettes'];
    const lines = [headers.join(';')];
    for (const l of rows) {
      const images = (l.images ?? []).map((im: any) => im.url).join(' | ');
      lines.push([
        l.ref,
        `"${(l.title ?? '').replace(/"/g, '""')}"`,
        `"${(l.type?.name ?? '').replace(/"/g, '""')}"`,
        `"${(l.description ?? '').replace(/"/g, '""')}"`,
        l.status,
        l.city?.name ?? '',
        l.price,
        l.views ?? 0,
        `"${images.replace(/"/g, '""')}"`,
        (l.labels ?? []).map((x: any) => x.label?.slug).join(' '),
      ].join(';'));
    }
    const csv = lines.join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `annonces.${format === 'excel' ? 'xls' : 'csv'}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p className="text-text-muted">…</p>;

  const item = 'flex items-center gap-2 px-3 py-2 text-sm font-semibold hover:bg-surface-2';

  return (
    <main>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-xl font-semibold tracking-tight">{t('properties')}</h1>
        <div className="flex items-center gap-1.5 flex-wrap">
          <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
            <input type="checkbox" checked={selected.length === items.length && items.length > 0} onChange={selectAll} className="w-4 h-4" />
            Tout
          </label>
          <button onClick={() => exportData('csv')} className="h-9 px-3 border border-border text-xs font-semibold hover:bg-surface-2">Export CSV</button>
          <button onClick={() => exportData('excel')} className="h-9 px-3 border border-border text-xs font-semibold hover:bg-surface-2">Export Excel</button>
          <button onClick={() => exportData('pdf')} className="h-9 px-3 border border-border text-xs font-semibold hover:bg-surface-2">Export PDF</button>
          <Link href={`/${locale}/publier`} className="h-9 px-4 bg-brand-grad text-onbrand font-semibold inline-flex items-center gap-2">
            <Icon name="plus" size={16} />
            {pt('publishButton')}
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-text-muted text-sm mt-4">{t('noListings')}</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {items.map((l) => {
            const currentLabels: number[] = (l.labels ?? []).map((x: any) => x.labelId);
            return (
              <div key={l.id} className="border border-border p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex items-start gap-2">
                    <input type="checkbox" checked={selected.includes(l.id)} onChange={() => toggleSelect(l.id)} className="w-4 h-4 mt-0.5 flex-none" />
                    <div className="min-w-0">
                      <div className="font-semibold">{l.title}</div>
                      <div className="text-xs text-text-muted mt-0.5">
                        {l.ref} · {l.city?.name} · {l.views ?? 0} {t('viewsLabel')} ·{' '}
                        <span className={STATUS_STYLE[l.status] ?? ''}>{l.status}</span>
                        {l.featured && <span className="text-brand-text"> · ★</span>}
                      </div>
                      {(l.labels ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {(l.labels ?? []).map((x: any) => (
                            <span key={x.labelId} className="text-[11px] font-semibold px-2 py-0.5 bg-brand-tint text-brand-text">
                              {labelName(x.label, locale)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-none flex-wrap">
                    {/* Actions */}
                    <details className="relative group">
                      <summary className="h-8 px-3 border border-border inline-flex items-center gap-1 text-xs font-semibold cursor-pointer list-none hover:bg-surface-2">
                        <Icon name="settings" size={14} />
                        {t('actions')}
                      </summary>
                      <div className="absolute right-0 top-full mt-1 z-30 bg-surface border border-border shadow-1 py-1 min-w-[200px]">
                        <Link href={`/${locale}/bien/${l.id}`} className={item}>
                          <Icon name="eye" size={15} /> {t('view')}
                        </Link>
                        <Link href={`/${locale}/publier/${l.id}`} className={item}>
                          <Icon name="edit" size={15} /> {pt('edit')}
                        </Link>
                        <button onClick={() => act(() => apiDuplicateListing(l.id, getToken()!))} className={`${item} w-full`}>
                          <Icon name="copy" size={15} /> {pt('duplicate')}
                        </button>
                        <button onClick={() => setStatus(l.id, 'PAUSED')} className={`${item} w-full`}>
                          <Icon name="pause" size={15} /> {t('pause')}
                        </button>
                        <button onClick={() => setStatus(l.id, 'EXPIRED')} className={`${item} w-full`}>
                          <Icon name="clock" size={15} /> {t('expire')}
                        </button>
                        <button onClick={() => setStatus(l.id, l.status, !l.featured)} className={`${item} w-full`}>
                          <Icon name="star" size={15} /> {l.featured ? t('unmarkFeatured') : t('markFeatured')}
                        </button>
                        {isAdmin && (
                          <>
                            <button onClick={() => setStatus(l.id, 'PUBLISHED')} className={`${item} w-full text-success`}>
                              <Icon name="check" size={15} /> {t('publish')}
                            </button>
                            <button onClick={() => setStatus(l.id, 'REJECTED')} className={`${item} w-full text-danger`}>
                              <Icon name="ban" size={15} /> {t('reject')}
                            </button>
                          </>
                        )}
                        <button onClick={() => del(l.id)} className={`${item} w-full text-danger`}>
                          <Icon name="trash" size={15} /> {pt('delete')}
                        </button>
                      </div>
                    </details>

                    {/* Étiquette */}
                    <details className="relative group">
                      <summary className="h-8 px-3 border border-border inline-flex items-center gap-1 text-xs font-semibold cursor-pointer list-none hover:bg-surface-2">
                        <Icon name="award" size={14} />
                        {t('label')}
                      </summary>
                      <div className="absolute right-0 top-full mt-1 z-30 bg-surface border border-border shadow-1 py-1 min-w-[200px]">
                        {labels.map((lb) => {
                          const checked = currentLabels.includes(lb.id);
                          return (
                            <button key={lb.id} onClick={() => toggleLabel(l.id, lb.id, currentLabels)} className={`${item} w-full justify-between`}>
                              <span className="flex items-center gap-2">
                                <span className={`w-4 h-4 border ${checked ? 'bg-brand border-brand' : 'border-border-soft'} flex items-center justify-center text-onbrand text-[10px]`}>
                                  {checked ? '✓' : ''}
                                </span>
                                {labelName(lb, locale)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
