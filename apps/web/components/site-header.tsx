'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getAuth } from '@/lib/api';
import { clearToken, getToken, getUserRole } from '@/lib/auth';
import { Icon } from './icons';
import { LogoMark } from './logo';
import { CurrencySelect } from './currency-select';

const LOCALES = ['fr', 'ar', 'en', 'es'] as const;

export function SiteHeader() {
  const t = useTranslations('nav');
  const c = useTranslations('common');
  const locale = useLocale();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
    const token = getToken();
    if (token) {
      getAuth('/auth/me', token).then((u) => {
        if (u && !Array.isArray(u)) setMe(u);
      });
    }
  }, []);

  // Re-synchronise le thème après un changement de langue (la navigation peut réinitialiser data-theme).
  useEffect(() => {
    const saved = localStorage.getItem('lecercle-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, [locale]);

  const role = me ? getUserRole() : null;
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const displayName = [me?.firstName, me?.lastName].filter(Boolean).join(' ') || me?.email || '';

  function logout() {
    clearToken();
    setMe(null);
    window.location.href = `/${locale}`;
  }

  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('lecercle-theme', next);
    } catch {
      /* ignore */
    }
    setDark(next === 'dark');
  }

  const nav = [
    { href: '/recherche?transaction=SALE', icon: 'house', label: t('buy') },
    { href: '/recherche?transaction=RENT', icon: 'key', label: t('rent') },
    { href: '/agents', icon: 'usercheck', label: t('agents') },
    { href: '/agences', icon: 'building', label: t('agencies') },
    { href: '/promoteurs', icon: 'layers', label: t('promoters') },
    { href: '/contact', icon: 'mail', label: t('contact') },
    { href: '/a-propos', icon: 'info', label: t('about') },
  ];

  const menuItem = 'flex items-center gap-2.5 px-3 py-2 text-sm font-semibold hover:bg-surface-2';

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border-soft h-[58px] flex items-center gap-3 px-4">
      <button className="iconbtn md:hidden" onClick={() => setOpen(true)} aria-label="Menu">
        <Icon name="menu" size={20} />
      </button>

      <Link href={`/${locale}`} className="flex items-center gap-2 text-brand font-bold tracking-tight text-[17px]">
        <LogoMark size={26} />
        LE CERCLE
      </Link>

      <nav className="hidden md:flex gap-0.5 ml-2">
        {nav.map((n) => (
          <Link
            key={n.label}
            href={`/${locale}${n.href}`}
            className="relative inline-flex items-center gap-2 px-3 h-10 text-[13.5px] font-semibold text-text-muted hover:text-text group"
          >
            <Icon name={n.icon} size={16} className="text-brand-text transition-transform duration-500 group-hover:rotate-[360deg]" />
            {n.label}
            <span className="absolute left-3 right-3 bottom-1.5 h-0.5 bg-indicator scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <Link href={`/${locale}/favoris`} className="iconbtn" aria-label={t('favorites')} title={t('favorites')}>
          <Icon name="heart" size={18} />
        </Link>

        <details className="relative" onMouseLeave={(e) => e.currentTarget.removeAttribute('open')}>
          <summary className="iconbtn gap-1 text-[13px] font-semibold list-none cursor-pointer">
            <Icon name="globe" size={16} />
            {locale.toUpperCase()}
          </summary>
          <div className="absolute right-0 top-full mt-1 bg-surface border border-border shadow-1 py-1 z-50 min-w-[120px]" dir="ltr">
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-surface-2 ${
                  l === locale ? 'text-brand-text font-semibold' : 'text-text'
                }`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </details>

        <button className="iconbtn" onClick={toggleTheme} aria-label={c('theme')} title={c('theme')}>
          <Icon name={dark ? 'sun' : 'moon'} size={18} />
        </button>

        <CurrencySelect compact />

        {me ? (
          <details className="relative" onMouseLeave={(e) => e.currentTarget.removeAttribute('open')}>
            <summary className="iconbtn gap-1.5 list-none cursor-pointer relative" title={t('account')}>
              <Icon name="user" size={18} className="text-brand-text" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-success ring-2 ring-surface" />
              <span className="hidden md:inline text-[13px] font-semibold max-w-[100px] truncate">{displayName}</span>
              <span className="text-text-muted text-xs">▾</span>
            </summary>
            <div className="absolute right-0 top-full mt-1 bg-surface border border-border shadow-1 py-1 z-50 min-w-[220px]">
              <div className="px-3 py-2 border-b border-border-soft">
                <div className="font-semibold text-sm truncate">{displayName}</div>
                <div className="text-xs text-text-muted truncate">{me.email}</div>
              </div>
              <Link href={`/${locale}/dashboard`} className={menuItem}>
                <Icon name="dashboard" size={16} />
                {t('account')}
              </Link>
              <Link href={`/${locale}/favoris`} className={menuItem}>
                <Icon name="heart" size={16} />
                {t('favorites')}
              </Link>
              {isAdmin && (
                <Link href={`/${locale}/dashboard/admin`} className={menuItem}>
                  <Icon name="users" size={16} />
                  {t('admin')}
                </Link>
              )}
              <button onClick={logout} className={`${menuItem} w-full text-left text-danger`}>
                <Icon name="login" size={16} />
                {t('logout')}
              </button>
            </div>
          </details>
        ) : (
          <Link href={`/${locale}/connexion`} className="iconbtn" aria-label={t('account')} title={t('account')}>
            <Icon name="user" size={18} className="text-text-muted" />
          </Link>
        )}
      </div>

      {/* drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-surface flex flex-col">
            <div className="flex items-center gap-2 p-4 border-b border-border-soft">
              <Link href={`/${locale}`} className="flex items-center gap-2 text-brand font-bold" onClick={() => setOpen(false)}>
                <LogoMark size={24} />
                LE CERCLE
              </Link>
              <button className="ml-auto iconbtn" onClick={() => setOpen(false)} aria-label="Fermer">
                <Icon name="x" size={18} />
              </button>
            </div>
            <nav className="p-2 overflow-auto">
              {nav.map((n) => (
                <Link
                  key={n.label}
                  href={`/${locale}${n.href}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 font-semibold text-text hover:bg-surface-2"
                >
                  <Icon name={n.icon} size={20} />
                  {n.label}
                </Link>
              ))}
              <div className="my-2 border-t border-border-soft" />
              <Link href={`/${locale}/favoris`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 font-semibold hover:bg-surface-2">
                <Icon name="heart" size={20} />{t('favorites')}
              </Link>
              <Link href={`/${locale}/dashboard`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 font-semibold hover:bg-surface-2">
                <Icon name="user" size={20} />{t('account')}
              </Link>
              {isAdmin && (
                <Link href={`/${locale}/dashboard/admin`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 font-semibold hover:bg-surface-2">
                  <Icon name="users" size={20} />{t('admin')}
                </Link>
              )}
            </nav>
            <div className="p-4 border-t border-border-soft flex flex-col gap-2">
              {me ? (
                <button onClick={() => { setOpen(false); logout(); }} className="btn-secondary">{t('logout')}</button>
              ) : (
                <Link href={`/${locale}/connexion`} onClick={() => setOpen(false)} className="btn-secondary">{t('login')}</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
