import { getTranslations } from 'next-intl/server';
import { getAgents } from '@/lib/api';
import { Icon } from '@/components/icons';

export default async function AgentsPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'pro' });
  const agents = await getAgents();

  return (
    <main className="mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t('agentsTitle')}</h1>
      {agents.length === 0 ? (
        <p className="text-text-muted mt-4">{t('noResults')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {agents.map((a) => (
            <div key={a.id} className="border border-border p-4">
              <div className="aspect-square bg-surface-2 flex items-center justify-center text-text-muted">
                <Icon name="user" size={48} />
              </div>
              <div className="font-bold mt-3">
                {[a.user?.firstName, a.user?.lastName].filter(Boolean).join(' ') || 'Agent'}
              </div>
              {a.city?.name && <div className="text-sm text-text-muted mt-0.5 flex items-center gap-1"><Icon name="pin" size={13} />{a.city.name}</div>}
              {a.bio && <div className="text-sm text-text-muted mt-2">{a.bio}</div>}
              {a.phone && (
                <div className="text-sm mt-2 flex items-center gap-2 text-brand-text">
                  <Icon name="phone" size={14} />
                  {a.phone}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
