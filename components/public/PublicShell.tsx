import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './PublicShell.module.css';

const accessUrl = 'https://auth.relead.com.mx/access';

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label="ReLead, inicio">
            <span className={styles.brandMark}>R</span>
            <span>
              <strong>ReLead</strong>
              <small>RelNet</small>
            </span>
          </Link>
          <nav className={styles.nav} aria-label="Navegación principal">
            <Link href="/#producto">Producto</Link>
            <Link href="/#accesos">Accesos</Link>
            <Link href="/install">Instalar</Link>
            <Link href="/FAQs">FAQs</Link>
            <a className={styles.primary} href={accessUrl}>Acceder</a>
          </nav>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <div className={styles.inner}>
          <div>
            <strong>ReLead</strong>
            <p>Infraestructura privada y operación remota con RelNet.</p>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/privacy">Privacidad</Link>
            <Link href="/terms">Términos</Link>
            <Link href="/FAQs">FAQs</Link>
            <a href={accessUrl}>Acceso seguro</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
