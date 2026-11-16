'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { apiChat } from '@/lib/api';
import { Icon } from './icons';

type Msg = { role: 'user' | 'assistant'; content: string };

export function ChatWidget() {
  const t = useTranslations('chat');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const { reply } = await apiChat(next, locale);
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: t('error') }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-20 right-4 md:bottom-6 z-50 w-12 h-12 bg-brand text-onbrand flex items-center justify-center shadow-2"
        aria-label={t('title')}
        title={t('title')}
      >
        {open ? <Icon name="x" size={22} /> : <Icon name="chat" size={22} />}
      </button>

      {open && (
        <div
          className="fixed bottom-36 right-4 md:bottom-24 z-50 w-[340px] max-w-[90vw] border border-border bg-surface shadow-2 flex flex-col"
          style={{ height: 460 }}
        >
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border-soft">
            <span className="w-2 h-2 bg-success" />
            <span className="font-bold text-sm flex-1">{t('title')}</span>
            <button onClick={() => setOpen(false)} className="iconbtn w-7 h-7" aria-label="Fermer">
              <Icon name="x" size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-3 flex flex-col gap-2">
            {messages.length === 0 && (
              <p className="text-xs text-text-muted bg-surface-2 p-2 self-start max-w-[85%]">{t('welcome')}</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] p-2 text-sm whitespace-pre-wrap ${
                  m.role === 'user' ? 'bg-brand-tint self-end' : 'bg-surface-2 self-start'
                }`}
              >
                {m.content}
              </div>
            ))}
            {busy && <div className="text-xs text-text-muted self-start">…</div>}
          </div>

          <div className="flex gap-2 p-2 border-t border-border-soft">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={t('placeholder')}
              className="flex-1 h-10 border border-border px-2 text-sm bg-surface"
            />
            <button
              onClick={send}
              disabled={busy}
              className="h-10 px-3 bg-brand-grad text-onbrand font-semibold text-sm"
              aria-label={t('send')}
            >
              <Icon name="aright" size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
