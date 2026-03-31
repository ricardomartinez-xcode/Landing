import Link from 'next/link';
import styles from './page.module.css';
import { SectionReveal } from '@/components/SectionReveal';

const products = [
  {
    name: 'ReCalc',
    stage: 'Activo',
    summary:
      'Calculadoras y experiencias de conversión para becas, cotizaciones y orientación comercial.',
    tech: 'Web app',
    href: '#'
  },
  {
    name: 'Próxima app',
    stage: 'Espacio reservado',
    summary:
      'Un módulo listo para integrar nuevas herramientas sin romper la narrativa de marca.',
    tech: 'Slot modular',
    href: '#arquitectura'
  },
  {
    name: 'Micrositios',
    stage: 'Escalable',
    summary:
      'Páginas hijas, campañas o lanzamientos rápidos con lenguaje visual consistente.',
    tech: 'Landing system',
    href: '#tono'
  }
];

const pillars = [
  {
    title: 'Claridad antes que ruido',
    body: 'La marca se entiende en segundos: qué hace, para quién existe y por qué importa.'
  },
  {
    title: 'Motion con propósito',
    body: 'Las animaciones guían la vista, explican jerarquías y hacen que la interfaz respire.'
  },
  {
    title: 'Sistema, no página aislada',
    body: 'La landing queda lista para crecer a nuevas apps, nuevas rutas y nuevas integraciones.'
  }
];

