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
  api: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_API,
  status: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_STATUS,
  actions: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_ACTIONS,
  continue: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_CONTINUE,
  terminal: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_TERMINAL,
  control: process.env.NEXT_PUBLIC_SHORTCUT_RELNET_CONTROL,
};

const SHORTCUTS: ShortcutItem[] = [
  {
    id: 'api',
    name: 'RelNet · API',
    description: 'Atajo base que conecta todos los demás con api.relead.com.mx. El API_TOKEN se pega una sola vez aquí.',
    transport: 'RelNet API',
    siri: 'API de RelNet',
    importUrl: shortcutImportUrls.api,
    recipe: `RelNet · API — CONFIGURACIÓN ÚNICA

Sólo debes editar una cosa: agrega al inicio una acción “Texto” y pega ahí tu API_TOKEN de producción. Renombra su variable mágica como API_TOKEN. No escribas “Bearer” dentro del Texto.

Entrada esperada: un Diccionario con endpoint, operation, parameters y opcionalmente confirmation_token.

1. Acción “Texto”: [PEGA AQUÍ TU API_TOKEN].
2. “Obtener diccionario de Entrada del atajo”.
3. Obtén endpoint, operation, parameters y confirmation_token del diccionario.
4. Si endpoint es query, usa URL https://api.relead.com.mx/v1/relnet/query. Si es execute, usa https://api.relead.com.mx/v1/relnet/execute. Cualquier otro valor: “Detener este atajo”.
5. “Obtener contenido de URL”: método POST. Encabezado Authorization = Bearer [variable API_TOKEN]. Encabezado Accept = application/json. Cuerpo de solicitud = JSON con operation = [operation] y parameters = [parameters]. Si existe confirmation_token, agrega confirmation_token = [confirmation_token].
6. Si la respuesta trae status = confirmation_required, muestra summary con “Mostrar alerta”. Si confirmas, toma confirmation_token de esa respuesta y repite exactamente la misma petición incluyendo ese token. Si cancelas, detén el atajo.
7. Si la respuesta final trae command_id y state es queued, claimed o running: repite hasta 20 veces: “Esperar” 1 segundo; POST a /v1/relnet/query con operation = commands y parameters = {node_id: [node_id original], limit: 50}; busca en items el mismo command_id. Cuando state sea succeeded, failed, expired o cancelled, devuelve ese elemento.
8. “Detener y producir resultado” con la respuesta final.`,
  },
  {
    id: 'status',
    name: 'RelNet · Estado',
    description: 'Consulta el estado de la red, relay y nodos activos usando el atajo base RelNet · API.',
    transport: 'RelNet API',
    siri: 'Estado de RelNet',
    importUrl: shortcutImportUrls.status,
    recipe: `RelNet · Estado

Requisito: haber creado primero “RelNet · API” y haber pegado ahí el API_TOKEN.

1. Crea un “Diccionario”: endpoint=query; operation=status; parameters=Diccionario vacío.
2. “Ejecutar atajo” → RelNet · API, pasando ese Diccionario como entrada.
3. De la respuesta obtén state, relay_state, online_nodes, active_nodes y node_count.
4. Texto sugerido: “RelNet está [state]. Relay [relay_state]. [online_nodes] nodos en línea de [node_count].”
5. Usa “Hablar texto” y después “Detener y producir resultado”.`,
  },
  {
    id: 'actions',
    name: 'RelNet · Ejecutar acción',
    description: 'Selector genérico de nodo y acción para información, métricas, servicios, navegador, escritorio o terminal.',
    transport: 'RelNet API',
    siri: 'Controlar RelNet',
    importUrl: shortcutImportUrls.actions,
    recipe: `RelNet · Ejecutar acción

1. Ejecuta RelNet · API con {endpoint:query, operation:nodes, parameters:{}}.
2. Obtén items. Repite cada item cuyo effective_state sea online y crea una lista con su name. “Elegir de la lista”.
3. Busca en items el elemento cuyo name coincida con la elección y guarda node_id, os_family y capabilities.
4. “Elegir del menú”: Información; Métricas; Servicios; Navegador; Escritorio; Terminal. Muestra sólo opciones presentes en capabilities.
5. Información → {endpoint:execute, operation:dispatch, parameters:{node_id:[ID], capability:system.info, command_operation:read, command_parameters:{}, ttl_seconds:60}}.
6. Métricas → capability=system.metrics y command_operation=read. Producción actual devuelve uptime, disco, memoria libre y datos del entorno; para CPU usa Terminal.
7. Servicios → services/list. Para Estado/Iniciar/Detener/Reiniciar pide el nombre y usa command_operation=status/start/stop/restart con command_parameters={name:[SERVICIO]}.
8. Navegador → pide URL y usa capability=browser.chrome, command_operation=launch, command_parameters={url:[URL]}.
9. Escritorio → elige notepad/calculator/chrome/edge/word/excel/powerpoint y usa capability=desktop.ui_automation, command_operation=launch, command_parameters={app:[APP]}.
10. Terminal → si os_family=windows usa terminal.powershell; si linux usa terminal.shell. Pide el comando y usa command_operation=execute, command_parameters={command:[COMANDO], timeout_seconds:120, max_output_bytes:262144}.
11. Todas las llamadas execute se envían mediante RelNet · API, que gestiona confirmación y espera del resultado.`,
  },
  {
    id: 'continue',
    name: 'RelNet · Continuar en dispositivo',
    description: 'Recibe una URL desde Compartir o la pantalla actual y la abre en un nodo con browser.chrome.',
    transport: 'RelNet API',
    siri: 'Continuar con RelNet',
    importUrl: shortcutImportUrls.continue,
    recipe: `RelNet · Continuar en dispositivo

1. Configura el atajo para recibir URLs desde la hoja Compartir. Si no recibe entrada, usa “Obtener lo que aparece en pantalla” y extrae la primera URL.
2. Ejecuta RelNet · API con {endpoint:query, operation:nodes, parameters:{}}.
3. De items conserva únicamente nodos online cuya lista capabilities contenga browser.chrome.
4. Muestra sus name con “Elegir de la lista” y recupera el node_id correspondiente.
5. Ejecuta RelNet · API con endpoint=execute, operation=dispatch y parameters={node_id:[ID], capability:browser.chrome, command_operation:launch, command_parameters:{url:[URL]}, ttl_seconds:60}.
6. RelNet · API solicitará confirmación si producción la exige y esperará el resultado.
7. Muestra “Página enviada a [name]”.`,
  },
  {
    id: 'terminal',
    name: 'RelNet · Terminal',
    description: 'Ejecuta un comando puntual en Windows o Linux y devuelve la salida al iPhone.',
    transport: 'RelNet API',
    siri: 'Terminal de RelNet',
    importUrl: shortcutImportUrls.terminal,
    recipe: `RelNet · Terminal

1. Consulta nodes mediante RelNet · API y conserva nodos online con terminal.powershell o terminal.shell.
2. Elige el nodo por name y recupera node_id, os_family y capabilities.
3. “Pedir entrada” de tipo Texto: “Comando a ejecutar”.
4. Si capabilities contiene terminal.powershell usa capability=terminal.powershell; de lo contrario terminal.shell.
5. Ejecuta RelNet · API con endpoint=execute, operation=dispatch, parameters={node_id:[ID], capability:[CAPABILITY], command_operation:execute, command_parameters:{command:[TEXTO], timeout_seconds:120, max_output_bytes:262144}, ttl_seconds:180}.
6. El helper gestiona confirmation_required y consulta commands hasta finalizar.
7. Obtén result.stdout, result.stderr y result.exit_code. Muestra stdout; si stderr no está vacío, muéstralo debajo.`,
  },
  {
    id: 'control',
    name: 'RelNet · Control',
    description: 'Atajo maestro: nodo → categoría → acción, usando capacidades reales del nodo.',
    transport: 'RelNet API',
    siri: 'Control RelNet',
    importUrl: shortcutImportUrls.control,
    recipe: `RelNet · Control

1. Consulta nodes mediante RelNet · API. Muestra sólo nodos effective_state=online.
2. Elige name y recupera todo el diccionario del nodo seleccionado.
3. Construye el menú según capabilities: system.info→Sistema; system.metrics→Métricas; services→Servicios; browser.chrome→Navegador; desktop.ui_automation→Escritorio; terminal.powershell/terminal.shell→Terminal.
4. Sistema: system.info/read. Métricas: system.metrics/read.
5. Servicios: services/list; o pide name y ejecuta status/start/stop/restart.
6. Navegador: pide URL y ejecuta browser.chrome/launch.
7. Escritorio: elige app permitida y ejecuta desktop.ui_automation/launch.
8. Terminal: muestra “Comando personalizado”, “CPU” y “Espacio en disco”. Para CPU, si os_family=windows usa: (Get-Counter '\Processor(_Total)\% Processor Time').CounterSamples.CookedValue | ForEach-Object {[math]::Round($_,1)}; si linux usa: top -bn1 | awk '/Cpu\(s\)/ {print 100-$8; exit}'. Ejecuta mediante terminal.powershell o terminal.shell.
9. Envía siempre la operación elegida a RelNet · API. Éste añade Authorization, gestiona confirmation_required y espera comandos asíncronos.
10. Muestra o habla el resultado.`,
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
    window.location.assign('shortcuts://create-shortcut');
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
          Empieza por “RelNet · API”: pega el API_TOKEN de producción una sola vez. Los demás atajos llaman a ese helper y no necesitan guardar el token de nuevo. Los botones cambian a “Importar” cuando exista su enlace firmado de iCloud.
        </p>
        <div className={styles.actions}>
          <a className={styles.secondaryButton} href="/shortcuts/RelNet-iOS-Instrucciones-v2.zip">Descargar instrucciones completas</a>
        </div>
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
          <span>Control por API</span>
          <span>Terminal multiplataforma</span>
        </div>
      </section>
    </main>
  );
}
