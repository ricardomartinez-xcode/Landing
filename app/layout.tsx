import type { Metadata, Viewport } from 'next';
import { PublicShell } from '@/components/public/PublicShell';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://relead.com.mx'),
  title: 'RelNet | Private network by ReLead',
  description: 'RelNet conecta tus equipos en una red privada y concentra nodos, acceso remoto y operación segura bajo una sola identidad.',
  keywords: ['RelNet', 'ReLead', 'red privada', 'control remoto', 'infraestructura remota'],
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png' }]
  },
  openGraph: {
    title: 'RelNet | Private network by ReLead',
    description: 'Una red privada para tus equipos y una experiencia clara para operarla.',
    url: 'https://relead.com.mx',
    siteName: 'RelNet by ReLead',
    locale: 'es_MX',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RelNet | Private network by ReLead',
    description: 'RelNet conecta tus equipos y concentra tu experiencia de red privada.'
  }
};

export const viewport: Viewport = {
  themeColor: '#f7f8fa'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
