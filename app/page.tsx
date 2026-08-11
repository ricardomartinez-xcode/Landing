import Link from 'next/link';
import styles from './page.module.css';
import { SectionReveal } from '@/components/SectionReveal';

const consoleUrl = 'https://api.relead.com.mx/console';
const adminUrl = 'https://api.relead.com.mx/admin';

const capabilities = [
  {
    number: '01',
    title: 'Control remoto centralizado',
    body: 'Administra tus equipos desde un solo lugar, con comandos remotos, terminal interactiva persistente y acciones operativas por nodo.',
    tag: 'Control'
  },
  {
    number: '02',
    title: 'Red privada RelNet Mesh',
    body: 'Conecta Windows, Linux y otros equipos dentro de una red privada propia de RelNet para comunicar nodos sin exponer la operación directamente a Internet.',
    tag: 'Mesh'
  },
  {
    number: '03',
    title: 'Archivos y recursos compartidos',
    body: 'Transfiere archivos entre nodos y habilita carpetas o recursos compartidos para trabajar como si los equipos estuvieran en la misma LAN.',
    tag: 'Files'
  },
  {
    number: '04',
    title: 'Nodos de salida',
    body: 'Enruta tráfico a Internet a través de un nodo autorizado cuando necesitas una salida remota controlada desde otra ubicación.',
    tag: 'Exit'
  },
  {
    number: '05',
    title: 'Telemetría y servicios',
    body: 'Consulta estado, memoria, almacenamiento, uptime y servicios del sistema para detectar y resolver incidencias desde el plano central.',
    tag: 'Health'
  },
  {
    number: '06',
    title: 'Automatización remota',
    body: 'Los nodos compatibles pueden exponer automatización de escritorio, Chrome remoto y flujos web para tareas que van más allá de una terminal.',
    tag: 'Automation'
  },
  {
    number: '07',
    title: 'Políticas y acceso',
    body: 'Define quién puede enlazar, operar o utilizar cada recurso. RelNet separa vinculación, aprobación, reautenticación y permisos.',
    tag: 'Policy'
  },
  {
    number: '08',
    title: 'Identidad por nodo',
    body: 'Cada equipo se incorpora con identidad Ed25519, aprobación explícita y capacidades declaradas para mantener control sobre lo que puede operar.',
    tag: 'Identity'
  },
  {
    number: '09',
    title: 'Operación protegida',
    body: 'RelNet incorpora rotación de credenciales, actualizaciones firmadas y leases de comandos para reducir el riesgo de acciones remotas no autorizadas.',
    tag: 'Security'
  }
];

const steps = [
  {
    number: '01',
    title: 'Instala el nodo',
    body: 'Añade RelNet al equipo que quieras incorporar a tu red privada.'
  },
  {
    number: '02',
    title: 'Vincula y aprueba',
    body: 'El nodo obtiene una identidad propia y entra a tu entorno únicamente después de ser autorizado.'
  },
  {
    number: '03',
    title: 'Opera desde Console',
    body: 'Administra conectividad, políticas, sesiones, recursos y telemetría desde una interfaz central.'
  }
];

