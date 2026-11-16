import { getTranslations } from 'next-intl/server';

export default async function AProposPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'nav' });
  return (
    <main className="bg-pattern min-h-[70vh] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{t('about')}</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-10 items-center">
        {/* Texte */}
        <div className="flex flex-col gap-4 text-sm leading-relaxed">
          <p>
            <strong>le cercle immobilier</strong> est une plateforme internationale qui connecte
            acheteurs, vendeurs, locataires, agents, agences et promoteurs autour d&apos;opportunités
            immobilières sélectionnées avec soin.
          </p>
          <p>
            Notre mission : simplifier l&apos;immobilier grâce à une recherche précise, des annonces
            vérifiées et un accompagnement humain, dans plusieurs langues et plusieurs pays.
          </p>
          <p>
            Chaque bien publié est modéré pour garantir des informations fiables et des photos de
            qualité. Nous réunissons un réseau de professionnels engagés et une communauté de clients
            exigeants.
          </p>
          <p>
            Rejoignez le cercle — achetez, vendez, louez en toute simplicité.
          </p>
        </div>

        {/* Illustration poignée de main (acheteur / vendeur) */}
        <div className="relative aspect-[4/3] flex items-center justify-center">
          <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="p1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f43f5e" />
                <stop offset="1" stopColor="#c00b3c" />
              </linearGradient>
              <linearGradient id="p2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#475569" />
                <stop offset="1" stopColor="#1e293b" />
              </linearGradient>
            </defs>
            {/* ombre au sol (effet 3D) */}
            <ellipse cx="200" cy="278" rx="140" ry="15" fill="#000" opacity="0.10" />

            {/* acheteur (coral) */}
            <circle cx="112" cy="82" r="32" fill="url(#p1)" />
            <path d="M82 126a30 30 0 0 1 60 0v96H82Z" fill="url(#p1)" />
            <path d="M112 150q42 14 84 40" stroke="url(#p1)" strokeWidth="18" strokeLinecap="round" fill="none" />

            {/* vendeur (slate) */}
            <circle cx="288" cy="82" r="32" fill="url(#p2)" />
            <path d="M258 126a30 30 0 0 1 60 0v96h-60Z" fill="url(#p2)" />
            <path d="M288 150q-42 14 -84 40" stroke="url(#p2)" strokeWidth="18" strokeLinecap="round" fill="none" />

            {/* mains serrées */}
            <circle cx="194" cy="190" r="20" fill="#f43f5e" />
            <circle cx="206" cy="190" r="20" fill="#475569" />

            {/* reflets 3D */}
            <ellipse cx="112" cy="70" rx="12" ry="7" fill="#fff" opacity="0.25" />
            <ellipse cx="288" cy="70" rx="12" ry="7" fill="#fff" opacity="0.25" />
          </svg>
        </div>
      </div>
      </div>
    </main>
  );
}
