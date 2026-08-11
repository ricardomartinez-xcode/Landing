import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
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

export const viewport: Viewport = { themeColor: '#ffffff' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={manrope.variable}>
        {children}
        <footer className="siteLegalFooter">
          <div className="siteLegalFooterInner">
            <div className="siteLegalBrand">
              <strong>RelNet</strong>
              <span>by ReLead</span>
            </div>
            <span>© {new Date().getFullYear()} ReLead</span>
            <nav aria-label="Enlaces legales">
              <a href="/privacy">Privacidad</a>
              <a href="/terms">Términos</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
