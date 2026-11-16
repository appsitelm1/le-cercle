import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'le cercle',
    short_name: 'le cercle',
    description:
      'Acheter, vendre, louer en toute simplicité. Plateforme internationale des opportunités immobilières.',
    start_url: '/fr',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#E00B41',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
