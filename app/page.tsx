import Image from 'next/image';
import styles from './page.module.css';

const consoleUrl = 'https://console.relead.com.mx/console/';
const adminUrl = 'https://console.relead.com.mx/admin/';
const registerUrl = 'https://console.relead.com.mx/register';
const billingUrl = 'https://console.relead.com.mx/billing';
const apiUrl = 'https://console.relead.com.mx/console/?section=api';

const features = [
  ['Mesh privado', 'Conecta nodos Windows, Linux y servicios sin publicar la red interna.'],
  ['SSH con identidad', 'Sesiones remotas ligadas a identidad, políticas, reautenticación y auditoría.'],
  ['Exit nodes', 'Salida a Internet controlada por política, con diagnóstico de rutas y salud.'],
  ['MCP + API', 'Cada usuario opera capacidades autorizadas mediante API y MCP.'],
  ['RelDrop + RelShare', 'Transferencia y recursos compartidos dentro del mismo plano privado.'],
  ['Rescue', 'Recuperación mediante staging, promoción controlada y registro de cada operación.'],
];

const plans = [
  {
    name: 'Personal', price: '$0', cadence: 'para empezar',
    description: 'Para una red privada personal y pocos nodos.',
    items: ['RelNet Console', 'Nodos personales', 'SSH seguro', 'Métricas esenciales'],
    cta: 'Crear cuenta', href: registerUrl,
  },
  {
    name: 'Pro', price: process.env.NEXT_PUBLIC_PLAN_PRO_PRICE || 'Ver precio', cadence: 'facturación mensual',
    description: 'Para operar infraestructura, automatización y acceso remoto.',
    items: ['Todo en Personal', 'MCP y API', 'Exit nodes', 'RelDrop / RelShare', 'Terminal remota'],
    cta: 'Elegir Pro', href: `${billingUrl}?plan=pro`, featured: true,
  },
  {
    name: 'Business', price: process.env.NEXT_PUBLIC_PLAN_BUSINESS_PRICE || 'Cotizar', cadence: 'por organización',
    description: 'Control, recuperación, políticas y operación multiusuario.',
    items: ['Todo en Pro', 'Roles y políticas', 'Rescue + staging', 'Auditoría', 'Controllers HA'],
    cta: 'Abrir facturación', href: `${billingUrl}?plan=business`,
  },
];

