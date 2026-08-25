import Image from 'next/image';
import { PublicAdSlot } from '@/components/monetization/PublicAdSlot';
import styles from './page.module.css';

const accessUrl = 'https://auth.relead.com.mx/access';

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
    name: 'Free', price: '$0 MXN', cadence: 'sin tarjeta',
    description: 'Para probar RelNet con una red personal real.',
    items: ['1 usuario', 'Hasta 10 nodos', '2 GB de RelDrop al mes', 'Console y métricas esenciales', 'Puede incluir patrocinio público'],
    cta: 'Crear cuenta', href: accessUrl,
  },
  {
    name: 'Pro', price: '$149 MXN', cadence: '/mes · $1,490/año',
    description: 'Para operar infraestructura personal y automatizaciones sin cambiar de red.',
    items: ['Hasta 50 nodos', 'API externa y MCP', 'Remote Chrome', 'Automatización', 'Sin anuncios del plan'],
    cta: 'Elegir Pro', href: accessUrl, featured: true,
  },
  {
    name: 'Team', price: '$399 MXN', cadence: '/mes · $3,990/año',
    description: 'Para equipos pequeños que necesitan una red compartida y más capacidad.',
    items: ['Hasta 5 usuarios', 'Hasta 250 nodos', 'Entitlements por plan', 'API y automatización', 'Venta asistida mientras madura multiusuario'],
    cta: 'Ver Team', href: accessUrl,
  },
  {
    name: 'Business', price: 'Cotizar', cadence: 'por organización',
    description: 'Para operación de plataforma, mayor escala y necesidades empresariales.',
    items: ['Hasta 25 usuarios', 'Hasta 1,000 nodos', 'Mayor capacidad RelDrop', 'Operación empresarial', 'Venta asistida'],
    cta: 'Hablar con ReLead', href: accessUrl,
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
              <a href={accessUrl} className={styles.navAdmin}>Iniciar sesión</a>
              <a href={accessUrl} className={styles.navCta}>Acceder <span>↗</span></a>
            </div>
          </div>
        </div>
      </nav>

      <section className={styles.hero} id="inicio">
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>ReLead · RelNet</span>
            <h1>Tu red privada.<br /><span>Una consola para operarla.</span></h1>
            <p>Conecta equipos, identidades y servicios en un plano privado; abre terminales, SSH, archivos, automatización y salida a Internet sin mezclar la operación diaria con la administración de plataforma.</p>
            <div className={styles.actions}>
              <a className={styles.buttonPrimary} href={accessUrl}>Crear cuenta <span>→</span></a>
              <a className={styles.buttonSecondary} href={accessUrl}>Acceder a RelNet</a>
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
      <PublicAdSlot surface="public_landing" format="direct_sponsor" placement="home_midpage" />

      <section className={styles.product} id="producto">
        <div className={`${styles.shell} ${styles.sectionGrid}`}>
          <div><span className={styles.eyebrow}>Un solo sistema</span><h2>RelNet Console para usuarios.<br/>Un acceso seguro para operar tu red.</h2></div>
          <p><strong>Console</strong> es la superficie diaria para nodos, red, terminal, SSH, archivos, MCP, API y facturación. Las operaciones internas de plataforma permanecen fuera de la experiencia pública. La API no necesita rutas gráficas.</p>
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

      <footer className={styles.footer}><div className={`${styles.shell} ${styles.footerInner}`}><div className={styles.footerBrand}><Image src="/relnet-brand.png" alt="ReLead RelNet" width={1951} height={892}/><span>Private network · control plane · remote operations</span></div><div className={styles.footerLinks}><a href={accessUrl}>Acceso seguro</a><a href="#producto">Producto</a><a href="#planes">Planes</a><a href={accessUrl}>API / MCP</a></div></div></footer>
    </main>
  );
}
