import Image from 'next/image';
import Link from 'next/link';
import { PublicAdSlot } from '@/components/monetization/PublicAdSlot';
import styles from './page.module.css';

const CONSOLE_URL = 'https://console.relnets.com';
const SIGNUP_URL = `${CONSOLE_URL}/signup`;
const LOGIN_URL = `${CONSOLE_URL}/login`;
const PRO_MONTHLY_URL = `${SIGNUP_URL}?intent=billing&plan=pro&interval=month`;
const TEAM_MONTHLY_URL = `${SIGNUP_URL}?intent=billing&plan=team&interval=month`;

const capabilities = [
  ['Connect','Conecta personas, máquinas, servicios y sitios mediante infraestructura privada administrada desde un solo workspace.'],
  ['Access','Otorga el acceso correcto con identidad, tenant, roles, políticas y privilegios temporales.'],
  ['Govern','Haz que cada decisión importante sea explicable y auditable mediante políticas, aprobaciones y trazabilidad.'],
  ['Operate','Administra nodos, sesiones, recursos, automatizaciones e integraciones sin fragmentar la operación.'],
  ['AI + MCP','Da a los agentes una identidad propia, herramientas permitidas y controles de aprobación antes de actuar.'],
  ['Everywhere','Windows, Linux, CLI, API y una PWA móvil para infraestructura distribuida y edge.'],
];

const plans = [
  {name:'Free',price:'$0 MXN',cadence:'sin tarjeta',badge:'Para empezar',features:['1 usuario','Hasta 10 nodos','100 créditos de IA / mes','Console esencial','PWA móvil + perfil VPN','Incluye anuncios y patrocinio'],cta:'Crea tu cuenta',href:SIGNUP_URL},
  {name:'Pro',price:'$199 MXN',cadence:'/mes · $1,990/año',badge:'2 meses sin costo al pagar anual',features:['Hasta 50 nodos','1,200 créditos de IA / mes','Agent RelNets vía MCP / API','Automatización avanzada','Control Center para Windows','Sin anuncios'],cta:'Elegir Pro',href:PRO_MONTHLY_URL,featured:true},
  {name:'Team',price:'$499 MXN',cadence:'/mes · $4,990/año',badge:'2 meses sin costo al pagar anual',features:['Hasta 5 usuarios','Hasta 250 nodos','5,000 créditos de IA compartidos / mes','Espacios y administración compartida','Soporte prioritario','Sin anuncios'],cta:'Elegir Team',href:TEAM_MONTHLY_URL},
  {name:'Enterprise',price:'Consultar con ventas',cadence:'según tus necesidades',badge:'A la medida',features:['Escala personalizada','Políticas y operación empresarial','Créditos de IA personalizados','Acompañamiento de implementación','Administración avanzada','Sin anuncios'],cta:'Consultar con ventas',href:'mailto:sales@relnets.com?subject=RelNets%20Enterprise'},
];

