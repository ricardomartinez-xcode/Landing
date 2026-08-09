import Link from 'next/link';
import styles from './page.module.css';
import { SectionReveal } from '@/components/SectionReveal';

const consoleUrl = 'https://api.relead.com.mx/console';
const adminUrl = 'https://api.relead.com.mx/admin';

const capabilities = [
  {
    number: '01',
    title: 'Terminal interactiva',
    body: 'Abre sesiones remotas persistentes y trabaja con PowerShell en Windows o shell en Linux desde un mismo plano de control.',
    tag: 'Terminal'
  },
  {
    number: '02',
    title: 'Telemetría del sistema',
    body: 'Consulta estado, memoria, almacenamiento, uptime y señales operativas para saber qué ocurre en cada nodo sin entrar equipo por equipo.',
    tag: 'Metrics'
  },
  {
    number: '03',
    title: 'Servicios remotos',
    body: 'Inspecciona y opera servicios del sistema desde RelNet para resolver tareas de mantenimiento y soporte de forma centralizada.',
    tag: 'Services'
  },
  {
    number: '04',
    title: 'Automatización de escritorio y navegador',
    body: 'Los nodos compatibles pueden exponer automatización de escritorio, Chrome remoto y flujos web para tareas que van más allá de una terminal.',
    tag: 'Automation'
  },
  {
    number: '05',
    title: 'Identidad por nodo',
    body: 'Cada equipo se incorpora con identidad Ed25519, aprobación explícita y capacidades declaradas para mantener control sobre lo que puede operar.',
    tag: 'Identity'
  },
  {
    number: '06',
    title: 'Operación protegida',
    body: 'RelNet incorpora rotación de credenciales, actualizaciones firmadas y leases de comandos para reducir el riesgo de acciones remotas no autorizadas.',
    tag: 'Security'
  }
];

const roadmap = [
  {
    title: 'RelNet Mesh',
    body: 'Una capa de red propia para conectar nodos directamente y reducir dependencias externas en la conectividad privada.',
    tag: 'En desarrollo'
  },
  {
    title: 'RelNet Files',
    body: 'Transferencia de archivos entre nodos y recursos compartidos para trabajar con carpetas remotas dentro de la red RelNet.',
    tag: 'Roadmap'
  },
  {
    title: 'Exit Nodes',
    body: 'Rutas autorizadas para usar un nodo como salida a Internet cuando una operación necesite presencia de red en otra ubicación.',
    tag: 'Roadmap'
  }
];

const steps = [
  {
    number: '01',
    title: 'Instala el nodo',
    body: 'Añade RelNet al equipo que quieras incorporar a tu entorno administrado.'
  },
  {
    number: '02',
    title: 'Vincula y aprueba',
    body: 'El nodo obtiene una identidad propia y entra a tu entorno únicamente después de ser autorizado.'
  },
  {
    number: '03',
    title: 'Opera desde Console',
    body: 'Administra nodos, sesiones, servicios y telemetría desde una interfaz central.'
  }
];

