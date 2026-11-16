'use client';

import { useRef } from 'react';
import { Icon } from './icons';

export function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: number) {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        aria-label="Précédent"
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-surface border border-border shadow-1 flex items-center justify-center hidden md:flex"
      >
        <Icon name="aleft" size={18} />
      </button>
      <div ref={ref} className="track">
        {children}
      </div>
      <button
        onClick={() => scroll(1)}
        aria-label="Suivant"
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-surface border border-border shadow-1 flex items-center justify-center hidden md:flex"
      >
        <Icon name="aright" size={18} />
      </button>
    </div>
  );
}
