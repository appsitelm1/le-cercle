import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Actives au lancement : FR (défaut), AR (RTL), EN, ES.
  locales: ['fr', 'ar', 'en', 'es'],
  defaultLocale: 'fr',
});

export type Locale = (typeof routing.locales)[number];
