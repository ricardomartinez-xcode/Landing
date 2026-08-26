import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './PublicShell.module.css';

const accessUrl = 'https://auth.relead.com.mx/access';

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label="RelNet, inicio">
            <Image
              className={styles.brandLogo}
              src="/relnet-brand-transparent.png"
              alt="RelNet"
              width={420}
              height={185}
              priority
            />
            <span className={styles.brandContext}>by ReLead</span>
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
            <strong>RelNet by ReLead</strong>
            <p>Infraestructura privada y operación remota con una identidad de producto consistente.</p>
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
