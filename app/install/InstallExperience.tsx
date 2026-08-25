'use client';

import { useMemo, useState } from 'react';
import styles from './install.module.css';

type Platform = 'ios' | 'android' | 'windows' | 'linux' | 'other';

const ACCESS_URL = 'https://auth.relead.com.mx/access';
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
    title: 'RelNet + enrolamiento móvil',
    body: [
      'Abre el acceso seguro de ReLead en Safari e inicia sesión.',
      'Desde Mobile inicia el enrolamiento y sigue el flujo generado para tu dispositivo.',
      'Puedes agregar RelNet a Inicio para usarlo como app web.',
      'El kit público de Atajos queda disponible como complemento; no pegues tokens de API manualmente en la landing.'
    ]
  },
  android: {
    title: 'RelNet como PWA',
    body: [
      'Abre el acceso seguro de ReLead en Chrome e inicia sesión.',
      'Usa la sección Mobile para enrolar el dispositivo cuando esté habilitada para tu cuenta.',
      'Instala la experiencia web desde Chrome si tu dispositivo ofrece la opción.'
    ]
  },
  windows: {
    title: 'Nodo RelNet + acceso seguro',
    body: [
      'Instala el Runtime/Node RelNet mediante el paquete correspondiente a tu canal.',
      'Vincula y aprueba el nodo con el flujo autorizado de tu cuenta.',
      'Accede a RelNet después de autenticarte para revisar red, dispositivos y recursos.'
    ]
  },
  linux: {
    title: 'Nodo RelNet para Linux',
    body: [
      'Instala el Runtime/Node RelNet del canal correspondiente.',
      'Completa la vinculación y aprobación del nodo.',
      'Opera los recursos expuestos por ese nodo desde tu sesión autenticada.'
    ]
  },
  other: {
    title: 'Acceso desde navegador',
    body: [
      'Abre el acceso seguro de ReLead con un navegador moderno.',
      'La disponibilidad de funciones nativas depende del Runtime/Node compatible para tu plataforma.',
      'Las integraciones OAuth, API y MCP se autorizan a través del mismo gateway de identidad.'
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
          <p className={styles.eyebrow}>Instalación RelNet</p>
          <h1>Conecta un dispositivo a RelNet.</h1>
          <p className={styles.lead}>
            El acceso a cuenta, red y herramientas protegidas comienza siempre en el gateway de identidad.
          </p>
        </div>
        <div className={styles.headerActions}>
          <a className={styles.primaryButton} href={ACCESS_URL}>Acceso seguro ↗</a>
          <a className={styles.secondaryButton} href={ACCESS_URL}>OAuth / API / MCP ↗</a>
        </div>
      </header>

      <section className={styles.selectorPanel} aria-label="Selector de plataforma">
        <div><span>Plataforma detectada</span><strong>{
          automatic === 'ios' ? 'iPhone / iPad' :
          automatic === 'android' ? 'Android' :
          automatic === 'windows' ? 'Windows' :
          automatic === 'linux' ? 'Linux' : 'Otro dispositivo'
        }</strong></div>
        <label><span>Mostrar instrucciones para</span>
          <select value={selected} onChange={(event) => setSelected(event.target.value as Platform | 'auto')}>
            <option value="auto">Automático</option>
            <option value="ios">iPhone / iPad</option>
            <option value="android">Android</option>
            <option value="windows">Windows</option>
            <option value="linux">Linux</option>
            <option value="other">Otro</option>
          </select>
        </label>
      </section>

      <section className={styles.installGrid}>
        <article className={styles.installPanel}>
          <div className={styles.panelMeta}><span>Ruta recomendada</span><small>{selected === 'auto' ? 'Según este dispositivo' : 'Selección manual'}</small></div>
          <h2>{current.title}</h2>
          <ol>{current.body.map((step) => <li key={step}>{step}</li>)}</ol>
          <div className={styles.panelActions}>
            <a className={styles.primaryButton} href={ACCESS_URL}>Continuar con autenticación</a>
            {platform === 'ios' ? <a className={styles.secondaryButton} href={IOS_GUIDE_URL}>Kit iOS</a> : null}
          </div>
        </article>

        <aside className={styles.helpPanel}>
          <span className={styles.eyebrow}>Arquitectura de acceso</span>
          <h2>Una sola autoridad de identidad.</h2>
          <p>La landing no enlaza directamente a superficies autenticadas. El gateway valida la identidad y el servidor determina el acceso permitido.</p>
          <dl>
            <div><dt>ReLead</dt><dd>Información pública e instalación</dd></div>
            <div><dt>Cuenta</dt><dd>Identidad, red, dispositivos y recursos</dd></div>
            <div><dt>Integraciones</dt><dd>OAuth, API y MCP con autorización por recurso</dd></div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
