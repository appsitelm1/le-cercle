'use client';

import { useCurrency, CURRENCIES } from '@/lib/currency';
import { Icon } from './icons';

export function CurrencySelect({ compact = false, dropUp = false, plain = false }: { compact?: boolean; dropUp?: boolean; plain?: boolean }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <details className="relative" onMouseLeave={(e) => e.currentTarget.removeAttribute('open')}>
      <summary
        className={`${
          plain
            ? 'inline-flex items-center gap-1 text-[13px] font-semibold text-text hover:text-brand-text'
            : 'iconbtn'
        } gap-1 text-[13px] font-semibold list-none cursor-pointer`}
      >
        <Icon name="banknote" size={16} />
        {!compact && <span>{currency.code}</span>}
        <span className="text-text-muted text-xs">▾</span>
      </summary>
      <div className={`absolute right-0 ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'} bg-surface border border-border shadow-1 py-1 z-50 min-w-[200px]`} dir="ltr">
        {CURRENCIES.map((c) => (
          <button
            key={c.code}
            onClick={() => setCurrency(c)}
            className={`flex items-center justify-between w-full px-3 py-1.5 text-sm hover:bg-surface-2 ${
              c.code === currency.code ? 'text-brand-text font-semibold' : 'text-text'
            }`}
          >
            <span>{c.label}</span>
            {c.code === currency.code && <span>✓</span>}
          </button>
        ))}
      </div>
    </details>
  );
}
