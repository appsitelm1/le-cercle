import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/recherche'];
  return routing.locales.flatMap((locale) =>
    routes.map((r) => ({
      url: `${BASE}/${locale}${r}`,
      lastModified: new Date(),
      changeFrequency: (r === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority: r === '' ? 1 : 0.8,
    })),
  );
}
