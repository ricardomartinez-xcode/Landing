import type { Metadata, Viewport } from 'next';
import { PublicShell } from '@/components/public/PublicShell';
import './globals.css';

const themeInitScript = `(function(){try{var m=localStorage.getItem('relnet-theme')||'system';var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=m==='dark'||m==='light'?m:(dark?'dark':'light');var r=document.documentElement;r.dataset.theme=t;r.dataset.themeMode=m;}catch(e){var r=document.documentElement;r.dataset.theme='light';r.dataset.themeMode='system';}})();`;

export const metadata: Metadata = {
  metadataBase: new URL('https://relnets.com'),
  title: 'RelNets | Network · Relay · Automate',
  description: 'RelNets conecta tus dispositivos, personas y recursos en una red privada simple, segura e inteligente.',
  keywords: ['RelNets', 'red privada', 'PWA', 'VPN', 'automatización', 'Agent RelNets', 'MCP', 'IA'],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: ['/relnet-mark-transparent.png'],
  },
  openGraph: {
    title: 'RelNets | Network · Relay · Automate',
    description: 'Tu red privada, más simple, segura e inteligente.',
    url: 'https://relnets.com',
    siteName: 'RelNets',
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RelNets',
    description: 'Tu red privada, más simple, segura e inteligente.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#05070c' },
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
