import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './PublicShell.module.css';

const CONSOLE_SIGNUP_URL = 'https://console.relnets.com/signup';
const CONSOLE_LOGIN_URL = 'https://console.relnets.com/login';

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label="RelNets, inicio">
            <Image className={styles.brandLogo} src="/relnets-mark.svg" alt="" width={64} height={64} priority />
            <span className={styles.brandCopy}>
              <strong>RelNets</strong>
              <small>Secure Infrastructure Workspace</small>
            </span>
          </Link>
          <nav className={styles.nav} aria-label="Navegación principal">
            <Link href="/#producto">Producto</Link>
            <Link href="/#soluciones">Soluciones</Link>
            <Link href="/#seguridad">Seguridad</Link>
            <Link href="/#planes">Planes</Link>
            <Link href="/install">Instalar</Link>
            <a href={CONSOLE_LOGIN_URL}>Inicia sesión</a>
            <a className={styles.primary} href={CONSOLE_SIGNUP_URL}>Empieza gratis</a>
          </nav>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <div className={styles.inner}>
          <div className={styles.footerBrand}>
            <Image src="/relnets-mark.svg" alt="" width={48} height={48} />
            <div><strong>RelNets</strong><p>Secure Infrastructure Workspace</p></div>
          </div>
          <div className={styles.footerPillars} aria-label="Pilares de marca">
            <span>Secure by Design</span>
            <span>Connected by Intent</span>
            <span>Built to Scale</span>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/privacy">Privacidad</Link>
            <Link href="/terms">Términos</Link>
            <Link href="/FAQs">FAQs</Link>
            <Link href="/install">Instalación</Link>
            <a href={CONSOLE_LOGIN_URL}>Acceso seguro</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
