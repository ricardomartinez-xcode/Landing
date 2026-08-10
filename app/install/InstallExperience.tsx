'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import styles from './install.module.css';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type Platform = 'ios' | 'android' | 'windows' | 'other';

function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase();
  const touchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  if (/iphone|ipad|ipod/.test(ua) || touchMac) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/windows/.test(ua)) return 'windows';
  return 'other';
}

function isStandalone() {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true;
}

const subscribeStatic = () => () => {};

function subscribeStandalone(callback: () => void) {
  const media = window.matchMedia('(display-mode: standalone)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

export function InstallExperience() {
  const platform = useSyncExternalStore(subscribeStatic, detectPlatform, () => 'other' as Platform);
  const standalone = useSyncExternalStore(subscribeStandalone, isStandalone, () => false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [appInstalled, setAppInstalled] = useState(false);
  const [message, setMessage] = useState('');
  const installed = standalone || appInstalled;

  useEffect(() => {

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    const onInstalled = () => {
      setAppInstalled(true);
      setInstallPrompt(null);
      setMessage('RelNet quedó instalado en este dispositivo.');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const platformName = platform === 'ios' ? 'iPhone / iPad' : platform === 'android' ? 'Android' : platform === 'windows' ? 'Windows' : 'este dispositivo';

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setMessage('Instalación iniciada. RelNet aparecerá entre tus aplicaciones.');
    }
    setInstallPrompt(null);
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.brandMark} aria-hidden="true">R</div>
        <p className={styles.eyebrow}>RELNET MOBILE</p>
        <h1>Tu red privada, también desde el teléfono.</h1>
        <p className={styles.lead}>
          Instala RelNet sin depender de una tienda de aplicaciones y conserva acceso directo a tu consola, nodos y operaciones.
        </p>

        <div className={styles.actions}>
          {installed ? (
            <span className={styles.installedBadge}>Instalado en {platformName}</span>
          ) : installPrompt ? (
            <button className={styles.primaryButton} onClick={install} type="button">
              Instalar RelNet
            </button>
          ) : platform === 'ios' ? (
            <a className={styles.primaryButton} href="#ios-instructions">Ver cómo instalar en iPhone</a>
          ) : (
            <span className={styles.pendingBadge}>Base PWA preparada; falta el icono oficial para habilitar la promoción completa</span>
          )}
          <a className={styles.secondaryButton} href="https://api.relead.com.mx/console">
            Abrir RelNet Console
          </a>
        </div>
        {message ? <p className={styles.status}>{message}</p> : null}
      </section>

      <section className={styles.grid} aria-label="Opciones de instalación">
        <article className={`${styles.card} ${platform === 'ios' ? styles.detected : ''}`} id="ios-instructions">
          <div className={styles.cardHeader}>
            <span>iPhone / iPad</span>
            {platform === 'ios' ? <small>Este dispositivo</small> : null}
          </div>
          <h2>Web App de RelNet</h2>
          <p>Se ejecuta en modo independiente y queda accesible desde la pantalla de inicio.</p>
          <ol className={styles.steps}>
            <li>Abre esta página en Safari.</li>
            <li>Toca el botón Compartir.</li>
            <li>Elige “Agregar a Inicio”.</li>
            <li>Confirma “Agregar”.</li>
          </ol>
        </article>

        <article className={`${styles.card} ${platform === 'android' ? styles.detected : ''}`}>
          <div className={styles.cardHeader}>
            <span>Android</span>
            {platform === 'android' ? <small>Este dispositivo</small> : null}
          </div>
          <h2>PWA ahora, APK después</h2>
          <p>La PWA queda preparada para Chrome. El canal APK firmado permanecerá separado para capacidades nativas de Android.</p>
          {installPrompt ? (
            <button className={styles.cardButton} onClick={install} type="button">Instalar PWA</button>
          ) : (
            <span className={styles.cardState}>PWA preparada; promoción automática pendiente de iconos oficiales</span>
          )}
          <span className={styles.cardState}>APK: estructura prevista; empaquetado final pendiente del icono oficial</span>
        </article>

        <article className={`${styles.card} ${platform === 'windows' ? styles.detected : ''}`}>
          <div className={styles.cardHeader}>
            <span>Windows</span>
            {platform === 'windows' ? <small>Este dispositivo</small> : null}
          </div>
          <h2>Cliente y consola</h2>
          <p>Windows conserva el instalador completo de nodo y puede usar también la experiencia web instalable.</p>
          <a className={styles.cardButton} href="https://api.relead.com.mx/admin">Ir a Admin</a>
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
          El logotipo y los iconos de instalación no se incluyen todavía. El manifest y la estructura quedaron listos para agregarlos sin cambiar la arquitectura.
        </p>
      </section>
    </main>
  );
}
