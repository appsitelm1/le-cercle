'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Currency = { code: string; symbol: string; rate: number; label: string };

export const CURRENCIES: Currency[] = [
  { code: 'MAD', symbol: 'DH', rate: 1, label: 'Dirham marocain (MAD)' },
  { code: 'EUR', symbol: '€', rate: 0.091, label: 'Euro (EUR)' },
  { code: 'USD', symbol: '$', rate: 0.099, label: 'Dollar américain (USD)' },
];

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lecercle-currency');
      const c = CURRENCIES.find((x) => x.code === saved);
      if (c) setCurrencyState(c);
    } catch {}
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    try {
      localStorage.setItem('lecercle-currency', c.code);
    } catch {}
  }

  function convert(mad: number) {
    return mad * currency.rate;
  }

  function format(mad: number) {
    const v = convert(mad);
    const digits = currency.code === 'MAD' ? 0 : 0;
    return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: digits }).format(Math.round(v))} ${currency.symbol}`;
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
