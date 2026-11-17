import { getTranslations } from 'next-intl/server';
import { getAgencies } from '@/lib/api';
import { Icon } from '@/components/icons';

export default async function AgenciesPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'pro' });
  const agencies = await getAgencies();

  return (
    <main className="mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t('agenciesTitle')}</h1>
      {agencies.length === 0 ? (
        <p className="text-text-muted mt-4">{t('noResults')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {agencies.map((a) => (
            <div key={a.id} className="border border-border p-5 flex gap-4">
              <div className="w-16 h-16 bg-surface-2 flex items-center justify-center text-text-muted flex-none">
                <Icon name="building" size={32} />
              </div>
              <div className="min-w-0">
                <div className="font-bold">{a.name}</div>
                {a.city?.name && <div className="text-sm text-text-muted flex items-center gap-1"><Icon name="pin" size={13} />{a.city.name}</div>}
                {a.description && <div className="text-sm text-text-muted mt-1">{a.description}</div>}
                <div className="text-sm mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {a.phone && <span className="flex items-center gap-1 text-brand-text whitespace-nowrap"><Icon name="phone" size={14} />{a.phone}</span>}
                  {a.email && <span className="flex items-center gap-1 text-brand-text whitespace-nowrap"><Icon name="mail" size={14} />{a.email}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
