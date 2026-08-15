import type { NavIconName } from './NavIcon';

export const primaryNav: ReadonlyArray<{ href: string; label: string; icon: NavIconName }> = [
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/install', label: 'Instalación', icon: 'install' },
  { href: '/FAQs', label: 'FAQs', icon: 'help' },
  { href: '/privacy', label: 'Privacidad', icon: 'privacy' },
  { href: '/terms', label: 'Términos', icon: 'terms' },
];

export function routeLabel(pathname: string) {
  return primaryNav.find((item) => item.href === pathname)?.label ?? 'RelNet';
}
