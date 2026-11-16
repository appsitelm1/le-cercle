import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Figtree, Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { MobileNav } from '@/components/mobile-nav';
import { ChatWidget } from '@/components/chat-widget';
import { BrandBanner } from '@/components/brand-banner';
import { CurrencyProvider } from '@/lib/currency';
import '@lecercle/ui/tokens.css';
import '../globals.css';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-figtree',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600'],
  variable: '--font-cairo',
  display: 'swap',
});

// Applique le thème mémorisé AVANT le premier rendu (aucun clignotement).
const themeInit = `(function(){try{var t=localStorage.getItem('lecercle-theme');document.documentElement.setAttribute('data-theme', t||'light');}catch(e){}})();`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'hero' });
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `${base}/${params.locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}`])),
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      type: 'website',
      locale: params.locale,
      siteName: 'le cercle',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${figtree.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <SiteHeader />
            <BrandBanner />
            <div className="pb-16 md:pb-0">{children}</div>
            <SiteFooter locale={locale} />
            <MobileNav />
            <ChatWidget />
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
