import type { Metadata, Viewport } from 'next';
import { PublicShell } from '@/components/public/PublicShell';
import './globals.css';

const themeInitScript = `(function(){try{var m=localStorage.getItem('relnet-theme')||'dark';var t=m==='light'?'light':'dark';var r=document.documentElement;r.dataset.theme=t;r.dataset.themeMode=m;}catch(e){var r=document.documentElement;r.dataset.theme='dark';r.dataset.themeMode='dark';}})();`;

export const metadata: Metadata = {
  metadataBase: new URL('https://relnets.com'),
  title: 'RelNets | Secure Infrastructure Workspace',
  description: 'RelNets conecta infraestructura privada, controla accesos y gobierna identidades humanas, de máquinas y de IA desde un solo workspace.',
  keywords: ['RelNets', 'red privada', 'PWA', 'VPN', 'automatización', 'Agent RelNets', 'MCP', 'IA'],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }, { url: '/relnets-mark.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
