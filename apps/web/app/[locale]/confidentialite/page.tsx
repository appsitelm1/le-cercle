import { getTranslations } from 'next-intl/server';

export default async function ConfidentialitePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'nav' });
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{t('confidentiality')}</h1>
      <div className="mt-5 flex flex-col gap-3 text-sm leading-relaxed text-text-muted">
        <p>Cette page décrit la politique de confidentialité de le cercle immobilier. (Contenu provisoire — base légale à compléter.)</p>
        <p>Nous collectons uniquement les données nécessaires au fonctionnement du service : identité, coordonnées et préférences de recherche.</p>
        <p>Vos données ne sont jamais vendues à des tiers. Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression.</p>
      </div>
    </main>
  );
}
