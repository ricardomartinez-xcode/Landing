import Link from 'next/link';
import styles from './page.module.css';

const consoleUrl = 'https://api.relead.com.mx/console';
const adminUrl = 'https://api.relead.com.mx/admin';

const capabilities = [
  ['Red', 'Conectividad privada', 'RelNet Mesh', 'Nodos de salida autorizados', 'Recursos compartidos entre nodos'],
  ['Operación', 'Control remoto', 'Comandos y terminal según capacidades', 'Telemetría y servicios', 'Automatización compatible'],
  ['Acceso', 'Identidad y políticas', 'Identidad Ed25519 por nodo', 'Aprobación y reautenticación separadas', 'Políticas por nodo'],
];

const platforms = [
  ['Windows', 'Nodo + Console / Admin', 'Cliente de nodo y web', 'Operaciones remotas según capacidades declaradas.'],
  ['Linux', 'Nodo + Console / Admin', 'Cliente de nodo y web', 'Terminal, servicios y telemetría dependen del runtime y permisos.'],
  ['iPhone / iPad', 'Web App + Atajos', 'Safari, inicio y Siri', 'El kit público usa RelNet · API como helper.'],
  ['Android', 'PWA / Console', 'Chrome y web', 'El APK nativo sigue previsto, no como descarga final publicada.'],
];

const security = ['Identidad Ed25519 por nodo', 'Aprobación explícita', 'Capacidades y políticas', 'Actualizaciones firmadas', 'Rotación de credenciales', 'Leases de comandos'];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>Red privada · control remoto · infraestructura</span>
          <h1>Un plano de control para todos tus equipos.</h1>
          <p>RelNet conecta nodos dentro de una red privada y concentra operación, políticas, telemetría y acceso remoto sin mezclar la operación diaria con la administración del sistema.</p>
          <div className={styles.actions}>
            <a href={consoleUrl} className={styles.primaryAction}>Abrir Console ↗</a>
            <a href={adminUrl} className={styles.secondaryAction}>Abrir Admin ↗</a>
            <Link href="/install" className={styles.secondaryAction}>Instalación</Link>
            <Link href="/FAQs" className={styles.ghostAction}>FAQs</Link>
          </div>
        </div>
        <aside className={styles.systemPanel} aria-label="Resumen de arquitectura RelNet">
          <div className={styles.panelHeader}><span>RelNet Control Plane</span><span className={styles.liveState}><i /> Private network</span></div>
          <div className={styles.topology}>
            <div className={styles.topologyCore}><strong>RelNet</strong><span>Mesh privado</span></div>
            {[
              ['W', 'Windows', 'Nodo administrado'], ['L', 'Linux', 'Nodo administrado'], ['M', 'Mobile', 'Console + Atajos']
            ].map(([code, title, note]) => (
              <div className={styles.topologyNode} key={title}><span className={styles.nodeCode}>{code}</span><div><strong>{title}</strong><small>{note}</small></div><i /></div>
            ))}
          </div>
          <div className={styles.panelMetrics}><div><span>Identidad</span><strong>Por nodo</strong></div><div><span>Acceso</span><strong>Por políticas</strong></div><div><span>Operación</span><strong>Centralizada</strong></div></div>
        </aside>
      </header>

      <section className={styles.statusStrip} aria-label="Características principales">
        {[
          ['01', 'Mesh privado', 'Conectividad entre nodos'], ['02', 'Identidad propia', 'Aprobación explícita'],
          ['03', 'Control remoto', 'Capacidades por nodo'], ['04', 'Mobile', 'Web App y Atajos']
        ].map(([n, title, note]) => <div key={n}><span>{n}</span><strong>{title}</strong><small>{note}</small></div>)}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}><div><span className={styles.kicker}>Plataforma</span><h2>Dos superficies con responsabilidades distintas.</h2></div><p>La operación diaria de la red se mantiene separada de las tareas administrativas de la plataforma.</p></div>
        <div className={styles.surfaceGrid}>
          <a href={consoleUrl} className={styles.surfacePanel}><div className={styles.surfaceTop}><span>Operación diaria</span><span>↗</span></div><h3>RelNet Console</h3><p>Vinculación, aprobación, políticas, sesiones, acciones remotas y telemetría.</p><ul><li>Nodos y estado efectivo</li><li>Políticas y capacidades</li><li>Acciones y sesiones</li></ul></a>
          <a href={adminUrl} className={styles.surfacePanel}><div className={styles.surfaceTop}><span>Administración</span><span>↗</span></div><h3>Admin</h3><p>Observabilidad, recuperación, diagnóstico y mantenimiento controlado.</p><ul><li>Salud y observabilidad</li><li>Recuperación</li><li>Releases y operación administrativa</li></ul></a>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}><div><span className={styles.kicker}>Capacidades</span><h2>Conectividad y operación con jerarquía clara.</h2></div><Link href="/FAQs" className={styles.inlineLink}>Consultar FAQs →</Link></div>
        <div className={styles.capabilityList}>{capabilities.map(([label, title, ...items], index) => <article key={title} className={styles.capabilityRow}><div className={styles.capabilityNumber}>{String(index + 1).padStart(2, '0')}</div><div className={styles.capabilityTitle}><span>{label}</span><h3>{title}</h3></div><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}><div><span className={styles.kicker}>Compatibilidad</span><h2>Tabla legible en escritorio y móvil.</h2></div><p>Las columnas conservan un ancho útil; en móvil se desplazan horizontalmente sin romper texto carácter por carácter.</p></div>
        <div className={styles.tableWrap} role="region" aria-label="Compatibilidad de plataformas" tabIndex={0}>
          <table className={styles.platformTable}><thead><tr><th>Plataforma</th><th>Experiencia</th><th>Acceso</th><th>Notas</th></tr></thead><tbody>{platforms.map(([platform, experience, access, notes]) => <tr key={platform}><th scope="row">{platform}</th><td>{experience}</td><td>{access}</td><td>{notes}</td></tr>)}</tbody></table>
        </div>
      </section>

      <section className={`${styles.section} ${styles.securitySection}`}>
        <div className={styles.securityCopy}><span className={styles.kicker}>Seguridad por diseño</span><h2>Conectar un nodo no significa darle acceso irrestricto.</h2><p>RelNet separa identidad, vinculación, aprobación, reautenticación y permisos. Las acciones dependen de las capacidades del nodo y sus políticas.</p><Link href="/FAQs" className={styles.inlineLink}>Cómo funciona el acceso →</Link></div>
        <div className={styles.securityList}>{security.map(item => <div key={item}><span>✓</span><strong>{item}</strong></div>)}</div>
      </section>

      <section className={styles.getStarted}><div><span className={styles.kicker}>Primeros pasos</span><h2>Instala, vincula y después opera.</h2><p>Elige la experiencia correcta para tu dispositivo desde el workspace de instalación.</p></div><div className={styles.actions}><Link href="/install" className={styles.primaryAction}>Abrir instalación</Link><Link href="/FAQs" className={styles.secondaryAction}>Resolver una duda</Link></div></section>
    </main>
  );
}
