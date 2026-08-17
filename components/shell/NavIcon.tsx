import type { ReactNode } from 'react';

export type NavIconName = 'home' | 'install' | 'help' | 'privacy' | 'terms';

const paths: Record<NavIconName, ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9.5V21h13V9.5" /><path d="M9.5 21v-7h5v7" /></>,
  install: <><path d="M12 3v11" /><path d="m8 10 4 4 4-4" /><path d="M5 19h14" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.4 2.4 0 0 1 4.65.85c0 1.7-2.45 2.05-2.45 3.65" /><path d="M12 17h.01" /></>,
  privacy: <><path d="M12 3 5 6v5c0 4.6 2.9 8.1 7 10 4.1-1.9 7-5.4 7-10V6l-7-3Z" /><path d="m9.5 12 1.7 1.7 3.6-3.9" /></>,
  terms: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h4" /><path d="M10 12h5M10 16h5" /></>,
};

export function NavIcon({ name, className }: { name: NavIconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
