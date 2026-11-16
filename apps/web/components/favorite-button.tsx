'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { apiToggleFavorite } from '@/lib/api';
import { clearToken, getToken } from '@/lib/auth';

export function FavoriteButton({
  listingId,
  initial = false,
}: {
  listingId: number;
  initial?: boolean;
}) {
  const router = useRouter();
  const locale = useLocale();
  const [fav, setFav] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function onClick() {
    const token = getToken();
    if (!token) {
      router.push(`/${locale}/connexion`);
      return;
    }
    setBusy(true);
    try {
      const r = await apiToggleFavorite(listingId, token);
      setFav(r.favorited);
    } catch {
      clearToken();
      router.push(`/${locale}/connexion`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={busy}
      aria-label="Favori"
      className="w-10 h-10 bg-surface border border-border inline-flex items-center justify-center shadow-1"
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill={fav ? 'var(--brand-bright)' : 'none'}
        stroke={fav ? 'var(--brand-bright)' : 'var(--text)'}
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M12 20s-7-4.4-8.8-8.6C2 8 4 4.5 7.2 4.5c1.9 0 3.4.9 4.8 2.9C13.4 5.4 14.9 4.5 16.8 4.5 20 4.5 22 8 20.8 11.4 19 15.6 12 20 12 20Z" />
      </svg>
    </button>
  );
}