const ads = [
  {
    eyebrow: 'Patrocinado',
    title: process.env.NEXT_PUBLIC_AD_1_TITLE || 'Infraestructura que viaja contigo',
    body: process.env.NEXT_PUBLIC_AD_1_BODY || 'Espacio publicitario integrado con etiqueta visible y separado de la navegación de ReLead.',
    href: process.env.NEXT_PUBLIC_AD_1_URL || '#planes',
  },
  {
    eyebrow: 'Patrocinado',
    title: process.env.NEXT_PUBLIC_AD_2_TITLE || 'Acceso remoto, sin abrir tu LAN',
    body: process.env.NEXT_PUBLIC_AD_2_BODY || 'Ubicación reservada para campañas compatibles con el contexto público de ReLead.',
    href: process.env.NEXT_PUBLIC_AD_2_URL || '#producto',
  },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Navegación principal">
        <div className={styles.shell}>
          <div className={styles.navInner}>
            <a className={styles.brand} href="#inicio" aria-label="ReLead RelNet">
              <Image src="/relnet-brand.png" alt="ReLead RelNet" width={1951} height={892} priority />
            </a>
            <div className={styles.navLinks}>
              <a href="#producto">Producto</a><a href="#capacidades">Capacidades</a><a href="#planes">Planes</a><a href="#seguridad">Seguridad</a>
              <a href={adminUrl} className={styles.navAdmin}>Admin</a>
              <a href={consoleUrl} className={styles.navCta}>RelNet Console <span>↗</span></a>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.hero} id="inicio">
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>ReLead · RelNet v90</span>
            <h1>Tu red privada.<br /><span>Una consola para operarla.</span></h1>
            <p>Conecta equipos, identidades y servicios en un plano privado; abre terminales, SSH, archivos, automatización y salida a Internet sin mezclar la operación diaria con la administración de plataforma.</p>
            <div className={styles.actions}>
              <a className={styles.buttonPrimary} href={registerUrl}>Crear cuenta <span>→</span></a>
              <a className={styles.buttonSecondary} href={consoleUrl}>Abrir RelNet Console</a>
            </div>
            <div className={styles.heroMeta}><span>OAuth / OTP</span><span>SSH identity</span><span>IKEv2 + mesh</span><span>MCP + API</span></div>
          </div>

          <div className={styles.controlVisual} aria-label="Vista conceptual de RelNet Console">
            <div className={styles.windowChrome}><div className={styles.windowDots}><i/><i/><i/></div><span>console.relead.com.mx</span><b>Connected</b></div>
            <div className={styles.mockApp}>
              <aside className={styles.mockSidebar}><strong>R</strong>{['⌁','⇧','◈','₿','◉','⌘'].map((icon)=><span key={icon}>{icon}</span>)}</aside>
              <div className={styles.mockMain}>
                <div className={styles.mockHeader}><div><small>RELNET CONSOLE</small><h3>Control plane</h3></div><span className={styles.livePill}>● Network healthy</span></div>
                <div className={styles.statGrid}>
                  <div><small>Nodos</small><strong>04</strong><span>3 online · 1 attention</span></div>
                  <div><small>Rutas</small><strong>12</strong><span>mesh + exit</span></div>
                  <div><small>Sesiones</small><strong>03</strong><span>identity bound</span></div>
                </div>
                <div className={styles.terminal}><div><span>relead</span><b>terminal</b><em>ssh · elevated</em></div><pre>{`$ relnet status\nmesh      connected\nidentity  verified\nroute     exit-node\n$ _`}</pre></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.adStrip} aria-label="Anuncios">
        <div className={`${styles.shell} ${styles.adGrid}`}>
          {ads.map((ad)=><a key={ad.title} className={styles.adCard} href={ad.href} rel="sponsored"><span>{ad.eyebrow}</span><strong>{ad.title}</strong><p>{ad.body}</p><b>Conocer más ↗</b></a>)}
        </div>
      </section>

      <section className={styles.product} id="producto">
        <div className={`${styles.shell} ${styles.sectionGrid}`}>
          <div><span className={styles.eyebrow}>Un solo sistema</span><h2>RelNet Console para usuarios.<br/>Admin para la plataforma.</h2></div>
          <p><strong>Console</strong> es la superficie diaria para nodos, red, terminal, SSH, archivos, MCP, API y facturación. <strong>Admin</strong> queda reservado para salud, releases, staging, Rescue, controllers y recuperación. La API no necesita rutas gráficas.</p>
        </div>
      </section>

      <section className={styles.capabilities} id="capacidades">
        <div className={styles.shell}>
          <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>Capacidades</span><h2>Una red que también sabe operar.</h2></div><p>Diseñada alrededor de identidad, políticas y conectividad verificable.</p></div>
          <div className={styles.featureGrid}>{features.map(([title,body],index)=><article className={styles.featureCard} key={title}><span>0{index+1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </div>
      </section>

      <section className={styles.pricing} id="planes">
        <div className={styles.shell}>
          <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>Planes y facturación</span><h2>Empieza pequeño. Escala sin cambiar de red.</h2></div><p>Checkout y portal de cliente viven detrás de RelNet Console; la facturación se desacopla del landing público.</p></div>
          <div className={styles.planGrid}>{plans.map((plan)=><article className={`${styles.planCard} ${plan.featured?styles.planFeatured:''}`} key={plan.name}>{plan.featured&&<span className={styles.recommended}>Recomendado</span>}<div className={styles.planHead}><h3>{plan.name}</h3><p>{plan.description}</p></div><div className={styles.price}><strong>{plan.price}</strong><span>{plan.cadence}</span></div><ul>{plan.items.map((item)=><li key={item}>{item}</li>)}</ul><a href={plan.href} className={plan.featured?styles.buttonPrimary:styles.buttonSecondary}>{plan.cta} <span>→</span></a></article>)}</div>
          <p className={styles.billingNote}>Los importes finales y condiciones se confirman en la superficie segura de facturación antes del cobro.</p>
        </div>
      </section>

      <section className={styles.security} id="seguridad">
        <div className={`${styles.shell} ${styles.securityCard}`}>
          <div><span className={styles.eyebrow}>Identidad antes que contraseña</span><h2>Registro, OTP, OAuth y acceso elevado como flujos explícitos.</h2><p>RelNet Console debe mostrar cuándo una operación requiere reautenticación y mantener separado el acceso ordinario de una identidad elevada.</p></div>
          <div className={styles.securityList}>{['Registro y onboarding','Configuración OTP','OAuth por usuario','SSH ligado a identidad','Reautenticación para privilegios','Auditoría de sesiones'].map((x)=><span key={x}>✓ {x}</span>)}</div>
        </div>
      </section>

      <footer className={styles.footer}><div className={`${styles.shell} ${styles.footerInner}`}><div className={styles.footerBrand}><Image src="/relnet-brand.png" alt="ReLead RelNet" width={1951} height={892}/><span>Private network · control plane · remote operations</span></div><div className={styles.footerLinks}><a href={consoleUrl}>RelNet Console</a><a href={adminUrl}>Admin</a><a href={registerUrl}>Registro</a><a href={billingUrl}>Planes</a><a href={apiUrl}>API</a></div></div></footer>
    </main>
  );
}
