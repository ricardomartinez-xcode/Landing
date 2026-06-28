import type { Metadata, Viewport } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  metadataBase: new URL('https://relead.com.mx'),
  title: 'ReLead | Productos digitales con claridad',
  description: 'ReLead diseña productos y experiencias digitales claras, útiles y preparadas para crecer.',
  openGraph: {
    title: 'ReLead',
    description: 'Productos digitales con dirección, claridad y espacio para crecer.',
    url: 'https://relead.com.mx',
    siteName: 'ReLead',
    locale: 'es_MX',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReLead',
    description: 'Productos digitales con dirección, claridad y espacio para crecer.'
  }
};

export const viewport: Viewport = { themeColor: '#f8faf7' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${playfair.variable}`}>
        {children}
        <footer className="siteLegalFooter">
          <div className="siteLegalFooterInner">
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
