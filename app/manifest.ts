import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RelNet by ReLead',
    short_name: 'RelNet',
    description: 'Administra tu red privada, nodos y operaciones de ReLead desde cualquier dispositivo.',
    start_url: '/install?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#08101c',
    theme_color: '#08101c',
    lang: 'es-MX',
    categories: ['business', 'productivity', 'utilities']
    // Los iconos se agregarán cuando esté listo el diseño oficial de ReLead Mobile.
  };
}