export default function Home(){
  return <main className={styles.page}>
    <section className={styles.hero} id="inicio">
      <div className={styles.shell}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>Secure Infrastructure Workspace</span>
            <h1>Secure infrastructure. <span>Without boundaries.</span></h1>
            <p>RelNets entrega un workspace seguro donde cada conexión es intencional, verificada y protegida. Conecta infraestructura, controla accesos, gobierna identidades y opera desde una sola superficie.</p>
            <div className={styles.actions}>
              <a className={styles.primary} href={SIGNUP_URL}>Empieza gratis</a>
              <a className={styles.secondary} href="#producto">Explorar producto</a>
              <Link className={styles.ghost} href="/install">Instalación</Link>
            </div>
            <div className={styles.trustRow}>
              <span>Secure by Design</span><span>Connected by Intent</span><span>Built to Scale</span><span>Identity · Policy · Audit</span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.fabricPanel}>
              <div className={styles.fabricGrid}/>
              <div className={styles.fabricGlow}/>
              <div className={styles.fabricCore}>
                <Image src="/relnet-mark-transparent.png" alt="RelNets" width={180} height={180} priority/>
                <strong>RelNets</strong><span>Secure Infrastructure Workspace</span>
              </div>
              <div className={`${styles.fabricNode} ${styles.fabricConnect}`}>Connect</div>
              <div className={`${styles.fabricNode} ${styles.fabricAccess}`}>Access</div>
              <div className={`${styles.fabricNode} ${styles.fabricGovern}`}>Govern</div>
              <div className={`${styles.fabricNode} ${styles.fabricOperate}`}>Operate</div>
            </div>
            <div className={styles.glowCard}><strong>One workspace</strong><span>People · Machines · AI · Private infrastructure</span></div>
          </div>
        </div>
      </div>
    </section>

    <section className={styles.section} id="producto">
      <div className={styles.shell}>
        <div className={styles.sectionIntro}>
          <div><span className={styles.kicker}>Four control layers</span><h2>Connect. Access. Govern. Operate.</h2></div>
          <p>Una misma arquitectura de identidad y políticas controla cómo se conecta, quién entra, qué puede hacer y cómo queda registrada cada operación.</p>
        </div>
        <div className={styles.featureGrid}>
          {capabilities.map(([title,body],i)=><article className={styles.featureCard} key={title}><span className={styles.featureNumber}>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </div>
    </section>

    <section className={styles.aiSection} id="soluciones">
      <div className={styles.shell}>
        <div className={styles.aiGrid}>
          <div>
            <span className={styles.kicker}>People · Machines · AI</span>
            <h2>La inteligencia artificial también necesita identidad, límites y aprobación.</h2>
            <p>Agent RelNets opera bajo el mismo modelo de identidad y políticas que el resto del workspace: acceso explícito, herramientas permitidas, duración limitada y aprobación humana cuando una acción puede afectar producción.</p>
            <ul className={styles.cleanList}>
              <li>Identidades independientes para agentes y workloads.</li>
              <li>Tool allowlists para MCP y automatización.</li>
              <li>Aprobación humana para acciones privilegiadas o destructivas.</li>
              <li>Auditoría de decisiones, herramientas y recursos afectados.</li>
            </ul>
          </div>
          <div className={styles.agentCard}>
            <div className={styles.agentBrand}>
              <Image src="/relnet-mark-transparent.png" alt="" width={180} height={180}/>
              <div><small>AI infrastructure</small><strong>Agent RelNets</strong></div>
            </div>
            <p>MCP / API permite que ChatGPT y otros sistemas compatibles trabajen con RelNets sin heredar privilegios invisibles. La identidad, el tenant, el plan y la política siguen siendo autoridad del servidor.</p>
            <div className={styles.agentFlow}>
              <span>Agent identity</span><i>→</i><span>Policy</span><i>→</i><span>Approval</span><i>→</i><span>Tool</span><i>→</i><span>Audit</span>
            </div>
            <div className={styles.creditStrip}><span>Créditos incluidos por plan</span><b>Compra capacidad adicional sólo cuando la necesites.</b></div>
          </div>
        </div>
      </div>
    </section>

    <section className={styles.security} id="seguridad">
      <div className={styles.shell}>
        <div className={styles.sectionIntro}>
          <div><span className={styles.kicker}>Secure by Design</span><h2>Identity first. Deny by default.</h2></div>
          <p>La seguridad de RelNets parte de identidades individuales, privilegio mínimo, acceso temporal, aislamiento por tenant y decisiones de política explicables.</p>
        </div>
        <div className={styles.securityDiagram}>
          <div className={styles.orbit}>
            <div className={styles.core}>RelNets</div>
            <div className={`${styles.node} ${styles.nodeOne}`}>Identity</div>
            <div className={`${styles.node} ${styles.nodeTwo}`}>Resource</div>
            <div className={`${styles.node} ${styles.nodeThree}`}>Policy</div>
            <div className={`${styles.node} ${styles.nodeFour}`}>Audit</div>
          </div>
          <div className={styles.securityCopy}>
            <h3>Cada conexión debe tener identidad, intención y una política que la justifique.</h3>
            <p>Las operaciones sensibles requieren una identidad válida, el recurso correcto y autorización server-side. Los privilegios pueden expirar y las acciones importantes quedan vinculadas a su decisión de política.</p>
            <div className={styles.flow}><span>1 · Identify</span><i>→</i><span>2 · Authorize</span><i>→</i><span>3 · Connect</span><i>→</i><span>4 · Audit</span></div>
          </div>
        </div>
      </div>
    </section>

    <section className={styles.consoleSection} id="console">
      <div className={styles.shell}>
        <div className={styles.consoleMock}>
          <aside>
            <Image src="/relnet-mark-transparent.png" alt="RelNets" width={52} height={52}/>
            <span>⌂</span><span>◎</span><span>◇</span><span>⚡</span><span>AI</span>
          </aside>
          <div className={styles.consoleMain}>
            <header><div><small>RELNETS · SECURE INFRASTRUCTURE WORKSPACE</small><h3>Demo Infrastructure</h3></div><span className={styles.online}>● Infrastructure healthy</span></header>
            <div className={styles.stats}>
              <div><small>Protected resources</small><strong>42</strong><span>31 healthy</span></div>
              <div><small>Active sessions</small><strong>06</strong><span>governed access</span></div>
              <div><small>Pending approvals</small><strong>03</strong><span>JIT requests</span></div>
            </div>
            <div className={styles.consolePanels}>
              <div><small>Governed access</small><strong>Every session has context</strong><p>Actor, resource, protocol, policy decision, TTL and audit correlation.</p></div>
              <div><small>AI & MCP</small><strong>Agent guardrail active</strong><p>Destructive tools require explicit policy and human approval.</p></div>
            </div>
          </div>
        </div>
        <p className={styles.mockCaption}>Vista conceptual de RelNets Tenant Console. Las funciones productivas provienen de la Console y el Northbound reales.</p>
      </div>
    </section>

    <section className={styles.sponsorBand} aria-label="Publicidad">
      <div className={styles.shell}>
        <div className={styles.sponsorLabel}><span>Patrocinado</span><p>La landing pública y el plan Free pueden incluir anuncios para apoyar el desarrollo de RelNets.</p></div>
        <PublicAdSlot surface="public_landing" format="contextual_ad" placement="home-mid" consent="unknown"/>
      </div>
    </section>

    <section className={styles.pricing} id="planes">
      <div className={styles.shell}>
        <div className={styles.sectionIntro}>
          <div><span className={styles.kicker}>Plans</span><h2>Empieza gratis. Escala cuando tu infraestructura lo necesite.</h2></div>
          <p>Se mantienen los planes y flujos de billing productivos. Los planes anuales Pro y Team incluyen 12 meses por el precio de 10.</p>
        </div>
        <div className={styles.planGrid}>
          {plans.map(plan=><article className={`${styles.planCard} ${plan.featured?styles.planFeatured:''}`} key={plan.name}>
            <span className={styles.planBadge}>{plan.badge}</span>
            <h3>{plan.name}</h3>
            <div className={styles.price}><strong>{plan.price}</strong><span>{plan.cadence}</span></div>
            <ul>{plan.features.map(f=><li key={f}>{f}</li>)}</ul>
            <a className={plan.featured?styles.primary:styles.secondary} href={plan.href}>{plan.cta}</a>
          </article>)}
        </div>
        <div className={styles.creditPackages}>
          <div><span className={styles.kicker}>Créditos de IA adicionales</span><h3>Tu suscripción incluye créditos. Compra más sólo cuando los necesites.</h3></div>
          <div className={styles.creditPills}><span><b>500</b> · $49 MXN</span><span><b>2,000</b> · $149 MXN</span><span><b>10,000</b> · $499 MXN</span></div>
        </div>
      </div>
    </section>

    <section className={styles.installCta} id="instalacion">
      <div className={styles.shell}>
        <div><span className={styles.kicker}>Everywhere</span><h2>Windows, Linux, CLI y móvil desde una sola guía.</h2><p>En iOS y Android usa la PWA desde el navegador, agrégala a pantalla de inicio y descarga tu perfil VPN para conectarte al Mobile Gateway.</p></div>
        <Link className={styles.primary} href="/install">Abrir instalación</Link>
      </div>
    </section>

    <section className={styles.finalCta}>
      <div className={styles.shell}>
        <Image src="/relnet-mark-transparent.png" alt="" width={110} height={110}/>
        <div><span className={styles.kicker}>RelNets</span><h2>Secure infrastructure. Without boundaries.</h2></div>
        <div className={styles.actions}><a className={styles.primary} href={SIGNUP_URL}>Empieza gratis</a><a className={styles.secondary} href={LOGIN_URL}>Inicia sesión</a></div>
      </div>
    </section>
  </main>
}
