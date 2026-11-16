'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

function newQuestion() {
  const a = Math.floor(Math.random() * 8) + 1;
  const b = Math.floor(Math.random() * 8) + 1;
  return { a, b, answer: a + b };
}

export function CaptchaField({ onValidChange }: { onValidChange?: (valid: boolean) => void }) {
  const t = useTranslations('captcha');
  const [q, setQ] = useState(newQuestion);
  const [val, setVal] = useState('');
  const valid = String(q.answer) === val.trim();

  function set(v: string) {
    setVal(v);
    onValidChange?.(String(q.answer) === v.trim());
  }

  function refresh() {
    setQ(newQuestion());
    setVal('');
    onValidChange?.(false);
  }

  return (
    <div>
      <div className="text-xs font-semibold text-text-muted mb-1">{t('title')}</div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 h-10 px-3 border border-border bg-surface-2 select-none font-mono font-bold">
          {q.a} + {q.b} = ?
          <button type="button" onClick={refresh} className="ml-1 text-brand-text text-sm" aria-label={t('refresh')} title={t('refresh')}>↻</button>
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={val}
          onChange={(e) => set(e.target.value)}
          placeholder="?"
          className={`w-20 h-10 border border-border px-2 bg-surface text-center ${valid ? 'border-success' : ''}`}
        />
        {valid && <span className="text-success font-bold">✓</span>}
      </div>
    </div>
  );
}
