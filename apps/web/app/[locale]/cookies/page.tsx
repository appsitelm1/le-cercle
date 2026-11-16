import { getTranslations } from 'next-intl/server';

export default async function CookiesPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'nav' });
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{t('cookies')}</h1>
      <div className="mt-5 flex flex-col gap-3 text-sm leading-relaxed text-text-muted">
        <p>Cette page décrit l&apos;utilisation des cookies sur le cercle immobilier. (Contenu provisoire — base légale à compléter.)</p>
        <p>Nous utilisons des cookies essentiels au bon fonctionnement du site, ainsi que des cookies de mesure d&apos;audience.</p>
        <p>Vous pouvez configurer vos préférences à tout moment depuis les paramètres de votre navigateur.</p>
      </div>
    </main>
  );
}
