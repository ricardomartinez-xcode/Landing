'use client';

import { useMemo, useState } from 'react';
import styles from './install.module.css';

type Platform = 'ios' | 'android' | 'windows' | 'linux' | 'other';

const MY_RELNET_URL = 'https://app.relead.com.mx/';
const DEVELOPERS_URL = 'https://app.relead.com.mx/developers';
const IOS_GUIDE_URL = '/shortcuts/RelNet-iOS-Instrucciones-v2.zip';

function detectedPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent.toLowerCase();
  const touchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  if (/iphone|ipad|ipod/.test(ua) || touchMac) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/windows/.test(ua)) return 'windows';
  if (/linux/.test(ua)) return 'linux';
  return 'other';
}

const instructions: Record<Platform, { title: string; body: string[] }> = {
  ios: {
    title: 'My RelNet + enrolamiento móvil',
    body: [
      'Abre My RelNet en Safari e inicia sesión.',
      'Desde Mobile inicia el enrolamiento y sigue el flujo generado para tu dispositivo.',
      'Puedes agregar My RelNet a Inicio para usarlo como app web.',
      'El kit público de Atajos queda disponible como complemento; no pegues tokens de API manualmente en la landing.'
    ]
  },
  android: {
    title: 'My RelNet como PWA',
    body: [
      'Abre My RelNet en Chrome e inicia sesión.',
      'Usa la sección Mobile para enrolar el dispositivo cuando esté habilitada para tu cuenta.',
      'Instala la experiencia web desde Chrome si tu dispositivo ofrece la opción.'
    ]
  },
  windows: {
    title: 'Nodo RelNet + My RelNet',
    body: [
      'Instala el Runtime/Node RelNet mediante el paquete correspondiente a tu canal.',
      'Vincula y aprueba el nodo con el flujo autorizado de tu cuenta.',
      'Usa My RelNet para revisar red, dispositivos y recursos disponibles para el nodo.'
    ]
  },
  linux: {
    title: 'Nodo RelNet para Linux',
    body: [
      'Instala el Runtime/Node RelNet del canal correspondiente.',
      'Completa la vinculación y aprobación del nodo.',
      'Opera los recursos expuestos por ese nodo desde My RelNet según sus capacidades.'
    ]
  },
  other: {
    title: 'Acceso desde navegador',
    body: [
      'Abre My RelNet con un navegador moderno.',
      'La disponibilidad de funciones nativas depende del Runtime/Node compatible para tu plataforma.',
      'Consulta Developers para OAuth, MCP y superficies de integración.'
    ]
  }
};

export function InstallExperience() {
  const automatic = useMemo(() => detectedPlatform(), []);
  const [selected, setSelected] = useState<Platform | 'auto'>('auto');
  const platform = selected === 'auto' ? automatic : selected;
  const current = instructions[platform];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Instalación v90</p>
          <h1>Conecta un dispositivo a RelNet.</h1>
          <p className={styles.lead}>La experiencia de usuario parte de My RelNet. La instalación del Runtime/Node y el enrolamiento móvil se mantienen separados de la consola administrativa interna.</p>
        </div>
        <div className={styles.headerActions}>
          <a className={styles.primaryButton} href={MY_RELNET_URL}>Abrir My RelNet ↗</a>
          <a className={styles.secondaryButton} href={DEVELOPERS_URL}>Developers ↗</a>
        </div>
      </header>

      <section className={styles.selectorPanel} aria-label="Selector de plataforma">
        <div><span>Plataforma detectada</span><strong>{automatic === 'ios' ? 'iPhone / iPad' : automatic === 'android' ? 'Android' : automatic === 'windows' ? 'Windows' : automatic === 'linux' ? 'Linux' : 'Otro dispositivo'}</strong></div>
        <label><span>Mostrar instrucciones para</span>
          <select value={selected} onChange={(event) => setSelected(event.target.value as Platform | 'auto')}>
            <option value="auto">Automático</option><option value="ios">iPhone / iPad</option><option value="android">Android</option><option value="windows">Windows</option><option value="linux">Linux</option><option value="other">Otro</option>
          </select>
        </label>
      </section>

      <section className={styles.installGrid}>
        <article className={styles.installPanel}>
          <div className={styles.panelMeta}><span>Ruta recomendada</span><small>{selected === 'auto' ? 'Según este dispositivo' : 'Selección manual'}</small></div>
          <h2>{current.title}</h2>
          <ol>{current.body.map((step) => <li key={step}>{step}</li>)}</ol>
          <div className={styles.panelActions}>
            <a className={styles.primaryButton} href={MY_RELNET_URL}>Continuar en My RelNet</a>
            {platform === 'ios' ? <a className={styles.secondaryButton} href={IOS_GUIDE_URL}>Kit iOS</a> : null}
          </div>
        </article>

        <aside className={styles.helpPanel}>
          <span className={styles.eyebrow}>Arquitectura actual</span>
          <h2>Cada superficie tiene una función.</h2>
          <p>La landing ya no redirige usuarios hacia rutas administrativas bajo la API.</p>
          <dl>
            <div><dt>ReLead</dt><dd>Información pública e instalación</dd></div>
            <div><dt>My RelNet</dt><dd>Cuenta, red, dispositivos y recursos</dd></div>
            <div><dt>Developers</dt><dd>OAuth, MCP e integraciones</dd></div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
