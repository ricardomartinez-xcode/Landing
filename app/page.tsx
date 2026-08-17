import Link from 'next/link';
import styles from './page.module.css';

const consoleUrl = 'https://console.relead.com.mx';
const registerUrl = `${consoleUrl}/register`;
const loginUrl = `${consoleUrl}/login`;
const billingUrl = `${consoleUrl}/billing`;
const developersUrl = `${consoleUrl}/developers`;

const capabilities = [
  ['RelNet', 'Red privada con identidad, políticas, nodos, rutas y salida a Internet administrada.'],
  ['Terminal + SSH', 'Sesiones remotas con identidad, autorización elevada y auditoría por actor y dispositivo.'],
  ['RelDrop + RelShare', 'Archivos y recursos compartidos entre nodos compatibles sin mezclar superficies administrativas.'],
  ['MCP + API', 'Cada cuenta dispone de superficies de integración controladas desde RelNet Console.'],
  ['VPN', 'Acceso por RelNet e IKEv2 con rutas, políticas y gateway de salida configurables.'],
  ['Rescue', 'Recuperación operativa con staging, validación y promoción controlada hacia producción.'],
];

const surfaces = [
  { host: 'relead.com.mx', title: 'ReLead', note: 'Sitio público, producto, planes, anuncios, documentación e instalación.', state: 'Público' },
  { host: 'console.relead.com.mx', title: 'RelNet Console', note: 'Registro, acceso, dispositivos, red, terminal, billing, developers y administración autorizada.', state: 'Usuarios' },
  { host: 'api.relead.com.mx', title: 'API', note: 'Backend, OAuth, MCP y APIs. Sin rutas gráficas de administración.', state: 'Backend' },
];