const securityPoints = [
  'Identidad Ed25519 por nodo',
  'Aprobación explícita de dispositivos',
  'Capacidades y políticas por nodo',
  'Actualizaciones firmadas',
  'Rotación de credenciales',
  'Leases para comandos remotos'
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Navegación principal">
        <div className={`${styles.shell} ${styles.navInner}`}>
          <Link href="#inicio" className={styles.brand} aria-label="Ir al inicio de RelNet">
            <img src="/relnet-brand.webp" alt="RelNet" className={styles.brandLogo} />
          </Link>

          <div className={styles.navLinks}>
            <Link href="#producto">Producto</Link>
            <Link href="#capacidades">Capacidades</Link>
            <Link href="#seguridad">Seguridad</Link>
            <a href={adminUrl} className={styles.navAdmin}>Admin</a>
            <a href={consoleUrl} className={styles.navCta}>Abrir Console <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </nav>

      <section className={styles.hero} id="inicio">
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <SectionReveal className={styles.heroCopy}>
            <span className={styles.eyebrow}>Red privada · control remoto · infraestructura</span>
            <h1>Tu red privada.<br /><span>Tus equipos bajo control.</span></h1>
            <p>
              RelNet conecta tus equipos en una red privada y te da un punto central para administrarlos, mover archivos, aplicar políticas y operar infraestructura remota con menos fricción.
            </p>
            <div className={styles.actions}>
              <a href={consoleUrl} className={styles.buttonPrimary}>Abrir RelNet Console <span aria-hidden="true">↗</span></a>
              <a href={adminUrl} className={styles.buttonSecondary}>Administración</a>
            </div>
            <div className={styles.heroNotes} aria-label="Características principales de RelNet">
              <span>Windows + Linux</span>
              <span>Mesh privado</span>
              <span>Control centralizado</span>
            </div>
          </SectionReveal>

          <SectionReveal className={styles.heroVisual} delay={100}>
            <div className={styles.networkWindow} aria-label="Representación de una red privada RelNet">
              <div className={styles.windowTop}>
                <div className={styles.windowBrand}>
                  <span className={styles.windowDot} /> RelNet Console
                </div>
                <span className={styles.liveBadge}>Private network</span>
              </div>

              <div className={styles.networkCanvas}>
                <div className={`${styles.nodeCard} ${styles.nodeOne}`}>
                  <div className={styles.nodeIcon}>W</div>
                  <div>
                    <span>Latitude</span>
                    <small>Windows node</small>
                  </div>
                  <i className={styles.onlineDot} aria-label="Disponible" />
                </div>

                <div className={`${styles.nodeCard} ${styles.nodeTwo}`}>
                  <div className={`${styles.nodeIcon} ${styles.nodeIconDark}`}>L</div>
                  <div>
                    <span>Server</span>
                    <small>Linux node</small>
                  </div>
                  <i className={styles.onlineDot} aria-label="Disponible" />
                </div>

                <div className={styles.coreNode}>
                  <span className={styles.corePulse} />
                  <strong>RelNet</strong>
                  <small>Private mesh</small>
                </div>

                <div className={`${styles.nodeCard} ${styles.nodeThree}`}>
                  <div className={`${styles.nodeIcon} ${styles.nodeIconRelay}`}>R</div>
                  <div>
                    <span>Relay</span>
                    <small>Secure route</small>
                  </div>
                  <i className={styles.onlineDot} aria-label="Disponible" />
                </div>

                <span className={`${styles.linkLine} ${styles.lineOne}`} />
                <span className={`${styles.linkLine} ${styles.lineTwo}`} />
                <span className={`${styles.linkLine} ${styles.lineThree}`} />
              </div>

              <div className={styles.networkFooter}>
                <div>
                  <span>Acceso</span>
                  <strong>Por políticas</strong>
                </div>
                <div>
                  <span>Operación</span>
                  <strong>Centralizada</strong>
                </div>
                <div>
                  <span>Estado</span>
                  <strong className={styles.healthy}>Protegido</strong>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className={styles.productIntro} id="producto">
        <div className={`${styles.shell} ${styles.productIntroGrid}`}>
          <SectionReveal>
            <span className={styles.eyebrow}>Qué es RelNet</span>
            <h2>Una capa privada entre tú y todos tus equipos.</h2>
          </SectionReveal>
          <SectionReveal delay={90}>
            <p>
              En lugar de administrar cada equipo de forma aislada, RelNet los reúne dentro de un mismo plano de control. Desde ahí puedes decidir qué se conecta, qué puede hacer cada nodo y cómo circulan los recursos entre ellos.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className={styles.capabilitiesSection} id="capacidades">
        <div className={styles.shell}>
          <SectionReveal className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Capacidades</span>
              <h2>Una red que también sabe operar.</h2>
            </div>
            <p>Conectividad privada, administración remota, recursos compartidos y salida a Internet dentro de una misma experiencia.</p>
          </SectionReveal>

          <div className={styles.capabilityGrid}>
            {capabilities.map((capability, index) => (
              <SectionReveal key={capability.title} delay={(index % 3) * 70}>
                <article className={styles.capabilityCard}>
                  <div className={styles.capabilityTop}>
                    <span>{capability.number}</span>
                    <small>{capability.tag}</small>
                  </div>
                  <h3>{capability.title}</h3>
                  <p>{capability.body}</p>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.controlSection}>
        <div className={`${styles.shell} ${styles.controlGrid}`}>
          <SectionReveal className={styles.controlCopy}>
            <span className={styles.eyebrow}>Dos superficies, una sola plataforma</span>
            <h2>Opera la red sin mezclarla con la administración del sistema.</h2>
            <p>
              RelNet separa el trabajo cotidiano sobre nodos del mantenimiento de la plataforma. Así cada interfaz mantiene un propósito claro y un nivel de acceso distinto.
            </p>
          </SectionReveal>

          <div className={styles.accessGrid}>
            <SectionReveal delay={80}>
              <a href={consoleUrl} className={`${styles.accessCard} ${styles.consoleCard}`}>
                <div className={styles.accessCardTop}>
                  <span className={styles.accessLabel}>Operación diaria</span>
                  <span aria-hidden="true">↗</span>
                </div>
                <h3>RelNet Console</h3>
                <p>El centro para vincular, aprobar, reautenticar, pausar y operar nodos; crear políticas y revisar la telemetría de tu LAN privada.</p>
                <ul>
                  <li>Nodos y vinculaciones</li>
                  <li>Políticas RelNet</li>
                  <li>Sesiones y acciones remotas</li>
                  <li>Telemetría de red</li>
                </ul>
                <strong>Ir a Console <span aria-hidden="true">→</span></strong>
              </a>
            </SectionReveal>

            <SectionReveal delay={150}>
              <a href={adminUrl} className={`${styles.accessCard} ${styles.adminCard}`}>
                <div className={styles.accessCardTop}>
                  <span className={styles.accessLabel}>Plataforma</span>
                  <span aria-hidden="true">↗</span>
                </div>
                <h3>Admin</h3>
                <p>El espacio reservado para recuperación del sistema, observabilidad, diagnóstico operativo y promoción controlada de versiones.</p>
                <ul>
                  <li>Salud y observabilidad</li>
                  <li>Recuperación del sistema</li>
                  <li>Releases y promociones</li>
                  <li>Operación administrativa</li>
                </ul>
                <strong>Ir a Admin <span aria-hidden="true">→</span></strong>
              </a>
            </SectionReveal>
          </div>
        </div>
      </section>

      <section className={styles.stepsSection} id="como-funciona">
        <div className={styles.shell}>
          <SectionReveal className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Cómo funciona</span>
              <h2>De equipo aislado a nodo administrado.</h2>
            </div>
            <p>La incorporación es intencional: instalar, autorizar y después operar.</p>
          </SectionReveal>

          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <SectionReveal key={step.title} delay={index * 90}>
                <article className={styles.stepCard}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.securitySection} id="seguridad">
        <div className={`${styles.shell} ${styles.securityCard}`}>
          <SectionReveal className={styles.securityCopy}>
            <span className={styles.eyebrow}>Seguridad por diseño</span>
            <h2>El acceso remoto empieza por saber qué nodo es cuál.</h2>
            <p>
              RelNet trata cada equipo como una identidad independiente y conserva la aprobación, las políticas y la operación como pasos separados. Con identidad Ed25519, actualizaciones firmadas y leases de comandos, conectar un nodo no equivale a darle acceso irrestricto.
            </p>
          </SectionReveal>

          <SectionReveal className={styles.securityList} delay={100}>
            {securityPoints.map((point) => (
              <div key={point}>
                <span aria-hidden="true">✓</span>
                <strong>{point}</strong>
              </div>
            ))}
          </SectionReveal>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={`${styles.shell} ${styles.finalCtaCard}`}>
          <SectionReveal>
            <span className={styles.eyebrow}>RelNet by ReLead</span>
            <h2>Una sola red para llegar a todos tus equipos.</h2>
            <p>Entra a RelNet Console para administrar tu entorno o abre Admin para operar la plataforma.</p>
            <div className={styles.actions}>
              <a href={consoleUrl} className={styles.buttonPrimary}>Abrir RelNet Console <span aria-hidden="true">↗</span></a>
              <a href={adminUrl} className={styles.buttonSecondary}>Abrir Admin</a>
            </div>
          </SectionReveal>
          <SectionReveal className={styles.finalMark} delay={100}>
            <span />
            <span />
            <span />
            <strong>R</strong>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
