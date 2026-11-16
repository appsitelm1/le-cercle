import { getTranslations } from 'next-intl/server';

export default async function CgvPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'nav' });
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{t('cgv')}</h1>
      <div className="mt-5 flex flex-col gap-3 text-sm leading-relaxed text-text-muted">
        <p>Conditions générales de vente et d&apos;utilisation de le cercle immobilier. (Contenu provisoire — base légale à compléter.)</p>
        <p>Le service met en relation acheteurs, vendeurs, locataires et professionnels de l&apos;immobilier.</p>
        <p>Les annonces publiées restent sous la responsabilité de leurs auteurs.</p>
      </div>
    </main>
  );
}
