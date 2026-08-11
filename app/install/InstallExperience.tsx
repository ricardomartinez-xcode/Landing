'use client';

import { useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import styles from './install.module.css';

type Platform = 'ios' | 'android' | 'windows' | 'other';

type ShortcutItem = {
  id: string;
  name: string;
  description: string;
  transport: 'RelNet API' | 'SSH';
  siri: string;
  importUrl?: string;
  recipe: string;
};

const CONSOLE_URL = 'https://api.relead.com.mx/console/';

const shortcutImportUrls: Record<string, string | undefined> = {
  status: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_STATUS,
  actions: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_ACTIONS,
  send: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_SEND,
  continue: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_CONTINUE,
  terminal: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_TERMINAL,
  control: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_CONTROL,
};

const SHORTCUTS: ShortcutItem[] = [
  {
    id: 'status',
    name: 'RelNet · Estado',
    description: 'Consulta red, relay y nodos disponibles y muestra un resumen en el iPhone.',
    transport: 'RelNet API',
    siri: 'Estado de RelNet',
    importUrl: shortcutImportUrls.status,
    recipe: `RelNet · Estado\n1. Obtener contenido de URL: POST https://api.relead.com.mx/v1/relnet/query\n2. Header Authorization: Bearer [TOKEN DE DISPOSITIVO RELNET]\n3. JSON: {"operation":"status","parameters":{}}\n4. Extraer state, online_nodes y relay_state.\n5. Mostrar resultado.`,
  },
  {
    id: 'actions',
    name: 'RelNet · Ejecutar acción',
    description: 'Elige nodo y acción para servicios, métricas, Chrome, escritorio u operaciones permitidas.',
    transport: 'RelNet API',
    siri: 'Controlar RelNet',
    importUrl: shortcutImportUrls.actions,
    recipe: `RelNet · Ejecutar acción\n1. Consultar nodos con POST /v1/relnet/query, operation=nodes.\n2. Elegir nodo.\n3. Elegir una acción segura.\n4. POST /v1/relnet/execute con operation=dispatch y los parámetros del nodo.\n5. Si la API responde confirmation_required, pedir confirmación y reenviar con confirmation_token.\n6. Mostrar resultado.`,
  },
  {
    id: 'send',
    name: 'RelNet · Enviar archivo',
    description: 'Recibe archivos desde Compartir y los prepara para enviarlos al nodo elegido mediante RelDrop.',
    transport: 'RelNet API',
    siri: 'Enviar archivo con RelNet',
    importUrl: shortcutImportUrls.send,
    recipe: `RelNet · Enviar archivo\n1. Aceptar Archivos, Imágenes, PDF y URLs desde la hoja Compartir.\n2. Elegir nodo destino.\n3. Preparar RelDrop mediante la API de RelNet.\n4. Confirmar transferencia.\n5. Mostrar destino y estado.`,
  },
  {
    id: 'continue',
    name: 'RelNet · Continuar en dispositivo',
    description: 'Toma la URL que estás viendo y la abre en un nodo compatible con navegador remoto.',
    transport: 'RelNet API',
    siri: 'Continuar con RelNet',
    importUrl: shortcutImportUrls.continue,
    recipe: `RelNet · Continuar en dispositivo\n1. Obtener lo que aparece en pantalla o recibir una URL desde Compartir.\n2. Extraer la primera URL.\n3. Elegir un nodo con capacidad de navegador remoto.\n4. Enviar dispatch por RelNet para abrir la URL.\n5. Mostrar confirmación.`,
  },
  {
    id: 'terminal',
    name: 'RelNet · Terminal',
    description: 'Crea una sesión remota, envía una orden breve y devuelve stdout al iPhone.',
    transport: 'RelNet API',
    siri: 'Terminal de RelNet',
    importUrl: shortcutImportUrls.terminal,
    recipe: `RelNet · Terminal\n1. Elegir nodo.\n2. POST /v1/relnet/execute operation=terminal_create.\n3. Pedir texto al usuario.\n4. Enviar terminal_write.\n5. Consultar terminal_read hasta recibir salida.\n6. Mostrar stdout y ofrecer cerrar sesión.`,
  },
  {
    id: 'control',
    name: 'RelNet · Control',
    description: 'Atajo maestro: primero eliges el nodo, después la categoría y finalmente la acción o comando concreto.',
    transport: 'RelNet API',
    siri: 'Control RelNet',
    importUrl: shortcutImportUrls.control,
    recipe: `RelNet · Control\n1. POST /v1/relnet/query con operation=nodes.\n2. Filtrar nodos activos y mostrar “Elegir de la lista”.\n3. Según capabilities del nodo, mostrar únicamente categorías compatibles: Sistema, Métricas, Servicios, Navegador, Escritorio, Archivos/RelDrop y Terminal.\n4. Mostrar un segundo menú con acciones concretas de la categoría elegida.\n5. Para Terminal, ofrecer comandos predefinidos genéricos y una opción “Comando personalizado”.\n6. Ejecutar por POST /v1/relnet/execute usando dispatch o terminal_create/terminal_write según corresponda.\n7. Si la API responde confirmation_required, mostrar la acción exacta y pedir confirmación antes de reenviar con confirmation_token.\n8. Mostrar o leer en voz alta el resultado.`,
  },
];

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
  const [shortcutStatus, setShortcutStatus] = useState('');

  async function prepareShortcut(item: ShortcutItem) {
    try {
      await navigator.clipboard.writeText(item.recipe);
      setShortcutStatus(`Receta de “${item.name}” copiada. Se abrirá Atajos para crearla mientras queda disponible el enlace firmado de importación.`);
    } catch {
      setShortcutStatus(`Abriendo Atajos para preparar “${item.name}”.`);
    }
    window.location.href = 'shortcuts://create-shortcut';
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image className={styles.brandLogo} src="/relnet-brand.webp" alt="RelNet" width={420} height={202} priority />
        <p className={styles.eyebrow}>RELNET MOBILE</p>
        <h1>Tu red privada, también desde el teléfono.</h1>
        <p className={styles.lead}>
          Instala RelNet Console en iPhone, iPad o Android y añade el kit de Atajos para controlar la red desde Siri, Compartir y automatizaciones de iOS.
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
          <h2>Web App + Atajos</h2>
          <p>Instala RelNet Console y después añade los Atajos de control desde el kit que aparece más abajo.</p>
          <ol className={styles.steps}>
            <li>Abre RelNet Console en Safari e inicia sesión.</li>
            <li>Toca Compartir → “Agregar a Inicio”.</li>
            <li>Vuelve a esta página y abre “Kit de Atajos RelNet”.</li>
            <li>Importa cada atajo disponible.</li>
          </ol>
          <a className={styles.cardButton} href={CONSOLE_URL}>Abrir Console</a>
        </article>

        <article className={`${styles.card} ${platform === 'android' ? styles.detected : ''}`}>
          <div className={styles.cardHeader}>
            <span>Android</span>
            {platform === 'android' ? <small>Este dispositivo</small> : null}
          </div>
          <h2>PWA ahora, APK después</h2>
          <p>Abre RelNet Console en Chrome. La base PWA ya está preparada; el canal APK firmado queda separado para capacidades nativas posteriores.</p>
          <a className={styles.cardButton} href={CONSOLE_URL}>Abrir Console</a>
          <span className={styles.cardState}>APK: estructura prevista; empaquetado final pendiente.</span>
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

      <section className={styles.shortcuts} id="ios-shortcuts">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>KIT DE ATAJOS RELNET</p>
            <h2>Control rápido desde iPhone y Siri.</h2>
          </div>
          <span className={styles.shortcutCount}>{SHORTCUTS.length} atajos</span>
        </div>
        <p className={styles.shortcutLead}>
          Los botones cambian automáticamente a “Importar” cuando existe un enlace de iCloud firmado. Mientras tanto, “Preparar” copia la receta exacta y abre el editor de Atajos; así la página funciona como semi instalador sin exponer el token principal de ReLead.
        </p>
        <div className={styles.shortcutGrid}>
          {SHORTCUTS.map((item) => (
            <article className={styles.shortcutCard} key={item.id}>
              <div className={styles.shortcutMeta}>
                <span>{item.transport}</span>
                <small>“Oye Siri, {item.siri}”</small>
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              {item.importUrl ? (
                <a className={styles.shortcutButton} href={item.importUrl}>Importar en Atajos</a>
              ) : (
                <button className={styles.shortcutButton} type="button" onClick={() => prepareShortcut(item)}>Preparar en Atajos</button>
              )}
            </article>
          ))}
        </div>
        {shortcutStatus ? <p className={styles.shortcutStatus} role="status">{shortcutStatus}</p> : null}
        <p className={styles.shortcutFootnote}>
          Este kit público contiene únicamente atajos genéricos. Los atajos ligados a equipos, IPs, perfiles térmicos u otras configuraciones personales se distribuyen por separado.
        </p>
      </section>

      <section className={styles.capabilities}>
        <p className={styles.eyebrow}>UNA SOLA EXPERIENCIA</p>
        <h2>Preparado para control móvil.</h2>
        <div className={styles.capabilityGrid}>
          <span>Nodos y estado</span>
          <span>RelNet Console</span>
          <span>Admin</span>
          <span>Atajos y Siri</span>
          <span>RelDrop</span>
          <span>Control térmico Latitude</span>
        </div>
      </section>
    </main>
  );
}