const securityPoints = [
  'Identidad Ed25519 por nodo',
  'Aprobación explícita de dispositivos',
  'Capacidades declaradas por nodo',
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
            <span className={styles.brandMark} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className={styles.brandText}>
              <strong>RelNet</strong>
              <small>by ReLead</small>
            </span>
          </Link>

          <div className={styles.navLinks}>
            <Link href="#producto">Producto</Link>
            <Link href="#capacidades">Capacidades</Link>
            <Link href="#roadmap">Roadmap</Link>
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
              RelNet conecta tus equipos dentro de un entorno administrado y te da un punto central para abrir terminales, revisar telemetría, operar servicios y automatizar tareas remotas con menos fricción.
            </p>
            <div className={styles.actions}>
              <a href={consoleUrl} className={styles.buttonPrimary}>Abrir RelNet Console <span aria-hidden="true">↗</span></a>
              <a href={adminUrl} className={styles.buttonSecondary}>Administración</a>
            </div>
            <div className={styles.heroNotes} aria-label="Características principales de RelNet">
              <span>Windows + Linux</span>
              <span>Terminal interactiva</span>
              <span>Identidad por nodo</span>
            </div>
          </SectionReveal>

          <SectionReveal className={styles.heroVisual} delay={100}>
            <div className={styles.networkWindow} aria-label="Representación de un entorno administrado por RelNet">
              <div className={styles.windowTop}>
                <div className={styles.windowBrand}>
                  <span className={styles.windowDot} /> RelNet Console
                </div>
                <span className={styles.liveBadge}>Managed network</span>
              </div>

              <div className={styles.networkCanvas}>
                <div className={`${styles.nodeCard} ${styles.nodeOne}`}>
                  <div className={styles.nodeIcon}>W</div>
                  <div>
                    <span>Windows</span>
                    <small>PowerShell node</small>
                  </div>
                  <i className={styles.onlineDot} aria-label="Disponible" />
                </div>

                <div className={`${styles.nodeCard} ${styles.nodeTwo}`}>
                  <div className={`${styles.nodeIcon} ${styles.nodeIconDark}`}>L</div>
                  <div>
                    <span>Linux</span>
                    <small>Shell node</small>
                  </div>
                  <i className={styles.onlineDot} aria-label="Disponible" />
                </div>

                <div className={styles.coreNode}>
                  <span className={styles.corePulse} />
                  <strong>RelNet</strong>
                  <small>Control plane</small>
                </div>

                <div className={`${styles.nodeCard} ${styles.nodeThree}`}>
                  <div className={`${styles.nodeIcon} ${styles.nodeIconRelay}`}>C</div>
                  <div>
                    <span>Chrome</span>
                    <small>Remote automation</small>
                  </div>
                  <i className={styles.onlineDot} aria-label="Disponible" />
                </div>

                <span className={`${styles.linkLine} ${styles.lineOne}`} />
                <span className={`${styles.linkLine} ${styles.lineTwo}`} />
                <span className={`${styles.linkLine} ${styles.lineThree}`} />
              </div>

              <div className={styles.networkFooter}>
                <div>
                  <span>Identidad</span>
                  <strong>Ed25519</strong>
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
            <h2>Una capa de control entre tú y todos tus equipos.</h2>
          </SectionReveal>
          <SectionReveal delay={90}>
            <p>
              En lugar de administrar cada equipo de forma aislada, RelNet reúne nodos Windows y Linux dentro de un mismo plano operativo. Desde ahí puedes aprobar dispositivos, conocer su estado y ejecutar acciones remotas con una identidad verificable por nodo.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className={styles.capabilitiesSection} id="capacidades">
        <div className={styles.shell}>
          <SectionReveal className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Disponible hoy</span>
              <h2>Una red que también sabe operar.</h2>
            </div>
            <p>Terminal interactiva, telemetría, servicios y automatización remota dentro de una misma experiencia.</p>
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

      <section className={styles.roadmapSection} id="roadmap">
        <div className={styles.shell}>
          <SectionReveal className={styles.roadmapHeader}>
            <div>
              <span className={styles.eyebrow}>Lo que sigue</span>
              <h2>RelNet está creciendo de control remoto a infraestructura privada completa.</h2>
            </div>
            <p>Estas capacidades forman parte de la evolución del producto y se muestran separadas de lo que ya está activo.</p>
          </SectionReveal>

          <div className={styles.roadmapGrid}>
            {roadmap.map((item, index) => (
              <SectionReveal key={item.title} delay={index * 80}>
                <article className={styles.roadmapCard}>
                  <span>{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
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
                <p>El centro para vincular, aprobar, reautenticar y operar nodos, abrir sesiones remotas y revisar la telemetría del entorno.</p>
                <ul>
                  <li>Nodos y vinculaciones</li>
                  <li>Terminales interactivas</li>
                  <li>Servicios y acciones remotas</li>
                  <li>Telemetría del sistema</li>
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
              RelNet trata cada equipo como una identidad independiente y conserva la aprobación y la operación como pasos separados. Con identidad Ed25519, actualizaciones firmadas y leases de comandos, conectar un nodo no equivale a darle acceso irrestricto.
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
            <h2>Una sola consola para llegar a todos tus equipos.</h2>
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
