'use client';

import { useState, useSyncExternalStore } from 'react';
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
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'auto'>('auto');
  const activePlatform = selectedPlatform === 'auto' ? platform : selectedPlatform;

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
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Instalación</p>
          <h1>Prepara RelNet para cada dispositivo.</h1>
          <p className={styles.lead}>Selecciona una plataforma para ver la ruta recomendada. La detección automática se conserva, pero puedes cambiarla manualmente.</p>
        </div>
        <div className={styles.headerActions}>
          <a className={styles.primaryButton} href={CONSOLE_URL}>Abrir Console ↗</a>
          <a className={styles.secondaryButton} href="https://api.relead.com.mx/admin/">Abrir Admin ↗</a>
        </div>
      </header>

      <section className={styles.selectorPanel} aria-label="Selector de plataforma">
        <div><span>Plataforma detectada</span><strong>{platform === 'ios' ? 'iPhone / iPad' : platform === 'android' ? 'Android' : platform === 'windows' ? 'Windows' : 'Otro dispositivo'}</strong></div>
        <label><span>Mostrar instrucciones para</span><select value={selectedPlatform} onChange={(event) => setSelectedPlatform(event.target.value as Platform | 'auto')}><option value="auto">Automático</option><option value="ios">iPhone / iPad</option><option value="android">Android</option><option value="windows">Windows</option><option value="other">Otro</option></select></label>
      </section>

      <section className={styles.installGrid}>
        <article className={styles.installPanel}>
          <div className={styles.panelMeta}><span>Ruta recomendada</span><small>{activePlatform === platform ? 'Según este dispositivo' : 'Selección manual'}</small></div>
          <h2>{activePlatform === 'ios' ? 'Web App + Atajos' : activePlatform === 'android' ? 'PWA / Console' : activePlatform === 'windows' ? 'Nodo + superficies web' : 'Acceso web'}</h2>
          {activePlatform === 'ios' ? <ol><li>Abre RelNet Console en Safari e inicia sesión.</li><li>Usa Compartir → “Agregar a Inicio”.</li><li>Descarga las instrucciones del kit de Atajos.</li><li>Configura primero “RelNet · API”.</li></ol> : null}
          {activePlatform === 'android' ? <><p>Abre RelNet Console en Chrome y utiliza la experiencia PWA. El APK nativo sigue como canal previsto y no se presenta aquí como descarga final.</p><ol><li>Abre Console.</li><li>Inicia sesión.</li><li>Instala la experiencia web desde Chrome si está disponible.</li></ol></> : null}
          {activePlatform === 'windows' ? <><p>Windows puede operar como nodo RelNet y acceder a Console y Admin desde la web.</p><ol><li>Abre Admin para las opciones administrativas disponibles.</li><li>Instala o administra el nodo con el flujo correspondiente de tu entorno.</li><li>Vuelve a Console para operación cotidiana.</li></ol></> : null}
          {activePlatform === 'other' ? <p>Usa RelNet Console desde un navegador compatible. Las funciones nativas dependen de que exista un cliente o integración específica para esa plataforma.</p> : null}
          <div className={styles.panelActions}><a className={styles.primaryButton} href={CONSOLE_URL}>Abrir Console</a>{activePlatform === 'ios' ? <a className={styles.secondaryButton} href="/shortcuts/RelNet-iOS-Instrucciones-v2.zip">Instrucciones iOS</a> : null}</div>
        </article>

        <aside className={styles.helpPanel}>
          <span className={styles.eyebrow}>Antes de empezar</span>
          <h2>La capacidad manda.</h2>
          <p>Una acción sólo aparece cuando el nodo está disponible, declara la capacidad necesaria y tu sesión tiene permiso para utilizarla.</p>
          <dl><div><dt>Console</dt><dd>Operación de nodos</dd></div><div><dt>Admin</dt><dd>Plataforma y observabilidad</dd></div><div><dt>Mobile</dt><dd>Web App + flujos compatibles</dd></div></dl>
        </aside>
      </section>

      <section className={styles.shortcuts} id="ios-shortcuts">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Kit de Atajos RelNet</p><h2>Control rápido desde iPhone y Siri.</h2></div><span className={styles.shortcutCount}>{SHORTCUTS.length} atajos</span></div>
        <div className={styles.shortcutNotice}><p>Empieza por <strong>RelNet · API</strong>: el token se configura una sola vez en ese helper. Los demás atajos llaman a esa base.</p><a href="/shortcuts/RelNet-iOS-Instrucciones-v2.zip">Descargar instrucciones →</a></div>
        <div className={styles.shortcutList}>
          {SHORTCUTS.map((item) => <details className={styles.shortcutItem} key={item.id}><summary><div><span>{item.transport}</span><strong>{item.name}</strong><small>“Oye Siri, {item.siri}”</small></div><i>+</i></summary><div className={styles.shortcutBody}><p>{item.description}</p>{item.importUrl ? <a className={styles.shortcutButton} href={item.importUrl}>Importar en Atajos</a> : <button className={styles.shortcutButton} type="button" onClick={() => prepareShortcut(item)}>Preparar en Atajos</button>}</div></details>)}
        </div>
        {shortcutStatus ? <p className={styles.shortcutStatus} role="status">{shortcutStatus}</p> : null}
        <p className={styles.shortcutFootnote}>El kit público contiene atajos genéricos. Configuraciones ligadas a equipos, IPs u otros datos personales se distribuyen por separado.</p>
      </section>
    </main>
  );
}
