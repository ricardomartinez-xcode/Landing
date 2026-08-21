import Link from 'next/link';
import { aiLabel, formatMxn, monthlyCadence, planCta, publicPlans, yearlyLabel } from '@/lib/public-commercial';
import styles from './page.module.css';

const consoleUrl = 'https://console.relead.com.mx/';
const registerUrl = 'https://console.relead.com.mx/register';
const loginUrl = 'https://console.relead.com.mx/console/login';
const apiUrl = 'https://console.relead.com.mx/developers';

const features = [
  ['Mesh privado', 'RelNet intenta direct P2P entre peers autorizados y usa Relay como fallback cuando hace falta.'],
  ['SSH + RDP', 'Acceso remoto según plataforma, capacidad del nodo y autorización aplicable.'],
  ['RelDrop + RelShare', 'Transferencias y recursos compartidos permanecen en el data path peer.'],
  ['Exit Node + Subnet Router', 'Capacidades separadas para salida y acceso a prefijos autorizados.'],
  ['RelNet AI', 'IA incluida según el plan y su cuota contractual de AI Credits.'],
  ['Control activo-activo', 'Controllers elegibles coordinan estado sin roles permanentes de primario/secundario.']
];

const ads = [
  { eyebrow: 'Patrocinado', title: process.env.NEXT_PUBLIC_AD_1_TITLE || 'Infraestructura que viaja contigo', body: process.env.NEXT_PUBLIC_AD_1_BODY || 'Espacio publicitario integrado con etiqueta visible y separado de la navegación de ReLead.', href: process.env.NEXT_PUBLIC_AD_1_URL || '#planes' },
  { eyebrow: 'Patrocinado', title: process.env.NEXT_PUBLIC_AD_2_TITLE || 'Acceso remoto, sin abrir tu LAN', body: process.env.NEXT_PUBLIC_AD_2_BODY || 'Ubicación reservada para campañas compatibles con el contexto público de ReLead.', href: process.env.NEXT_PUBLIC_AD_2_URL || '#producto' }
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Navegación principal">
        <div className={styles.shell}><div className={styles.navInner}>
          <a className={styles.brand} href="#inicio" aria-label="ReLead RelNet"><strong>ReLead · RelNet</strong></a>
          <div className={styles.navLinks}><a href="#producto">Producto</a><a href="#capacidades">Capacidades</a><Link href="/pricing">Pricing</Link><a href="#seguridad">Seguridad</a><a href={loginUrl} className={styles.navAdmin}>Iniciar sesión</a><a href={consoleUrl} className={styles.navCta}>RelNet Console <span>↗</span></a></div>
        </div></div>
      </nav>

      <section className={styles.hero} id="inicio"><div className={`${styles.shell} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}><span className={styles.eyebrow}>ReLead · RelNet Next</span><h1>Tu mesh privado.<br /><span>Acceso remoto + IA.</span></h1><p>Conecta nodos y servicios en una red privada, prioriza direct P2P con Relay fallback y opera SSH, RDP, RelDrop, RelShare, Exit Node y Subnet Router sin convertir la API en el camino normal de tus datos.</p><div className={styles.actions}><a className={styles.buttonPrimary} href={registerUrl}>Crear cuenta <span>→</span></a><Link className={styles.buttonSecondary} href="/pricing">Ver pricing</Link><Link className={styles.buttonSecondary} href="/install">Instalar</Link></div><div className={styles.heroMeta}><span>direct P2P</span><span>Relay fallback</span><span>SSH / RDP</span><span>RelNet AI</span></div></div>
        <div className={styles.controlVisual} aria-label="Vista conceptual de RelNet"><div className={styles.windowChrome}><div className={styles.windowDots}><i/><i/><i/></div><span>console.relead.com.mx</span><b>Connected</b></div><div className={styles.mockApp}><aside className={styles.mockSidebar}><strong>R</strong>{['⌁','⇧','◈','◎'].map((icon)=><span key={icon}>{icon}</span>)}</aside><div className={styles.mockMain}><div className={styles.mockHeader}><div><small>RELNET NEXT</small><h3>Private mesh</h3></div><span className={styles.livePill}>● Path healthy</span></div><div className={styles.statGrid}><div><small>Camino</small><strong>P2P</strong><span>direct preferred</span></div><div><small>Fallback</small><strong>Relay</strong><span>authorized</span></div><div><small>Acceso</small><strong>SSH</strong><span>RDP + files</span></div></div><div className={styles.terminal}><div><span>data path</span><b>peer service</b><em>authorized</em></div><pre>{`direct P2P   preferred\nRelay        fallback\nSSH / RDP    service\nRelDrop      peer data`}</pre></div></div></div></div>
      </div></section>

      <section className={styles.adStrip} aria-label="Anuncios"><div className={`${styles.shell} ${styles.adGrid}`}>{ads.map((ad)=><a key={ad.title} className={styles.adCard} href={ad.href} rel="sponsored"><span>{ad.eyebrow}</span><strong>{ad.title}</strong><p>{ad.body}</p><b>Conocer más ↗</b></a>)}</div></section>

      <section className={styles.product} id="producto"><div className={`${styles.shell} ${styles.sectionGrid}`}><div><span className={styles.eyebrow}>Un solo sistema</span><h2>RelNet para usuarios.<br />Control separado del payload.</h2></div><p><strong>Console</strong> es la superficie autenticada para operar tu cuenta y servicios. <strong>api.relead.com.mx</strong> permanece como API de producto; el tráfico ordinario de SSH, RDP, RelDrop y RelShare usa el camino peer autorizado.</p></div></section>

      <section className={styles.capabilities} id="capacidades"><div className={styles.shell}><div className={styles.sectionHeader}><div><span className={styles.eyebrow}>Capacidades</span><h2>Una red que también sabe operar.</h2></div><p>Identidad, autorización y conectividad verificable antes de cada capacidad.</p></div><div className={styles.featureGrid}>{features.map(([title,body],index)=><article className={styles.featureCard} key={title}><span>0{index+1}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>

      <section className={styles.pricing} id="planes"><div className={styles.shell}><div className={styles.sectionHeader}><div><span className={styles.eyebrow}>Pricing público</span><h2>Empieza pequeño. Escala sin cambiar de red.</h2></div><p>Free, Pro, Team y Business consumen una única fuente pública de precios; RelNet AI se presenta según la cuota de cada plan.</p></div><div className={styles.planGrid}>{publicPlans.map((plan)=>{const cta=planCta(plan);const featured=plan.slug==='pro';return <article className={`${styles.planCard} ${featured?styles.planFeatured:''}`} key={plan.slug}>{featured&&<span className={styles.recommended}>Recomendado</span>}<div className={styles.planHead}><h3>{plan.name}</h3><p>{plan.description}</p></div><div className={styles.price}><strong>{formatMxn(plan.monthly_price)}</strong><span>{monthlyCadence(plan)} · {yearlyLabel(plan)}</span></div><ul><li>{aiLabel(plan)}</li><li>{plan.self_service?'Alta autoservicio disponible':'Activación asistida'}</li></ul><a href={cta.href} className={featured?styles.buttonPrimary:styles.buttonSecondary}>{cta.label} <span>→</span></a></article>})}</div><p className={styles.billingNote}>Consulta <Link href="/pricing">Pricing</Link> para precios, créditos de RelNet AI y política de publicidad por superficie.</p></div></section>

      <section className={styles.security} id="seguridad"><div className={`${styles.shell} ${styles.securityCard}`}><div><span className={styles.eyebrow}>Identidad antes que contraseña</span><h2>Registro, OTP, OAuth y acceso elevado como flujos explícitos.</h2><p>RelNet distingue control, autorización y data path; las capacidades se habilitan sólo cuando el plan, el nodo y la política aplicable lo permiten.</p></div><div className={styles.securityList}>{['Registro y onboarding','Configuración OTP','OAuth por usuario','SSH ligado a identidad','Autorización de capacidades','Auditoría de sesiones'].map((x)=><span key={x}>✓ {x}</span>)}</div></div></section>

      <footer className={styles.footer}><div className={`${styles.shell} ${styles.footerInner}`}><div className={styles.footerBrand}><strong>ReLead · RelNet</strong><span>Private network · remote access · RelNet AI</span></div><div className={styles.footerLinks}><a href={consoleUrl}>RelNet Console</a><Link href="/pricing">Pricing</Link><a href={registerUrl}>Registro</a><a href={apiUrl}>API / MCP</a></div></div></footer>
    </main>
  );
}
