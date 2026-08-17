import Link from 'next/link';
import styles from './page.module.css';

const appUrl = 'https://app.relead.com.mx';
const developersUrl = 'https://app.relead.com.mx/developers';

const capabilities = [
  ['Red privada', 'Conecta equipos dentro de RelNet con identidad y políticas por nodo.'],
  ['My RelNet', 'Tu espacio para cuenta, red, dispositivos, recursos y herramientas de acceso.'],
  ['RelDrop y RelShare', 'Flujos de archivos y recursos compartidos entre equipos compatibles.'],
  ['Terminal y SSH', 'Acceso remoto sujeto a identidad, políticas y capacidades del nodo.'],
  ['Mobile', 'Experiencia web/PWA y enrolamiento móvil desde My RelNet.'],
  ['Developers', 'OAuth, MCP y superficies de integración desde un área dedicada para desarrolladores.']
];

const surfaces = [
  { host: 'relead.com.mx', title: 'ReLead', note: 'Información pública, producto, instalación y documentación.', state: 'Público' },
  { host: 'app.relead.com.mx', title: 'My RelNet', note: 'Cuenta, red, dispositivos, RelDrop, RelShare, terminal, mobile y developers.', state: 'Usuarios' },
  { host: 'console.relead.com.mx', title: 'Console', note: 'Administración interna de la plataforma. No forma parte de la experiencia pública de usuario.', state: 'Interno' },
  { host: 'api.relead.com.mx', title: 'API', note: 'Backend, OAuth, MCP y APIs de ReLead. Consumido por las superficies autorizadas.', state: 'Backend' }
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.shell}>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>ReLead · RelNet</span>
              <h1>Tu red privada.<br/><span>Tu experiencia, en My RelNet.</span></h1>
              <p className={styles.lead}>RelNet conecta tus equipos. My RelNet concentra la experiencia para administrar tu cuenta, revisar tu red y trabajar con los recursos habilitados para tus dispositivos, sin mezclar la operación del usuario con la administración interna de la plataforma.</p>
              <div className={styles.actions}>
                <a className={styles.primary} href={appUrl}>Abrir My RelNet <span aria-hidden="true">↗</span></a>
                <Link className={styles.secondary} href="/install">Instalar RelNet</Link>
              </div>
              <div className={styles.heroMeta}>
                <span>Windows + Linux</span><span>Web + PWA</span><span>Red privada</span><span>Acceso por políticas</span>
              </div>
            </div>
            <aside className={styles.architecture} aria-label="Arquitectura de superficies ReLead">
              <div className={styles.architectureHeader}><span>ReLead v90</span><strong>Superficies separadas</strong></div>
              <div className={styles.architectureBody}>
                <div><span className={styles.dot}/><strong>relead.com.mx</strong><small>Información pública</small></div>
                <div><span className={styles.dot}/><strong>app.relead.com.mx</strong><small>My RelNet</small></div>
                <div><span className={styles.dotMuted}/><strong>console.relead.com.mx</strong><small>Administración interna</small></div>
                <div><span className={styles.dotMuted}/><strong>api.relead.com.mx</strong><small>Backend / OAuth / MCP</small></div>
              </div>
              <p>La experiencia pública y de usuario ya no redirige a rutas administrativas bajo la API.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.section} id="producto">
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div><span className={styles.eyebrow}>Producto</span><h2>RelNet conecta. My RelNet organiza.</h2></div>
            <p>Una arquitectura más clara: la red hace el trabajo de conectividad; la aplicación del usuario concentra cuenta, dispositivos y recursos.</p>
          </div>
          <div className={styles.capabilityGrid}>
            {capabilities.map(([title, body], index) => (
              <article className={styles.card} key={title}>
                <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3><p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt} id="accesos">
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div><span className={styles.eyebrow}>Accesos</span><h2>Cada dominio tiene una responsabilidad.</h2></div>
            <p>Los enlaces públicos llevan a la superficie correcta. Console permanece reservada para administración interna.</p>
          </div>
          <div className={styles.surfaceGrid}>
            {surfaces.map((surface) => (
              <article className={styles.surface} key={surface.host}>
                <div className={styles.surfaceTop}><span>{surface.state}</span><code>{surface.host}</code></div>
                <h3>{surface.title}</h3><p>{surface.note}</p>
                {surface.host === 'app.relead.com.mx' ? <a href={appUrl}>Abrir My RelNet →</a> : null}
                {surface.host === 'relead.com.mx' ? <Link href="/install">Ver instalación →</Link> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.split}>
            <div><span className={styles.eyebrow}>Seguridad</span><h2>Identidad y permisos antes que acceso.</h2><p>RelNet separa identidad, vinculación, aprobación y operación. Las acciones dependen de la capacidad del nodo y de la autorización efectiva de la sesión.</p></div>
            <ul className={styles.checks}>
              <li>Identidad por nodo</li><li>Aprobación explícita</li><li>Políticas y capacidades</li><li>Credenciales rotables</li><li>Superficies administrativas aisladas</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.shell}>
          <div className={styles.ctaCard}>
            <div><span className={styles.eyebrow}>Empezar</span><h2>Entra a My RelNet o incorpora un nuevo nodo.</h2><p>My RelNet es el punto de entrada para usuarios. La instalación de RelNet sigue disponible desde la documentación pública.</p></div>
            <div className={styles.actions}><a className={styles.primary} href={appUrl}>Abrir My RelNet</a><Link className={styles.secondary} href="/install">Instalar RelNet</Link><a className={styles.textLink} href={developersUrl}>Developers ↗</a></div>
          </div>
        </div>
      </section>
    </main>
  );
}
