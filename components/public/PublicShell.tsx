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
            <Image className={styles.brandLogo} src="/relnet-mark-transparent.png" alt="" width={64} height={64} priority />
            <span>RelNets</span>
          </Link>
          <nav className={styles.nav}>
            <Link href="/#producto">Producto</Link>
            <Link href="/#ia">IA</Link>
            <Link href="/#planes">Planes</Link>
            <Link href="/install">Instalar</Link>
            <Link href="/FAQs">FAQs</Link>
            <a href={CONSOLE_LOGIN_URL}>Inicia sesión</a>
            <a className={styles.primary} href={CONSOLE_SIGNUP_URL}>Crea tu cuenta</a>
          </nav>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <div className={styles.inner}>
          <div className={styles.footerBrand}>
            <Image src="/relnet-mark-transparent.png" alt="" width={48} height={48} />
            <div><strong>RelNets</strong><p>Network · Relay · Automate</p></div>
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
