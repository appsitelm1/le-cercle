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
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface border-t border-border-soft flex items-end">
      {items.map((it) => {
        const isPublish = it.icon === 'plus';
        if (isPublish) {
          return (
            <Link
              key={it.href + it.label}
              href={`/${locale}${it.href}`}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold relative group"
            >
              <svg
                viewBox="0 0 24 24"
                width={38}
                height={38}
                className="-mt-2.5 drop-shadow-[0_4px_6px_rgba(224,11,65,0.5)] transition-transform duration-300 group-active:scale-90"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="pubHouse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f43f5e" />
                    <stop offset="1" stopColor="#c00b3c" />
                  </linearGradient>
                </defs>
                <path d="M12 3 21 11h-2v9H5v-9H3Z" fill="url(#pubHouse)" />
                <path d="M12 3 21 11" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.2" strokeLinecap="square" />
                <path d="M12 11.5v5M9.5 14h5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="square" />
              </svg>
              <span className="text-brand-text font-bold">{it.label}</span>
            </Link>
          );
        }
        return (
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
        );
      })}
    </nav>
  );
}