const flow = [
  {
    title: 'Marca primero',
    description:
      'La home posiciona a ReLead como sistema operativo de productos digitales, no solo como logo.'
  },
  {
    title: 'Producto visible',
    description:
      'Cada app puede vivir como tarjeta, caso destacado o micrositio dentro del mismo universo visual.'
  },
  {
    title: 'Escala sin rehacer',
    description:
      'La estructura modular permite agregar secciones, CMS, analytics, forms o autenticación más adelante.'
  }
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.backdrop} />
      <div className={styles.grid} />

      <nav className={styles.nav}>
        <div className={`${styles.shell} ${styles.navInner}`}>
          <Link href="#top" className={styles.brand}>
            <span className={styles.brandMark}>R</span>
            <span className={styles.brandWord}>ReLead</span>
          </Link>

          <div className={styles.navLinks}>
            <Link href="#ecosistema">Ecosistema</Link>
            <Link href="#arquitectura">Arquitectura</Link>
            <Link href="#tono">Dirección visual</Link>
            <Link href="#contacto" className={styles.buttonGhost}>
              Lanzar sitio
            </Link>
          </div>
        </div>
      </nav>

      <section className={styles.hero} id="top">
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <SectionReveal className={styles.heroCopy}>
            <span className={styles.kicker}>Powered by ReLead</span>
            <h1 className={styles.heroTitle}>
              Un ecosistema digital con <span className={styles.accent}>presencia propia</span>.
            </h1>
            <p className={styles.heroLead}>
              ReLead no se presenta como otra “landing bonita”. Se presenta como una marca que articula
              productos, transmite criterio y deja lista la base para crecer. Esta propuesta mezcla lenguaje
              editorial, microinteracciones sobrias y una estética post-minimalista que se siente diseñada,
              no generada en serie.
            </p>

            <div className={styles.heroActions}>
              <Link href="#ecosistema" className={styles.buttonPrimary}>
                Ver ecosistema
              </Link>
              <Link href="#arquitectura" className={styles.buttonGhost}>
                Revisar estructura
              </Link>
            </div>

            <div className={styles.heroMeta}>
              <div className={styles.metaCard}>
                <strong>01</strong>
                <span>Marca madre con narrativa clara</span>
              </div>
              <div className={styles.metaCard}>
                <strong>Apps</strong>
                <span>Tarjetas listas para crecer con nuevas soluciones</span>
              </div>
              <div className={styles.metaCard}>
                <strong>Vercel</strong>
                <span>Despliegue directo desde GitHub</span>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className={styles.heroVisual} delay={100}>
            <div className={styles.visualFrame}>
              <div className={styles.visualHeader}>
                <div className={styles.browserDots} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className={styles.browserLabel}>relead / brand operating layer</span>
              </div>

              <article className={styles.stackCard}>
                <div className={styles.cardTopline}>
                  <span className={styles.cardTag}>Caso activo</span>
                  <span className={styles.cardStatus}>ReCalc live</span>
                </div>
                <h2 className={styles.cardTitle}>Una marca que conecta producto, confianza y ritmo.</h2>
                <p className={styles.cardDescription}>
                  La landing da contexto a las apps Powered by ReLead y convierte a cada producto en parte de un
                  sistema coherente, con identidad y espacio para iterar.
                </p>

                <div className={styles.barGroup}>
                  <div className={styles.barRow}>
                    <span>Marca</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: '86%' }} />
                    </div>
                    <strong>86%</strong>
                  </div>
                  <div className={styles.barRow}>
                    <span>Claridad</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: '92%' }} />
                    </div>
                    <strong>92%</strong>
                  </div>
                  <div className={styles.barRow}>
                    <span>Escala</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: '88%' }} />
                    </div>
                    <strong>88%</strong>
                  </div>
                </div>
              </article>

              <aside className={styles.miniCard}>
                <span className={styles.cardTag}>Powered by ReLead</span>
                <div className={styles.miniList}>
                  <div className={styles.miniItem}>
                    <span>ReCalc</span>
                    <strong>Conversión</strong>
                  </div>
                  <div className={styles.miniItem}>
                    <span>Nuevo módulo</span>
                    <strong>Integrable</strong>
                  </div>
                  <div className={styles.miniItem}>
                    <span>Micrositio</span>
                    <strong>Lanzamiento</strong>
                  </div>
                </div>
              </aside>

              <aside className={styles.orbitNote}>
                <strong>Post minimalista</strong>
                <span>Menos ornamento obvio, más tensión visual, espacio y jerarquía.</span>
              </aside>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className={styles.section} id="ecosistema">
        <div className={styles.shell}>
          <SectionReveal className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Qué debe comunicar ReLead desde el primer scroll.</h2>
            <p className={styles.sectionLead}>
              La página no solo muestra productos. Explica que ReLead es la capa estratégica que organiza,
              diseña y proyecta herramientas digitales con una misma lógica de marca.
            </p>
          </SectionReveal>

          <div className={styles.manifesto}>
            <SectionReveal className={styles.statement}>
              <div>
                <span className={styles.productEyebrow}>Posicionamiento</span>
                <p>
                  ReLead funciona mejor cuando se presenta como una firma que piensa en términos de sistema:
                  marca, producto, interfaz, mensaje y crecimiento. Por eso la propuesta visual evita el look
                  genérico de startup prefabricada y apuesta por composición editorial, contraste cuidado y una
                  voz más precisa.
                </p>
              </div>
              <strong>Diseño con nervio estratégico, no solo decoración.</strong>
            </SectionReveal>

            <SectionReveal className={styles.pillars} delay={120}>
              {pillars.map((pillar, index) => (
                <article className={styles.pillar} key={pillar.title}>
                  <span className={styles.productEyebrow}>0{index + 1}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </article>
              ))}
            </SectionReveal>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <SectionReveal className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Apps y espacios que pueden colgar de la marca.</h2>
            <p className={styles.sectionLead}>
              Arranqué con ReCalc como producto protagonista y dejé slots listos para nuevos lanzamientos. Así,
              el sitio crece sin sentirse parchado.
            </p>
          </SectionReveal>

          <div className={styles.products}>
            {products.map((product, index) => (
              <SectionReveal key={product.name} delay={index * 120}>
                <article className={styles.productCard}>
                  <header>
                    <span className={styles.productEyebrow}>{product.stage}</span>
                    <h3>{product.name}</h3>
                    <p>{product.summary}</p>
                  </header>

                  <footer className={styles.productFooter}>
                    <span className={styles.badge}>{product.tech}</span>
                    <Link href={product.href} className={styles.buttonGhost}>
                      Explorar
                    </Link>
                  </footer>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="arquitectura">
        <div className={styles.shell}>
          <SectionReveal className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Arquitectura pensada para GitHub hoy y Vercel mañana.</h2>
            <p className={styles.sectionLead}>
              La estructura prioriza mantenibilidad: App Router, componentes pequeños, estilos centralizados y
              secciones que se pueden reemplazar o extender sin romper toda la landing.
            </p>
          </SectionReveal>

          <SectionReveal className={styles.architecture}>
            <span className={styles.productEyebrow}>Base técnica</span>
            <div className={styles.architectureGrid}>
              <div className={styles.archBox}>
                <strong>app/</strong>
                <span>Rutas y layout principal para crecer a nuevas páginas o productos.</span>
              </div>
              <div className={styles.archBox}>
                <strong>components/</strong>
                <span>Bloques reutilizables como reveals, cards y secciones futuras.</span>
              </div>
              <div className={styles.archBox}>
                <strong>globals + módulos</strong>
                <span>Sistema visual central con CSS claro y fácil de editar.</span>
              </div>
              <div className={styles.archBox}>
                <strong>README</strong>
                <span>Guía para correr, desplegar y adaptar el proyecto en equipo.</span>
              </div>
            </div>

            <div className={styles.archFlow}>
              {flow.map((item, index) => (
                <article className={styles.flowStep} key={item.title}>
                  <span className={styles.flowNumber}>{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className={styles.section} id="tono">
        <div className={styles.shell}>
          <SectionReveal className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Dirección visual para que no se vea “hecho por plantilla”.</h2>
            <p className={styles.sectionLead}>
              La clave está en la combinación: composición editorial, contraste muy controlado, paleta fría con
              acentos cálidos medidos, y animación apenas suficiente para generar ritmo sin distraer.
            </p>
          </SectionReveal>

          <SectionReveal className={styles.toneBlock}>
            <div className={styles.quote}>
              “Minimalismo, pero con tensión; tecnología, pero con criterio.”
              <small>Dirección recomendada para la identidad web de ReLead.</small>
            </div>

            <div className={styles.toneList}>
              <div className={styles.toneItem}>
                <strong>Azules y violetas profundos</strong>
                <span>Base visual que comunica tecnología, foco y consistencia de marca.</span>
              </div>
              <div className={styles.toneItem}>
                <strong>Teal como señal de avance</strong>
                <span>Acento para dirigir la vista, marcar estados y elevar CTAs sin gritar.</span>
              </div>
              <div className={styles.toneItem}>
                <strong>Amarillo contenido</strong>
                <span>Un punto de calor para romper la frialdad total y evitar apariencia corporativa plana.</span>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className={`${styles.section} ${styles.ctaWrap}`} id="contacto">
        <div className={styles.shell}>
          <SectionReveal className={styles.ctaCard}>
            <div className={styles.ctaGrid}>
              <div className={styles.ctaText}>
                <h2>Listo para alojar hoy ReCalc y mañana todo lo que siga.</h2>
                <p>
                  La base ya queda armada para conectar formularios, analytics, CMS, nuevas apps o rutas más
                  comerciales. Pueden usar este repo como home oficial de marca y crecer desde aquí.
                </p>
              </div>

              <div className={styles.ctaButtons}>
                <Link href="https://github.com/new" className={styles.buttonPrimary}>
                  Crear repo
                </Link>
                <Link href="https://vercel.com/new" className={styles.buttonGhost}>
                  Desplegar en Vercel
                </Link>
              </div>
            </div>
          </SectionReveal>

          <footer className={styles.footer}>
            <span>
              <strong>ReLead</strong> · diseño de sistema para productos Powered by ReLead
            </span>
            <span>Preparado para GitHub · Vercel · futuras integraciones</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
