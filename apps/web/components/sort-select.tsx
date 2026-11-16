'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export function SortSelect({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const t = useTranslations('listings');
  const locale = useLocale();
  const router = useRouter();
  const current = typeof searchParams.sort === 'string' ? searchParams.sort : '';

  function change(v: string) {
    const p = new URLSearchParams();
    for (const [k, val] of Object.entries(searchParams)) {
      if (val == null || val === '') continue;
      if (Array.isArray(val)) val.forEach((x) => p.append(k, x));
      else p.set(k, val);
    }
    if (v) p.set('sort', v);
    else p.delete('sort');
    router.push(`/${locale}/recherche?${p.toString()}`);
  }

  return (
    <select value={current} onChange={(e) => change(e.target.value)} className="h-10 border border-border px-3 bg-surface text-sm font-semibold">
      <option value="">{t('sortRecent')}</option>
      <option value="price_asc">{t('sortPriceAsc')}</option>
      <option value="price_desc">{t('sortPriceDesc')}</option>
      <option value="surface">{t('surface')}</option>
    </select>
  );
}
