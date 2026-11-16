'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { apiCreateListing, apiUploadMedia, getCategories, getCities, getCountries, getLabels } from '@/lib/api';
import { getToken } from '@/lib/auth';

function labelName(l: any, locale: string) {
  if (!l) return '';
  return l[`name${locale === 'ar' ? 'Ar' : locale === 'en' ? 'En' : locale === 'es' ? 'Es' : 'Fr'}`] ?? l.nameFr;
}

export default function PublierPage() {
  const t = useTranslations('publish');
  const locale = useLocale();
  const router = useRouter();
  const [cats, setCats] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [f, setF] = useState({ title: '', description: '', transaction: 'SALE', price: '', typeId: '', countryId: '', cityId: '', surface: '', bedrooms: '', bathrooms: '', videoUrl: '' });
  const [labelIds, setLabelIds] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/${locale}/connexion`);
      return;
    }
    Promise.all([getCategories(), getCities(), getCountries(), getLabels()]).then(([c, ci, co, lb]) => {
      setCats(c);
      setCities(ci);
      setCountries(co);
      setLabels(lb);
    });
  }, []);

  function set(k: string, v: string) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  function toggleLabel(id: number) {
    setLabelIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      router.push(`/${locale}/connexion`);
      return;
    }
    setBusy(true);
    setError('');
    try {
      // uploader les photos
      const images: { url: string }[] = [];
      for (const file of files) {
        const up = await apiUploadMedia(file, token);
        images.push({ url: up.url });
      }
      const city = cities.find((c) => c.id === Number(f.cityId));
      await apiCreateListing(
        {
          title: f.title,
          description: f.description,
          transaction: f.transaction,
          price: Number(f.price),
          typeId: Number(f.typeId),
          countryId: Number(f.countryId) || city?.countryId || 1,
          regionId: city?.regionId ?? 1,
          cityId: Number(f.cityId),
          surface: f.surface ? Number(f.surface) : undefined,
          bedrooms: f.bedrooms ? Number(f.bedrooms) : undefined,
          bathrooms: f.bathrooms ? Number(f.bathrooms) : undefined,
          videoUrl: f.videoUrl || undefined,
          labelIds,
          images,
        },
        token,
      );
      router.push(`/${locale}/dashboard/proprietes`);
    } catch {
      setError(t('error'));
    } finally {
      setBusy(false);
    }
  }

  const cityList = f.countryId ? cities.filter((c) => c.countryId === Number(f.countryId)) : cities;

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
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
            {t('country')}
            <select value={f.countryId} onChange={(e) => { set('countryId', e.target.value); set('cityId', ''); }} className="h-10 border border-border px-2 bg-surface">
              <option value="">—</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="text-sm flex flex-col gap-1">
            {t('city')}
            <select required value={f.cityId} onChange={(e) => set('cityId', e.target.value)} className="h-10 border border-border px-2 bg-surface">
              <option value="">—</option>
              {cityList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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

        <label className="text-sm flex flex-col gap-1">
          {t('video')}
          <input type="url" value={f.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://…" className="h-10 border border-border px-3 bg-surface" />
        </label>

        <label className="text-sm flex flex-col gap-1">
          {t('photos')}
          <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} className="border border-border px-3 py-2 bg-surface" />
          {files.length > 0 && <span className="text-xs text-text-muted">{files.length} fichier(s)</span>}
        </label>

        <div className="text-sm flex flex-col gap-1">
          <span>{t('labels')}</span>
          <div className="border border-border p-2 grid grid-cols-2 sm:grid-cols-3 gap-1">
            {labels.map((lb) => {
              const checked = labelIds.includes(lb.id);
              return (
                <label key={lb.id} className={`flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer ${checked ? 'bg-brand-tint' : 'hover:bg-surface-2'}`}>
                  <input type="checkbox" checked={checked} onChange={() => toggleLabel(lb.id)} className="w-4 h-4" />
                  <span className="truncate">{labelName(lb, locale)}</span>
                </label>
              );
            })}
          </div>
        </div>

        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={busy} className="h-11 bg-brand-grad text-onbrand font-semibold">{t('submit')}</button>
      </form>
    </main>
  );
}
