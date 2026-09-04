import type { Metadata, Viewport } from 'next';
import { PublicShell } from '@/components/public/PublicShell';
import './globals.css';

const themeInitScript = `(function(){try{var m=localStorage.getItem('relnet-theme')||'system';var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=m==='dark'||m==='light'?m:(dark?'dark':'light');var r=document.documentElement;r.dataset.theme=t;r.dataset.themeMode=m;}catch(e){var r=document.documentElement;r.dataset.theme='light';r.dataset.themeMode='system';}})();`;

export const metadata: Metadata = {
  metadataBase: new URL('https://relnets.com'),
  title: 'RelNets | Secure Infrastructure Workspace',
  description: 'RelNets conecta infraestructura privada, controla accesos y gobierna identidades humanas, de máquinas y de IA desde un solo workspace.',
  keywords: ['RelNets', 'red privada', 'PWA', 'VPN', 'automatización', 'Agent RelNets', 'MCP', 'IA'],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: ['/relnet-mark-transparent.png'],
  },
  openGraph: {
    title: 'RelNets | Secure Infrastructure Workspace',
    description: 'Secure infrastructure. Without boundaries.',
    url: 'https://relnets.com',
    siteName: 'RelNets',
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RelNets',
    description: 'Secure infrastructure. Without boundaries.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d14' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
