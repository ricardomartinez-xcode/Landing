import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { AppShell } from '@/components/shell/AppShell';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL('https://relead.com.mx'),
  title: 'RelNet by ReLead | Tu red privada bajo control',
  description: 'RelNet conecta y administra tus equipos dentro de una red privada con control remoto, políticas, telemetría, transferencia de archivos y operación centralizada.',
  keywords: ['RelNet', 'ReLead', 'red privada', 'control remoto', 'administración de nodos', 'infraestructura remota'],
  openGraph: {
    title: 'RelNet by ReLead',
    description: 'Tu red privada. Tus equipos bajo control.',
    url: 'https://relead.com.mx',
    siteName: 'RelNet by ReLead',
    locale: 'es_MX',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RelNet by ReLead',
    description: 'Conecta, controla y opera tus equipos desde una red privada.'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f7fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1020' }
  ]
};

const themeBootstrap = `(() => {
  try {
    const stored = localStorage.getItem('relnet-theme');
    const mode = stored === 'light' || stored === 'dark' ? stored : 'system';
    const resolved = mode === 'system'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeMode = mode;
  } catch (_) {}
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body className={manrope.variable}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
