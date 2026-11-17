'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Currency = { code: string; symbol: string; rate: number; label: string };

export const CURRENCIES: Currency[] = [
  { code: 'MAD', symbol: 'DH', rate: 1, label: 'Dirham marocain (MAD)' },
  { code: 'EUR', symbol: '€', rate: 0.091, label: 'Euro (EUR)' },
  { code: 'USD', symbol: '$', rate: 0.099, label: 'Dollar américain (USD)' },
];

const FALLBACK_RATES: Record<string, number> = { EUR: 0.091, USD: 0.099 };
const RATES_CACHE_KEY = 'lecercle-rates';
const RATES_TTL = 6 * 3600 * 1000; // 6 heures

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (mad: number) => string;
  convert: (mad: number) => number;
};

const CurrencyContext = createContext<Ctx>({
  currency: CURRENCIES[0],
  setCurrency: () => {},
  format: (m) => `${m} DH`,
  convert: (m) => m,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0]);
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lecercle-currency');
      const c = CURRENCIES.find((x) => x.code === saved);
      if (c) setCurrencyState(c);
    } catch {}
  }, []);

  // Taux de change officiels en direct (open.er-api.com, gratuit, sans clé).
  useEffect(() => {
    try {
      const cached = localStorage.getItem(RATES_CACHE_KEY);
      if (cached) {
        const p = JSON.parse(cached);
        if (p && p.t && Date.now() - p.t < RATES_TTL && p.r) {
          setRates(p.r);
          return;
        }
      }
    } catch {}
    fetch('https://open.er-api.com/v6/latest/MAD')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.rates && d.rates.EUR && d.rates.USD) {
          const r = { EUR: d.rates.EUR, USD: d.rates.USD };
          setRates(r);
          try {
            localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ r, t: Date.now() }));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    try {
      localStorage.setItem('lecercle-currency', c.code);
    } catch {}
  }

  function convert(mad: number) {
    if (currency.code === 'MAD') return mad;
    const rate = rates[currency.code] ?? currency.rate;
    return mad * rate;
  }

  function format(mad: number) {
    const v = convert(mad);
    return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(v))} ${currency.symbol}`;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
