import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { PublicShell } from '@/components/public/PublicShell';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL('https://relead.com.mx'),
  title: 'ReLead | RelNet y My RelNet',
  description: 'ReLead conecta tus equipos con RelNet y centraliza la experiencia de usuario en My RelNet: red privada, nodos, acceso remoto, recursos y herramientas para desarrolladores.',
  keywords: ['ReLead', 'RelNet', 'My RelNet', 'red privada', 'control remoto', 'infraestructura remota'],
  openGraph: {
    title: 'ReLead | RelNet y My RelNet',
    description: 'Una red privada para tus equipos y una experiencia clara para operarla.',
    url: 'https://relead.com.mx',
    siteName: 'ReLead',
    locale: 'es_MX',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReLead | RelNet y My RelNet',
    description: 'RelNet conecta tus equipos. My RelNet concentra tu experiencia.'
  }
};

export const viewport: Viewport = {
  themeColor: '#f7f8fa'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={manrope.variable}>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
