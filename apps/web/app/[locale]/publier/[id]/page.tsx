'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { apiUpdateListing, getCategories, getCities, getListing } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function EditAnnoncePage({ params }: { params: { locale: string; id: string } }) {
  const t = useTranslations('publish');
  const locale = useLocale();
  const router = useRouter();
  const [cats, setCats] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [f, setF] = useState({ title: '', description: '', transaction: 'SALE', price: '', typeId: '', cityId: '', surface: '', bedrooms: '', bathrooms: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategories(), getCities(), getListing(params.id)]).then(([c, ci, l]) => {
      setCats(c);
      setCities(ci);
      if (l) {
        setF({
          title: l.title ?? '',
          description: l.description ?? '',
          transaction: l.transaction ?? 'SALE',
          price: String(l.price ?? ''),
          typeId: String(l.typeId ?? ''),
          cityId: String(l.cityId ?? ''),
          surface: l.surface ? String(l.surface) : '',
          bedrooms: l.bedrooms ? String(l.bedrooms) : '',
          bathrooms: l.bathrooms ? String(l.bathrooms) : '',
        });
      }
      setLoading(false);
    });
  }, [params.id]);

  function set(k: string, v: string) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      router.push(`/${locale}/connexion`);
      return;
    }
    const city = cities.find((c) => c.id === Number(f.cityId));
    setBusy(true);
    setError('');
    try {
      await apiUpdateListing(Number(params.id), {
        title: f.title,
        description: f.description,
        transaction: f.transaction,
        price: Number(f.price),
        typeId: Number(f.typeId),
        cityId: Number(f.cityId),
        countryId: city?.countryId,
        regionId: city?.regionId,
        surface: f.surface ? Number(f.surface) : undefined,
        bedrooms: f.bedrooms ? Number(f.bedrooms) : undefined,
        bathrooms: f.bathrooms ? Number(f.bathrooms) : undefined,
      }, token);
      router.push(`/${locale}/dashboard/proprietes`);
    } catch {
      setError(t('error'));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <main className="max-w-xl mx-auto px-4 py-8"><p className="text-text-muted">…</p></main>;
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t('editTitle')}</h1>
      <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
        <label className="text-sm flex flex-col gap-1">
          {t('listingTitle')}
          <input required value={f.title} onChange={(e) => set('title', e.target.value)} className="h-10 border border-border px-3 bg-surface" />
        </label>
        <label className="text-sm flex flex-col gap-1">
          {t('description')}
          <textarea rows={3} value={f.description} onChange={(e) => set('description', e.target.value)} className="border border-border px-3 py-2 bg-surface" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm flex flex-col gap-1">
            {t('transaction')}
            <select value={f.transaction} onChange={(e) => set('transaction', e.target.value)} className="h-10 border border-border px-2 bg-surface">
              <option value="SALE">{t('sale')}</option>
              <option value="RENT">{t('rent')}</option>
            </select>
          </label>
          <label className="text-sm flex flex-col gap-1">
            {t('price')}
            <input required type="number" min={0} value={f.price} onChange={(e) => set('price', e.target.value)} className="h-10 border border-border px-3 bg-surface" />
          </label>
          <label className="text-sm flex flex-col gap-1">
            {t('type')}
            <select required value={f.typeId} onChange={(e) => set('typeId', e.target.value)} className="h-10 border border-border px-2 bg-surface">
              <option value="">—</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="text-sm flex flex-col gap-1">
            {t('city')}
            <select required value={f.cityId} onChange={(e) => set('cityId', e.target.value)} className="h-10 border border-border px-2 bg-surface">
              <option value="">—</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="text-sm flex flex-col gap-1">
            {t('surface')}
            <input type="number" min={0} value={f.surface} onChange={(e) => set('surface', e.target.value)} className="h-10 border border-border px-3 bg-surface" />
          </label>
          <label className="text-sm flex flex-col gap-1">
            {t('bedrooms')}
            <input type="number" min={0} value={f.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} className="h-10 border border-border px-3 bg-surface" />
          </label>
          <label className="text-sm flex flex-col gap-1">
            {t('bathrooms')}
            <input type="number" min={0} value={f.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} className="h-10 border border-border px-3 bg-surface" />
          </label>
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={busy} className="h-11 bg-brand-grad text-onbrand font-semibold">{t('save')}</button>
      </form>
    </main>
  );
}
