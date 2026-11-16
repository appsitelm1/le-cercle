'use client';

import { useState } from 'react';
import { Icon } from './icons';

export function ListingGallery({ images, title }: { images: { url: string }[]; title: string }) {
  const [idx, setIdx] = useState(0);

  if (!images || images.length === 0) {
    return <div className="aspect-[16/10] overflow-hidden bg-surface-2 relative"><div className="absolute inset-0 bg-brand-grad opacity-10" /></div>;
  }

  const cur = images[idx];
  const n = images.length;

  function prev() {
    setIdx((i) => (i - 1 + n) % n);
  }
  function next() {
    setIdx((i) => (i + 1) % n);
  }

  return (
    <div>
      <div className="aspect-[16/10] overflow-hidden bg-surface-2 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cur.url} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        {n > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Précédent"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/45 text-white flex items-center justify-center hover:bg-black/65"
            >
              <Icon name="aleft" size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Suivant"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/45 text-white flex items-center justify-center hover:bg-black/65"
            >
              <Icon name="aright" size={20} />
            </button>
            <span className="absolute bottom-2 right-2 bg-black/55 text-white text-xs px-2 py-0.5">
              {idx + 1}/{n}
            </span>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((im, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-24 h-[72px] flex-none overflow-hidden border ${i === idx ? 'border-brand ring-2 ring-brand' : 'border-border'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
