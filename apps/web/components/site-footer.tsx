import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LogoMark } from './logo';
import { Icon } from './icons';
import { NewsletterForm } from './newsletter-form';
import { CurrencySelect } from './currency-select';

const LOCALES = ['fr', 'ar', 'en', 'es'] as const;

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const f = await getTranslations({ locale, namespace: 'footer' });

  const links: [string, string][] = [
    ['/recherche?transaction=SALE', t('buy')],
    ['/recherche?transaction=RENT', t('rent')],
    ['/agents', t('agents')],
    ['/agences', t('agencies')],
    ['/promoteurs', t('promoters')],
    ['/a-propos', t('about')],
    ['/contact', t('contact')],
  ];
  const legal: [string, string][] = [
    ['/confidentialite', t('confidentiality')],
    ['/cookies', t('cookies')],
    ['/mentions-legales', t('legal')],
    ['/cgv', t('cgv')],
  ];
  const socials: [string, string][] = [
    ['instagram', 'https://instagram.com'],
    ['facebook', 'https://facebook.com'],
    ['tiktok', 'https://tiktok.com'],
    ['linkedin', 'https://linkedin.com'],
  ];

  return (
    <>
      {/* Pré-footer — newsletter */}
      <section className="bg-pattern border-t border-border-soft">
        <div className="mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex-none">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Icon name="bell" size={22} className="text-brand-text" />
              {f('newsletterTitle')}
            </h2>
            <p className="text-sm text-text-muted mt-1">{f('newsletterSubtitle')}</p>
          </div>
          <div className="flex-1 w-full">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Footer principal */}
      <footer className="bg-bg-deep border-t border-border-soft">
        <div className="mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-8">
          {/* Colonne 1 — marque */}
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-2 text-brand font-bold tracking-tight">
              <LogoMark size={22} />
              {t('brand')}
            </Link>
            <p className="text-sm text-text-muted mt-3 max-w-xs">{f('tagline')}</p>
            <div className="flex gap-2 mt-4">
              {socials.map(([icon, href]) => (
                <a key={icon} href={href} target="_blank" rel="noreferrer" aria-label={icon} className="iconbtn w-9 h-9 group">
                  <Icon name={icon} size={18} className="text-brand-text transition-transform duration-500 group-hover:rotate-[360deg]" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonne 2 — navigation */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-text-muted mb-3 flex items-center gap-2">
              <Icon name="menu" size={16} className="text-brand-text" />
              {f('navTitle')}
            </h3>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {links.map(([href, label]) => (
                <Link key={href} href={`/${locale}${href}`} className="text-text hover:text-brand-text">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Colonne 3 — contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-text-muted mb-3 flex items-center gap-2">
              <Icon name="mail" size={16} className="text-brand-text" />
              {f('contactTitle')}
            </h3>
            <div className="flex flex-col gap-2.5 text-sm text-text-muted">
              <div className="flex items-start gap-2.5">
                <Icon name="pin" size={17} className="text-brand-text flex-none mt-0.5" />
                <span>{f('address')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Icon name="phone" size={17} className="text-brand-text flex-none" />
                <span dir="ltr">{f('phone')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Icon name="mail" size={17} className="text-brand-text flex-none" />
                <span>{f('email')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barre basse — légal + langue + devise + copyright */}
        <div className="border-t border-border-soft">
          <div className="mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <nav className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
              {legal.map(([href, label]) => (
                <Link key={href} href={`/${locale}${href}`} className="hover:text-text">
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Langue */}
              <details className="relative">
                <summary className="inline-flex items-center gap-1 text-[13px] font-semibold list-none cursor-pointer text-text hover:text-brand-text">
                  <Icon name="globe" size={15} />
                  {locale.toUpperCase()}
                  <span className="text-text-muted text-xs">▾</span>
                </summary>
                <div className="absolute right-0 bottom-full mb-1 bg-surface border border-border shadow-1 py-1 z-50 min-w-[120px]" dir="ltr">
                  {LOCALES.map((l) => (
                    <Link
                      key={l}
                      href={`/${l}`}
                      className={`block px-3 py-1.5 text-sm ${l === locale ? 'text-brand-text font-semibold' : 'text-text'}`}
                    >
                      {l.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </details>

              {/* Devise */}
              <CurrencySelect dropUp plain />
            </div>

            <span className="text-xs text-text-muted">{t('brand')} · © 2026 · {t('rights')}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
