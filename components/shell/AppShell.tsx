'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeControl } from '@/components/theme/ThemeControl';
import { NavIcon } from './NavIcon';
import { primaryNav, routeLabel } from './nav';
import styles from './AppShell.module.css';

const accessUrl = 'https://auth.relnets.com/access';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname.toLowerCase() === href.toLowerCase();
  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`} aria-label="Navegación de RelNets">
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brand} onClick={() => setMobileOpen(false)} aria-label="RelNets, inicio">
            <Image className={styles.brandMark} src="/relnets-mark.svg" alt="" aria-hidden="true" width={64} height={64} priority />
            <span className={styles.brandCopy}><strong>RelNets</strong><small>Secure Infrastructure Workspace</small></span>
          </Link>
          <button className={styles.mobileClose} type="button" onClick={() => setMobileOpen(false)} aria-label="Cerrar navegación">×</button>
        </div>
        <div className={styles.environment}>
          <span className={styles.environmentDot} aria-hidden="true" />
          <div><strong>RelNets</strong><small>Secure Infrastructure Workspace</small></div>
        </div>
        <nav className={styles.nav} aria-label="Rutas principales">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ''}`}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <span className={styles.navGlyph} aria-hidden="true">
                <NavIcon name={item.icon} />
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <span className={styles.sidebarCaption}>Acceso seguro</span>
          <a href={accessUrl} className={styles.externalLink} aria-label="Ingresar a RelNet">
            <span className={styles.externalLabel}>Ingresar</span><span className={styles.externalGlyph} aria-hidden="true">↗</span>
          </a>
        </div>
      </aside>
      {mobileOpen ? <button className={styles.backdrop} aria-label="Cerrar navegación" onClick={() => setMobileOpen(false)} /> : null}
      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.topbarContext}>
            <button className={styles.menuButton} type="button" onClick={() => setMobileOpen(true)} aria-label="Abrir navegación" aria-expanded={mobileOpen}>
              <span /><span /><span />
            </button>
            <div>
              <span className={styles.breadcrumb}>relnets.com</span>
              <strong>{routeLabel(pathname)}</strong>
            </div>
          </div>
          <div className={styles.topbarActions}>
            <span className={styles.status}><i aria-hidden="true" /> Plataforma</span>
            <ThemeControl />
          </div>
        </header>
        <div className={styles.content}>{children}</div>

        <footer className={styles.footer}>
          <span>© {new Date().getFullYear()} RelNets</span>
          <div>
            <Link href="/privacy">Privacidad</Link>
            <Link href="/terms">Términos</Link>
            <Link href="/FAQs">FAQs</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
