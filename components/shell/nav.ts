export const primaryNav = [
  { href: '/', label: 'Inicio', short: 'IN' },
  { href: '/install', label: 'Instalación', short: 'IS' },
  { href: '/FAQs', label: 'FAQs', short: 'FQ' },
  { href: '/privacy', label: 'Privacidad', short: 'PR' },
  { href: '/terms', label: 'Términos', short: 'TM' },
] as const;

export function routeLabel(pathname: string) {
  return primaryNav.find((item) => item.href === pathname)?.label ?? 'RelNet';
}
