'use client';

import { useEffect, useRef } from 'react';

function useOutsideClose() {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        ref.current.removeAttribute('open');
      }
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);
  return ref;
}

export function CheckDropdown({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: string; name: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const ref = useOutsideClose();
  return (
    <details ref={ref} className="relative group flex-1 min-w-[140px]">
      <summary className="h-12 px-3 flex items-center justify-between gap-1 cursor-pointer list-none text-sm border-r border-border-soft bg-surface">
        <span className="truncate">
          {label}
          {selected.length > 0 && <span className="ml-1 text-brand-text font-bold">({selected.length})</span>}
        </span>
        <span className="text-text-muted text-xs">▾</span>
      </summary>
      <div className="absolute top-full left-0 mt-1 z-40 bg-surface border border-border shadow-1 p-1 min-w-[200px] max-h-64 overflow-auto" dir="ltr">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-surface-2">
            <input
              type="checkbox"
              checked={selected.includes(o.value)}
              onChange={() => onToggle(o.value)}
              className="w-4 h-4"
            />
            <span className="truncate">{o.name}</span>
          </label>
        ))}
        {options.length === 0 && <p className="px-2 py-1.5 text-xs text-text-muted">—</p>}
      </div>
    </details>
  );
}

export function StepperDropdown({
  label,
  value,
  suffix = '',
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  const ref = useOutsideClose();
  function setAndClose(v: number) {
    onChange(v);
    ref.current?.removeAttribute('open');
  }
  return (
    <details ref={ref} className="relative flex-none w-[120px]">
      <summary className="h-12 px-3 flex items-center justify-between gap-1 cursor-pointer list-none text-sm border-r border-border-soft bg-surface">
        <span className="truncate">
          {label}
          {value > 0 && <span className="ml-1 text-brand-text font-bold">{value}{suffix}</span>}
        </span>
        <span className="text-text-muted text-xs">▾</span>
      </summary>
      <div className="absolute top-full left-0 mt-1 z-40 bg-surface border border-border shadow-1 p-3 min-w-[170px]" dir="ltr">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setAndClose(Math.max(0, value - 1))} className="w-9 h-9 border border-border font-bold text-lg leading-none">−</button>
          <input
            type="number"
            value={value || ''}
            min={0}
            placeholder="—"
            onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
            className="flex-1 h-9 border border-border px-2 text-center bg-surface text-sm"
          />
          <button type="button" onClick={() => setAndClose(value + 1)} className="w-9 h-9 border border-border font-bold text-lg leading-none">+</button>
        </div>
      </div>
    </details>
  );
}

function fmt(n: number) {
  if (n <= 0) return '';
  return new Intl.NumberFormat('fr-FR').format(n) + ' DH';
}

export function PriceDropdown({
  label,
  min,
  max,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const ref = useOutsideClose();
  return (
    <details ref={ref} className="relative group flex-1 min-w-[150px]">
      <summary className="h-12 px-3 flex items-center justify-between gap-1 cursor-pointer list-none text-sm border-r border-border-soft bg-surface">
        <span className="truncate">
          {label}
          {(min > 0 || max > 0) && <span className="ml-1 text-brand-text font-bold">{fmt(min)}{max > 0 ? ' – ' + fmt(max) : ''}</span>}
        </span>
        <span className="text-text-muted text-xs">▾</span>
      </summary>
      <div className="absolute top-full left-0 mt-1 z-40 bg-surface border border-border shadow-1 p-4 min-w-[260px]" dir="ltr">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>Min</span><span className="text-brand-text">{fmt(min) || '—'}</span>
        </div>
        <input type="range" min={0} max={10000000} step={100000} value={min} onChange={(e) => onChange(Number(e.target.value), max)} className="w-full" />
        <div className="flex items-center justify-between text-xs font-semibold mt-4">
          <span>Max</span><span className="text-brand-text">{fmt(max) || '—'}</span>
        </div>
        <input type="range" min={0} max={10000000} step={100000} value={max} onChange={(e) => onChange(min, Number(e.target.value))} className="w-full" />
      </div>
    </details>
  );
}
