import { getTranslations } from 'next-intl/server';
import { getDevelopers } from '@/lib/api';
import { Icon } from '@/components/icons';

export default async function PromoteursPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'pro' });
  const developers = await getDevelopers();

  return (
    <main className="mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t('developersTitle')}</h1>
      {developers.length === 0 ? (
        <p className="text-text-muted mt-4">{t('noResults')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {developers.map((d) => (
            <div key={d.id} className="border border-border p-5 flex gap-4">
              <div className="w-16 h-16 bg-surface-2 flex items-center justify-center text-text-muted flex-none">
                <Icon name="layers" size={32} />
              </div>
              <div className="min-w-0">
                <div className="font-bold">{d.name}</div>
                {d.city?.name && <div className="text-sm text-text-muted flex items-center gap-1"><Icon name="pin" size={13} />{d.city.name}</div>}
                {d.description && <div className="text-sm text-text-muted mt-1">{d.description}</div>}
                <div className="text-sm mt-2 flex items-center gap-3">
                  {d.phone && <span className="flex items-center gap-1 text-brand-text"><Icon name="phone" size={14} />{d.phone}</span>}
                  {d.email && <span className="flex items-center gap-1 text-brand-text"><Icon name="mail" size={14} />{d.email}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
