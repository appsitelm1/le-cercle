'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { getUserRole } from '@/lib/auth';
import { Icon } from './icons';

export function DashboardSidebar() {
  const t = useTranslations('dash');
  const locale = useLocale();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = getUserRole();
    setIsAdmin(role === 'ADMIN' || role === 'SUPER_ADMIN');
  }, []);

  const items = [
    { href: `/${locale}/dashboard`, icon: 'chart', label: t('stats') },
    { href: `/${locale}/dashboard/proprietes`, icon: 'building2', label: t('properties') },
    { href: `/${locale}/dashboard/activites`, icon: 'activity', label: t('activities') },
    { href: `/${locale}/dashboard/favoris`, icon: 'heart', label: t('favorites') },
    { href: `/${locale}/dashboard/compte`, icon: 'user', label: t('account') },
  ];
  if (isAdmin) {
    items.push(
      { href: `/${locale}/dashboard/admin`, icon: 'users', label: t('admin') },
      { href: `/${locale}/dashboard/admin`, icon: 'settings', label: t('settings') },
    );
  }

  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-60'} flex-none border-r border-border bg-surface sticky top-0 h-screen overflow-hidden transition-all`}
    >
      <div className="flex items-center justify-between h-14 px-3 border-b border-border-soft">
        {!collapsed && <span className="font-bold tracking-tight">LE CERCLE</span>}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="iconbtn w-8 h-8 flex-none"
          aria-label="toggle"
          title={collapsed ? 'Déplier' : 'Replier'}
        >
          <Icon name={collapsed ? 'aright' : 'aleft'} size={18} />
        </button>
      </div>
      <nav className="p-2 flex flex-col gap-1">
        {items.map((it) => {
          const active = it.href === `/${locale}/dashboard`
            ? pathname === it.href
            : pathname.startsWith(it.href);
          return (
            <Link
              key={it.label}
              href={it.href}
              className={`flex items-center gap-3 px-3 h-10 text-sm font-semibold ${
                active ? 'bg-brand-tint text-brand-text' : 'text-text-muted hover:text-text'
              }`}
            >
              <Icon name={it.icon} size={18} className="flex-none" />
              {!collapsed && <span className="truncate">{it.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
