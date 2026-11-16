'use client';

import { useCurrency } from '@/lib/currency';

export function PriceDisplay({ price, className = '' }: { price: number; className?: string }) {
  const { format } = useCurrency();
  return <span className={className}>{format(price)}</span>;
}
