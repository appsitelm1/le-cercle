'use client';

import Link from 'next/link';
import type { ListingSummary } from '@/lib/api';
import { useCurrency } from '@/lib/currency';

export function ListingCard({ listing, className = '' }: { listing: ListingSummary; className?: string }) {
  const { format } = useCurrency();
  const img = listing.images?.find((i) => i.isPrimary) ?? listing.images?.[0];
  const infos = [
    listing.bedrooms ? `${listing.bedrooms} ch` : null,
    listing.bathrooms ? `${listing.bathrooms} SdB` : null,
    listing.surface ? `${listing.surface} m²` : null,
  ].filter(Boolean);

  return (
    <Link href={`/bien/${listing.id}`} className={`block group ${className}`}>
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-2">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img.url}
            alt={listing.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-grad opacity-10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
        {listing.featured && (
          <span className="absolute top-2 left-2 bg-surface text-text text-[11px] font-semibold px-2 py-0.5 shadow-1">
            À la une
          </span>
        )}
        {listing.transaction === 'RENT' && (
          <span className="absolute top-2 left-2 bg-surface text-text text-[11px] font-semibold px-2 py-0.5 shadow-1">
            Location
          </span>
        )}
        {(listing.images?.length ?? 0) > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/55 text-white text-[11px] px-1.5 py-0.5">
            {listing.images?.length}
          </span>
        )}
      </div>

      <div className="pt-2 px-0.5">
        <div className="font-bold text-[15px]">{format(Number(listing.price))}</div>
        <div className="text-[13px] text-text-muted mt-0.5">{infos.join(' · ')}</div>
        <div className="text-[13px] mt-0.5">{listing.city?.name ?? ''}</div>
      </div>
    </Link>
  );
}
