import { getTranslations } from 'next-intl/server';
import { getAgents, getListings } from '@/lib/api';
import { Icon } from '@/components/icons';
import { ListingCard } from '@/components/listing-card';
import { SearchBar } from '@/components/search-bar';
import { ScrollRow } from '@/components/scroll-row';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'home' });
  const [listings, agents] = await Promise.all([
    getListings({ limit: 6 }),
    getAgents(),
  ]);

  const categories: [string, string][] = [
    ['building2', t('cat.appartement')],
    ['house', t('cat.villa')],
    ['cottage', t('cat.maison')],
    ['riad', t('cat.riad')],
    ['land', t('cat.terrain')],
    ['store', t('cat.commercial')],
    ['briefcase', t('cat.bureau')],
    ['building', t('cat.immeuble')],
    ['farm', t('cat.ferme')],
    ['bed', t('cat.hotel')],
    ['layers', t('cat.projet')],
  ];

  const args: [string, string][] = [
    ['award', t('arg.lots')],
    ['usercheck', t('arg.agents')],
    ['pin', t('arg.everywhere')],
    ['globe', t('arg.visibility')],
    ['shield', t('arg.selection')],
    ['award', t('arg.selectedAgents')],
    ['building2', t('arg.invest')],
    ['user', t('arg.support')],
  ];

  return (
    <main>
        {/* HERO */}
        <section className="bg-pattern">
          <div className="relative mx-auto px-4 md:px-6 pt-6 pb-6">
            <SearchBar />
          </div>
        </section>

        {/* CATEGORIES */}
        <div className="border-y border-border-soft">
          <div className="mx-auto px-4 md:px-6 py-2.5 flex gap-1 overflow-x-auto md:grid md:grid-cols-11 md:gap-0 md:overflow-visible">
            {categories.map(([icon, label]) => (
              <a
                key={label}
                href={`/${params.locale}/recherche`}
                className="flex flex-col items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-text-muted hover:text-text whitespace-nowrap md:px-2 group"
              >
                <Icon name={icon} size={26} className="text-brand-text transition-transform duration-500 group-hover:rotate-[360deg]" />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ARGUMENTS */}
        <div className="bg-pattern border-y border-border-soft">
          <div className="mx-auto px-4 md:px-6 py-4 flex gap-6 overflow-x-auto">
            {args.map(([icon, label]) => (
              <span key={label} className="flex items-center gap-2 text-[13px] font-semibold whitespace-nowrap">
                <Icon name={icon} size={18} className="text-brand-text" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* DERNIÈRES ANNONCES */}
        <SectionTitle title={t('latest')} locale={params.locale} />
        {listings.items.length === 0 ? (
          <p className="mx-auto px-4 md:px-6 text-text-muted text-sm">{t('noListings')}</p>
        ) : (
          <div className="mx-auto px-4 md:px-6">
            <ScrollRow>
              {listings.items.map((l) => (
                <ListingCard key={l.id} listing={l} className="w-[46%] sm:w-[240px] md:w-[300px] flex-none" />
              ))}
            </ScrollRow>
          </div>
        )}

        {/* AGENTS */}
        {agents.length > 0 && (
          <>
            <SectionTitle title={t('agents')} locale={params.locale} />
            <div className="mx-auto px-4 md:px-6">
              <ScrollRow>
                {agents.map((a) => (
                  <div key={a.id} className="w-[46%] sm:w-[200px] border border-border-soft p-3">
                    <div className="aspect-square bg-surface-2 flex items-center justify-center text-text-muted">
                      <Icon name="user" size={40} />
                    </div>
                    <div className="font-bold text-sm mt-2">
                      {[a.user?.firstName, a.user?.lastName].filter(Boolean).join(' ') || 'Agent'}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">{a.city?.name ?? ''}</div>
                  </div>
                ))}
              </ScrollRow>
            </div>
          </>
        )}

        {/* AVIS */}
        <SectionTitle title={t('reviews')} locale={params.locale} />
        <div className="mx-auto px-4 md:px-6">
          <ScrollRow>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-[85%] sm:w-[300px] border border-border-soft p-4 bg-surface">
                <div className="flex gap-0.5 text-warning">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Icon key={s} name="star" size={13} className="text-warning" />
                  ))}
                </div>
                <p className="text-sm mt-2">{t(`r${i}`)}</p>
                <div className="text-xs text-text-muted font-semibold mt-2">{t(`r${i}name`)}</div>
              </div>
            ))}
          </ScrollRow>
        </div>
    </main>
  );
}

function SectionTitle({ title, locale }: { title: string; locale: string }) {
  return (
    <div className="mx-auto px-4 md:px-6 mt-8 mb-3 flex items-center justify-between">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <a href={`/${locale}/recherche`} className="text-sm text-brand-text font-semibold">
        →
      </a>
    </div>
  );
}