const announcements = [
  {
    tag: 'Anuncio',
    title: 'RelNet Console unifica acceso, red y operación.',
    copy: 'La nueva superficie concentra registro, dispositivos, terminal, identidad, facturación y herramientas de desarrollo.',
    href: registerUrl,
    cta: 'Crear cuenta',
  },
  {
    tag: 'Novedad',
    title: 'RelNet para Windows y Linux.',
    copy: 'Incorpora nodos compatibles y administra conectividad, recursos y políticas desde una sola consola.',
    href: '/install',
    cta: 'Instalar RelNet',
  },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    suffix: '/ mes',
    description: 'Para empezar con una cuenta y probar RelNet.',
    features: ['RelNet Console', '1 usuario', 'Nodos básicos', 'MCP/API con límites', 'Soporte comunitario'],
    href: `${registerUrl}?plan=free`,
    cta: 'Empezar gratis',
  },
  {
    name: 'Pro',
    price: 'Stripe',
    suffix: ' / suscripción',
    description: 'Para operación personal o equipos pequeños con funciones avanzadas.',
    features: ['Más nodos y sesiones', 'Terminal + SSH', 'RelDrop + RelShare', 'VPN e IKEv2', 'Billing y portal de cliente'],
    href: `${billingUrl}?plan=pro`,
    cta: 'Configurar Pro',
    featured: true,
  },
  {
    name: 'Business',
    price: 'A medida',
    suffix: '',
    description: 'Para equipos que requieren administración, políticas, HA y soporte operativo.',
    features: ['Multiusuario y roles', 'Controllers redundantes', 'Rescue y staging', 'Políticas avanzadas', 'Soporte prioritario'],
    href: `${billingUrl}?plan=business`,
    cta: 'Hablar de Business',
  },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.shell}>
          <div className={styles.navRow}>
            <Link className={styles.brand} href="/" aria-label="ReLead">
              <span className={styles.brandMark}>R</span>
              <span>ReLead</span>
            </Link>
            <nav className={styles.navLinks} aria-label="Navegación principal">
              <a href="#producto">Producto</a>
              <a href="#planes">Planes</a>
              <a href="#accesos">Accesos</a>
              <Link href="/install">Instalar</Link>
            </nav>
            <div className={styles.navActions}>
              <a className={styles.textLink} href={loginUrl}>Entrar</a>
              <a className={styles.primarySmall} href={registerUrl}>Crear cuenta</a>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.shell}>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>ReLead · RelNet</span>
              <h1>Tu red privada, tu identidad y tu operación en una sola consola.</h1>
              <p className={styles.lead}>
                RelNet conecta equipos, usuarios y servicios con políticas claras. RelNet Console concentra
                registro, red, terminal, identidad, facturación y herramientas para desarrolladores sin mezclar
                la experiencia de usuario con la administración interna de la API.
              </p>
              <div className={styles.actions}>
                <a className={styles.primary} href={registerUrl}>Crear cuenta <span aria-hidden="true">↗</span></a>
                <a className={styles.secondary} href={loginUrl}>Abrir RelNet Console</a>
                <Link className={styles.textLink} href="/install">Instalar RelNet</Link>
              </div>
              <div className={styles.heroMeta}>
                <span>Windows + Linux</span>
                <span>Web + PWA</span>
                <span>SSH + Terminal</span>
                <span>OAuth + MCP + API</span>
              </div>
            </div>

            <aside className={styles.consoleCard} aria-label="RelNet Console">
              <div className={styles.consoleTop}>
                <div>
                  <span className={styles.statusDot} />
                  <strong>RelNet Console</strong>
                </div>
                <code>v90</code>
              </div>
              <div className={styles.consoleBody}>
                <div className={styles.metric}><span>Identidad</span><strong>Activa</strong></div>
                <div className={styles.metric}><span>RelNet</span><strong>Conectado</strong></div>
                <div className={styles.metric}><span>Terminal</span><strong>Autorizada</strong></div>
                <div className={styles.metric}><span>Gateway</span><strong>Gestionado</strong></div>
              </div>
              <div className={styles.consoleFooter}>
                <span>Cuenta → red → nodo → sesión → recurso</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.announcementSection} aria-label="Anuncios">
        <div className={styles.shell}>
          <div className={styles.announcementGrid}>
            {announcements.map((item) => (
              <article className={styles.announcement} key={item.title}>
                <span className={styles.adBadge}>{item.tag}</span>
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
                <a href={item.href}>{item.cta} →</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="producto">
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>Producto</span>
              <h2>Una experiencia coherente desde el alta hasta la operación.</h2>
            </div>
            <p>
              La interfaz pública, RelNet Console y el panel administrativo comparten lenguaje visual, pero cada
              dominio conserva una responsabilidad concreta.
            </p>
          </div>
          <div className={styles.capabilityGrid}>
            {capabilities.map(([title, body], index) => (
              <article className={styles.card} key={title}>
                <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt} id="planes">
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>Planes</span>
              <h2>Empieza simple. Escala cuando la red lo necesite.</h2>
            </div>
            <p>
              El cobro de planes de pago se realiza mediante Stripe desde RelNet Console. Los importes comerciales
              de Pro y Business se publican desde la configuración de Billing para mantener una sola fuente de verdad.
            </p>
          </div>
          <div className={styles.pricingGrid}>
            {plans.map((plan) => (
              <article className={`${styles.planCard} ${plan.featured ? styles.featured : ''}`} key={plan.name}>
                <div className={styles.planTop}>
                  <span>{plan.name}</span>
                  {plan.featured ? <strong>Recomendado</strong> : null}
                </div>
                <div className={styles.price}><strong>{plan.price}</strong><span>{plan.suffix}</span></div>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <a className={plan.featured ? styles.primary : styles.secondary} href={plan.href}>{plan.cta}</a>
              </article>
            ))}
          </div>
          <p className={styles.billingNote}>
            Las suscripciones de pago requieren Checkout, Customer Portal y webhooks de Stripe habilitados en producción.
          </p>
        </div>
      </section>

      <section className={styles.section} id="accesos">
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>Accesos</span>
              <h2>Cada dominio tiene una responsabilidad.</h2>
            </div>
            <p>Sin UI administrativa bajo la API. El acceso gráfico vive en RelNet Console.</p>
          </div>
          <div className={styles.surfaceGrid}>
            {surfaces.map((surface) => (
              <article className={styles.surface} key={surface.host}>
                <div className={styles.surfaceTop}>
                  <span>{surface.state}</span>
                  <code>{surface.host}</code>
                </div>
                <h3>{surface.title}</h3>
                <p>{surface.note}</p>
                {surface.host === 'console.relead.com.mx' ? <a href={consoleUrl}>Abrir RelNet Console →</a> : null}
                {surface.host === 'relead.com.mx' ? <Link href="/install">Ver instalación →</Link> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.shell}>
          <div className={styles.ctaCard}>
            <div>
              <span className={styles.eyebrow}>RelNet Console</span>
              <h2>Una cuenta. Una red. Una consola.</h2>
              <p>Regístrate, configura tu identidad y administra nodos, sesiones, billing y herramientas de desarrollo.</p>
            </div>
            <div className={styles.actions}>
              <a className={styles.primary} href={registerUrl}>Crear cuenta</a>
              <a className={styles.secondaryDark} href={consoleUrl}>Abrir Console</a>
              <a className={styles.textLinkDark} href={developersUrl}>Developers ↗</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
