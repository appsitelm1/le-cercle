'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getToken } from '@/lib/auth';
import { Icon } from './icons';

export function BrandBanner() {
  const hero = useTranslations('hero');
  const t = useTranslations('nav');
  const locale = useLocale();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(!!getToken());
  }, []);

  return (
    <div className="border-b border-border-soft bg-surface">
      <div className="mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="font-bold text-2xl md:text-3xl tracking-tight">{hero('title')}</div>
          <div className="text-sm text-text-muted">{hero('subtitle')}</div>
          <div className="text-sm text-text-muted">{hero('baseline')}</div>
        </div>
        <Link href={authed ? `/${locale}/publier` : `/${locale}/connexion`} className="btn-primary flex-none">
          <Icon name="plus" size={16} />
          {t('publishListing')}
        </Link>
      </div>
    </div>
  );
}
