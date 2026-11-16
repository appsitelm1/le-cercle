import { getTranslations } from 'next-intl/server';

export default async function MentionsLegalesPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'nav' });
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{t('legal')}</h1>
      <div className="mt-5 flex flex-col gap-3 text-sm leading-relaxed text-text-muted">
        <p>Le site le cercle immobilier est édité par « Le Cercle des Tailleurs ». (Contenu provisoire — informations légales à compléter.)</p>
        <p>Directeur de la publication : à compléter. Hébergeur : à compléter.</p>
        <p>Pour toute question, contactez-nous via la page Contact.</p>
      </div>
    </main>
  );
}
