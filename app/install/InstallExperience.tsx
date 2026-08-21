'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './install.module.css';

type Platform = 'windows' | 'linux' | 'other';
const CONSOLE_URL = 'https://console.relead.com.mx/';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent.toLowerCase();
  if (/windows/.test(ua)) return 'windows';
  if (/linux/.test(ua) && !/android/.test(ua)) return 'linux';
  return 'other';
}

const guides = {
  windows: {
    title: 'RelNet Next para Windows',
    status: 'BLOCKER · paquete final pendiente',
    body: [
      'La superficie pública está preparada para el instalador firmado de RelNet Next.',
      'El nombre, URL y comando final del paquete todavía no están congelados; no publicamos una receta provisional.',
      'Cuando el paquete de release sea aceptado, esta página podrá enlazar únicamente el artefacto e instrucciones verificadas.'
    ]
  },
  linux: {
    title: 'RelNet Next para Linux',
    status: 'BLOCKER · canal final pendiente',
    body: [
      'La superficie pública está preparada para el canal Linux aceptado de RelNet Next.',
      'El bootstrap, repositorio, firma y URL finales todavía no están congelados; no publicamos comandos internos como instrucciones públicas.',
      'Cuando el canal sea aceptado, esta página publicará únicamente el flujo y verificación aprobados.'
    ]
  },
  other: {
    title: 'Selecciona Windows o Linux',
    status: 'Sin instalador público adicional congelado',
    body: [
      'La documentación pública de instalación se prepara para Windows y Linux.',
      'No publicamos una descarga o comando hasta que el artefacto y su ciclo de vida estén aceptados.'
    ]
  }
} as const;

export function InstallExperience() {
  const automatic = useMemo(() => detectPlatform(), []);
  const [selected, setSelected] = useState<Platform | 'auto'>('auto');
  const platform = selected === 'auto' ? automatic : selected;
  const current = guides[platform];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>RelNet Next · instalación</p>
          <h1>Instala sólo desde un canal aceptado.</h1>
          <p className={styles.lead}>Windows y Linux están preparados como superficies públicas, pero no publicamos comandos ni artefactos antes de que el release correspondiente quede congelado.</p>
        </div>
        <div className={styles.headerActions}>
          <a className={styles.primaryButton} href={CONSOLE_URL}>Abrir Console ↗</a>
          <Link className={styles.secondaryButton} href="/pricing">Ver Pricing</Link>
        </div>
      </header>

      <section className={styles.selectorPanel} aria-label="Selector de plataforma">
        <div><span>Plataforma detectada</span><strong>{automatic === 'windows' ? 'Windows' : automatic === 'linux' ? 'Linux' : 'Otra plataforma'}</strong></div>
        <label><span>Mostrar documentación para</span><select value={selected} onChange={(event) => setSelected(event.target.value as Platform | 'auto')}><option value="auto">Automático</option><option value="windows">Windows</option><option value="linux">Linux</option><option value="other">Otra plataforma</option></select></label>
      </section>

      <section className={styles.installGrid}>
        <article className={styles.installPanel}>
          <div className={styles.panelMeta}><span>Canal público</span><small>{selected === 'auto' ? 'Según este dispositivo' : 'Selección manual'}</small></div>
          <h2>{current.title}</h2>
          <p>{current.status}</p>
          <ol>{current.body.map((step) => <li key={step}>{step}</li>)}</ol>
          <div className={styles.panelActions}><Link className={styles.secondaryButton} href="/FAQs">FAQs</Link><Link className={styles.secondaryButton} href="/pricing">Planes</Link></div>
        </article>
        <aside className={styles.helpPanel}>
          <span className={styles.eyebrow}>Dominios canónicos</span>
          <h2>Web pública, Console y API permanecen separadas.</h2>
          <dl>
            <div><dt>Web</dt><dd>relead.com.mx · producto, Pricing, instalación y FAQs</dd></div>
            <div><dt>Console</dt><dd>console.relead.com.mx · experiencia autenticada</dd></div>
            <div><dt>API</dt><dd>api.relead.com.mx · interfaz de servicio</dd></div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
