'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { getCategories, getCities, getCountries } from '@/lib/api';
import { Icon } from './icons';
import { CheckDropdown, StepperDropdown, PriceDropdown } from './check-dropdown';

export function SearchBar() {
  const t = useTranslations('listings');
  const hero = useTranslations('hero');
  const locale = useLocale();
  const router = useRouter();
  const [cats, setCats] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<string[]>(['SALE', 'RENT']);
  const [countryIds, setCountryIds] = useState<string[]>([]);
  const [typeIds, setTypeIds] = useState<string[]>([]);
  const [cityIds, setCityIds] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState(0);
  const [surface, setSurface] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get('transactions') || sp.get('transaction');
    if (t) {
      setTransactions(t.split(',').filter((x) => x === 'SALE' || x === 'RENT'));
    }
    Promise.all([getCategories(), getCountries(), getCities()]).then(([c, co, ci]) => {
      setCats(c);
      setCountries(co);
      setCities(ci);
    });
  }, []);

  function toggle(arr: string[], setArr: (v: string[]) => void, v: string) {
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (transactions.length) p.set('transactions', transactions.join(','));
    if (typeIds.length) p.set('typeIds', typeIds.join(','));
    if (countryIds.length) p.set('countryIds', countryIds.join(','));
    if (cityIds.length) p.set('cityIds', cityIds.join(','));
    if (bedrooms > 0) p.set('bedrooms', String(bedrooms));
    if (surface > 0) p.set('surfaceMin', String(surface));
    if (bathrooms > 0) p.set('bathrooms', String(bathrooms));
    if (priceMin > 0) p.set('priceMin', String(priceMin));
    if (priceMax > 0) p.set('priceMax', String(priceMax));
    router.push(`/${locale}/recherche?${p.toString()}`);
  }

  const cityList = countryIds.length
    ? cities.filter((c) => countryIds.includes(String(c.countryId)))
    : cities;

  return (
    <form onSubmit={submit} className="mt-5 border border-border shadow-1 bg-surface flex flex-wrap items-stretch overflow-visible">
      <CheckDropdown
        label={t('transaction')}
        options={[{ value: 'SALE', name: t('sale') }, { value: 'RENT', name: t('rent') }]}
        selected={transactions}
        onToggle={(v) => toggle(transactions, setTransactions, v)}
      />
      <CheckDropdown
        label={t('type')}
        options={cats.map((c) => ({ value: String(c.id), name: c.name }))}
        selected={typeIds}
        onToggle={(v) => toggle(typeIds, setTypeIds, v)}
      />
      <CheckDropdown
        label={t('country')}
        options={countries.map((c) => ({ value: String(c.id), name: c.name }))}
        selected={countryIds}
        onToggle={(v) => toggle(countryIds, setCountryIds, v)}
      />
      <CheckDropdown
        label={t('city')}
        options={cityList.map((c) => ({ value: String(c.id), name: c.name }))}
        selected={cityIds}
        onToggle={(v) => toggle(cityIds, setCityIds, v)}
      />
      <StepperDropdown label={t('bedrooms')} value={bedrooms} onChange={setBedrooms} />
      <StepperDropdown label={t('surface')} value={surface} suffix=" m²" onChange={setSurface} />
      <StepperDropdown label={t('bathrooms')} value={bathrooms} onChange={setBathrooms} />
      <PriceDropdown label={t('price')} min={priceMin} max={priceMax} onChange={(mn, mx) => { setPriceMin(mn); setPriceMax(mx); }} />
      <button type="submit" className="h-12 px-5 bg-brand-grad text-onbrand font-bold flex items-center justify-center gap-2 flex-none">
        <Icon name="search" size={16} />
        <span className="hidden sm:inline">{hero('search')}</span>
      </button>
    </form>
  );
}
