'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getToken } from '@/lib/auth';
import { Icon } from './icons';

export function MobileNav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(!!getToken());
  }, []);

  const items = [
    { href: '/recherche?transaction=SALE', icon: 'house', label: t('buy') },
    { href: '/recherche?transaction=RENT', icon: 'key', label: t('rent') },
    { href: authed ? '/publier' : '/connexion', icon: 'plus', label: t('publishShort') },
    { href: '/favoris', icon: 'heart', label: t('favorites') },
    { href: authed ? '/dashboard' : '/connexion', icon: 'user', label: t('account') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface border-t border-border-soft flex">
      {items.map((it) => (
        <Link
          key={it.href + it.label}
          href={`/${locale}${it.href}`}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold text-text-muted relative group"
        >
          <Icon
            name={it.icon}
            size={22}
            className="text-brand-text drop-shadow-[0_1px_1px_rgba(0,0,0,0.28)] transition-transform duration-500 group-hover:rotate-[360deg] group-active:scale-95"
          />
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
