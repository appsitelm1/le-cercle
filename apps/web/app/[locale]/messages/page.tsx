'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { apiGetConversation, apiListConversations, apiReply } from '@/lib/api';
import { getToken, getUserId } from '@/lib/auth';

export default function MessagesPage() {
  const t = useTranslations('messages');
  const locale = useLocale();
  const meId = getUserId();
  const [convs, setConvs] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthed(true);
    setConvs(await apiListConversations(token));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function open(id: number) {
    const token = getToken()!;
    setActive(await apiGetConversation(token, id));
  }

  async function send() {
    const token = getToken()!;
    if (!active || !draft.trim()) return;
    await apiReply(token, active.id, draft);
    setDraft('');
    await open(active.id);
  }

  if (loading) {
    return (
      <main className="max-w-[900px] mx-auto px-4 py-10">
        <p className="text-text-muted">…</p>
      </main>
    );
  }
  if (!authed) {
    return (
      <main className="max-w-[900px] mx-auto px-4 py-10">
        <Link href={`/${locale}/connexion`} className="text-brand-text font-semibold">
          {t('loginToSee')}
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[900px] mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold tracking-tight">{t('title')}</h1>

      {convs.length === 0 ? (
        <p className="text-text-muted mt-4">{t('empty')}</p>
      ) : (
        <div className="mt-4 grid md:grid-cols-[280px_1fr] gap-4">
          <div className="flex flex-col border border-border-soft max-h-[70vh] overflow-auto">
            {convs.map((c) => (
              <button
                key={c.id}
                onClick={() => open(c.id)}
                className="text-left p-3 border-b border-border-soft hover:bg-surface-2"
              >
                <div className="font-semibold text-sm">
                  {c.buyerUserId === meId ? `${c.pro.firstName ?? ''} ${c.pro.lastName ?? ''}`.trim() || 'Pro' : `${c.buyer.firstName ?? ''} ${c.buyer.lastName ?? ''}`.trim() || 'Contact'}
                </div>
                <div className="text-xs text-text-muted truncate">{c.listing?.title ?? ''}</div>
                <div className="text-xs text-text-muted truncate">{c.messages?.[0]?.body ?? ''}</div>
              </button>
            ))}
          </div>

          <div className="border border-border p-3 flex flex-col min-h-[320px]">
            {active ? (
              <>
                <div className="flex-1 overflow-auto flex flex-col gap-2 max-h-[50vh]">
                  {active.messages.map((m: any) => (
                    <div
                      key={m.id}
                      className={`max-w-[75%] p-2 text-sm ${
                        m.senderId === meId ? 'bg-brand-tint self-end' : 'bg-surface-2 self-start'
                      }`}
                    >
                      {m.body}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={t('placeholder')}
                    className="flex-1 h-10 border border-border px-3 bg-surface"
                  />
                  <button onClick={send} className="h-10 px-4 bg-brand-grad text-onbrand font-semibold">
                    {t('send')}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-text-muted text-sm">{t('select')}</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
