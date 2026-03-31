import type { Metadata, Viewport } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://relead.vercel.app'),
  title: 'ReLead | Ecosistema digital para marcas que se mueven rápido',
  description:
    'Landing editorial y escalable para presentar el ecosistema Powered by ReLead: productos, apps y experiencias digitales con visión de marca.',
  openGraph: {
    title: 'ReLead',
    description:
      'Diseño, producto y crecimiento para un ecosistema de apps Powered by ReLead.',
    url: 'https://relead.vercel.app',
    siteName: 'ReLead',
    locale: 'es_MX',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReLead',
    description:
      'Landing editorial y escalable para presentar productos Powered by ReLead.'
  }
};

export const viewport: Viewport = {
  themeColor: '#0b1020'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}
