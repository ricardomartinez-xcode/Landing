'use client';

import { useSyncExternalStore } from 'react';
import styles from './install.module.css';

type Platform = 'ios' | 'android' | 'windows' | 'other';

const CONSOLE_URL = 'https://api.relead.com.mx/console/';

function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase();
  const touchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  if (/iphone|ipad|ipod/.test(ua) || touchMac) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/windows/.test(ua)) return 'windows';
  return 'other';
}

const subscribeStatic = () => () => {};

export function InstallExperience() {
  const platform = useSyncExternalStore(subscribeStatic, detectPlatform, () => 'other' as Platform);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.brandMark} aria-hidden="true">R</div>
        <p className={styles.eyebrow}>RELNET MOBILE</p>
        <h1>Tu red privada, también desde el teléfono.</h1>
        <p className={styles.lead}>
          Instala la propia RelNet Console en iPhone, iPad o Android. Así la sesión, la navegación y las operaciones permanecen dentro de la experiencia instalada.
        </p>

        <div className={styles.actions}>
          <a className={styles.primaryButton} href={CONSOLE_URL}>Abrir RelNet Console</a>
          <a className={styles.secondaryButton} href="https://api.relead.com.mx/admin/">Abrir Admin</a>
        </div>
      </section>

      <section className={styles.grid} aria-label="Opciones de instalación">
        <article className={`${styles.card} ${platform === 'ios' ? styles.detected : ''}`} id="ios-instructions">
          <div className={styles.cardHeader}>
            <span>iPhone / iPad</span>
            {platform === 'ios' ? <small>Este dispositivo</small> : null}
          </div>
          <h2>Web App de RelNet</h2>
          <p>La instalación se hace sobre RelNet Console, no sobre una página intermedia.</p>
          <ol className={styles.steps}>
            <li>Abre RelNet Console en Safari e inicia sesión.</li>
            <li>Toca el botón Compartir.</li>
            <li>Elige “Agregar a Inicio”.</li>
            <li>Confirma “Agregar”.</li>
          </ol>
          <a className={styles.cardButton} href={CONSOLE_URL}>Abrir Console</a>
        </article>

        <article className={`${styles.card} ${platform === 'android' ? styles.detected : ''}`}>
          <div className={styles.cardHeader}>
            <span>Android</span>
            {platform === 'android' ? <small>Este dispositivo</small> : null}
          </div>
          <h2>PWA ahora, APK después</h2>
          <p>Abre RelNet Console en Chrome. Desde el menú del navegador podrás agregarla a la pantalla de inicio; el canal APK firmado queda separado para capacidades nativas posteriores.</p>
          <a className={styles.cardButton} href={CONSOLE_URL}>Abrir Console</a>
          <span className={styles.cardState}>APK: estructura prevista; empaquetado final pendiente del icono oficial.</span>
        </article>

        <article className={`${styles.card} ${platform === 'windows' ? styles.detected : ''}`}>
          <div className={styles.cardHeader}>
            <span>Windows</span>
            {platform === 'windows' ? <small>Este dispositivo</small> : null}
          </div>
          <h2>Cliente y consola</h2>
          <p>Windows conserva el instalador completo de nodo y también puede abrir la consola web.</p>
          <a className={styles.cardButton} href="https://api.relead.com.mx/admin/">Ir a Admin</a>
        </article>
      </section>

      <section className={styles.capabilities}>
        <p className={styles.eyebrow}>UNA SOLA EXPERIENCIA</p>
        <h2>Preparado para control móvil.</h2>
        <div className={styles.capabilityGrid}>
          <span>Nodos y estado</span>
          <span>RelNet Console</span>
          <span>Admin</span>
          <span>Alertas push</span>
          <span>Autenticación persistente</span>
          <span>Actualización automática</span>
        </div>
        <p className={styles.note}>
          El logotipo y los iconos de instalación se mantienen fuera de esta etapa. La estructura está preparada para agregarlos después sin cambiar la arquitectura móvil.
        </p>
      </section>
    </main>
  );
}
