import Link from 'next/link';
import styles from './page.module.css';
import { SectionReveal } from '@/components/SectionReveal';

const focusAreas = [
  {
    number: '01',
    title: 'Estrategia que aterriza',
    body: 'Convertimos objetivos complejos en una dirección clara para que producto, marca y operación hablen el mismo idioma.'
  },
  {
    number: '02',
    title: 'Producto que acompaña',
    body: 'Diseñamos experiencias digitales simples de recorrer, con contexto, jerarquía y próximos pasos visibles.'
  },
  {
    number: '03',
    title: 'Sistemas que crecen',
    body: 'Construimos bases modulares para sumar nuevas herramientas, rutas y campañas sin volver a empezar.'
  }
];

const products = [
  {
    eyebrow: 'Producto activo',
    title: 'ReCalc',
    description: 'Una experiencia digital para orientar decisiones, simplificar recorridos y dar continuidad a cada proceso.',
    detail: 'Herramienta de atención y seguimiento'
  },
  {
    eyebrow: 'En preparación',
    title: 'Nuevas herramientas',
    description: 'Espacios listos para integrar productos que necesitan una identidad propia dentro de un mismo sistema.',
    detail: 'Arquitectura modular'
  },
  {
    eyebrow: 'Sistema flexible',
    title: 'Micrositios',
    description: 'Lanzamientos, páginas de campaña y experiencias específicas con una dirección visual consistente.',
    detail: 'Listos para evolucionar'
  }
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Navegación principal">
        <div className={`${styles.shell} ${styles.navInner}`}>
          <Link href="#inicio" className={styles.brand} aria-label="Ir al inicio de ReLead">
            <span className={styles.brandMark}>R</span>
            <span>ReLead</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="#productos">Productos</Link>
            <Link href="#enfoque">Enfoque</Link>
            <Link href="#contacto" className={styles.navCta}>Hablemos</Link>
          </div>
        </div>
      </nav>

      <section className={styles.hero} id="inicio">
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <SectionReveal className={styles.heroCopy}>
            <span className={styles.eyebrow}>ReLead · productos digitales con dirección</span>
            <h1>Menos fricción.<br /><span>Más claridad.</span></h1>
            <p>
              Diseñamos sistemas digitales que hacen más simple entender, decidir y avanzar. Marca, producto y experiencia en una misma dirección.
            </p>
            <div className={styles.actions}>
              <Link href="#productos" className={styles.buttonPrimary}>Ver productos <span aria-hidden="true">↘</span></Link>
              <Link href="#enfoque" className={styles.buttonSecondary}>Conocer el enfoque</Link>
            </div>
            <div className={styles.heroNotes} aria-label="Principios de ReLead">
              <span>Claridad primero</span>
              <span>Diseño útil</span>
              <span>Escala con criterio</span>
            </div>
          </SectionReveal>

          <SectionReveal className={styles.heroVisual} delay={100}>
            <div className={styles.productWindow}>
              <div className={styles.windowTop}>
                <div className={styles.windowBrand}><span className={styles.windowDot} /> ReLead / workspace</div>
                <span className={styles.liveBadge}>Activo</span>
              </div>
              <div className={styles.workspace}>
                <div className={styles.workspaceHeader}>
                  <div>
                    <span className={styles.microLabel}>Producto destacado</span>
                    <h2>ReCalc</h2>
                  </div>
                  <span className={styles.statusPill}>En progreso</span>
                </div>
                <p className={styles.workspaceLead}>Una experiencia que pone el siguiente paso al frente.</p>
                <div className={styles.workspaceGrid}>
                  <article className={styles.metricCard}>
                    <span>Contexto</span>
                    <strong>Claro</strong>
                    <small>Información priorizada</small>
                  </article>
                  <article className={`${styles.metricCard} ${styles.metricAccent}`}>
                    <span>Siguiente paso</span>
                    <strong>Visible</strong>
                    <small>Recorrido sin ruido</small>
                  </article>
                </div>
                <div className={styles.progressBlock}>
                  <div className={styles.progressTop}><span>Experiencia de producto</span><strong>72%</strong></div>
                  <div className={styles.progressTrack}><span /></div>
                </div>
              </div>
            </div>
            <div className={styles.floatingNote}>
              <span>Diseñar también es decidir qué quitar.</span>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className={styles.intro} id="enfoque">
        <div className={`${styles.shell} ${styles.introGrid}`}>
          <SectionReveal>
            <span className={styles.eyebrow}>Una lógica compartida</span>
            <h2>Lo digital funciona mejor cuando cada parte tiene un propósito claro.</h2>
          </SectionReveal>
          <SectionReveal delay={90}>
            <p>
              ReLead conecta estrategia, interfaz y operación para que una herramienta no solo se vea bien: se entienda, acompañe y pueda crecer con orden.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className={styles.focusSection}>
        <div className={styles.shell}>
          <div className={styles.focusGrid}>
            {focusAreas.map((area, index) => (
              <SectionReveal key={area.title} delay={index * 90}>
                <article className={styles.focusCard}>
                  <span className={styles.cardNumber}>{area.number}</span>
                  <h3>{area.title}</h3>
                  <p>{area.body}</p>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.productsSection} id="productos">
        <div className={styles.shell}>
          <SectionReveal className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Ecosistema ReLead</span>
              <h2>Una marca. Distintas experiencias.</h2>
            </div>
            <p>Productos y espacios que comparten una misma base visual, pero conservan su función y personalidad.</p>
          </SectionReveal>

          <div className={styles.productGrid}>
            {products.map((product, index) => (
              <SectionReveal key={product.title} delay={index * 110}>
                <article className={styles.productCard}>
                  <div className={styles.productCardTop}>
                    <span>{product.eyebrow}</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <footer>{product.detail}</footer>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={`${styles.shell} ${styles.processCard}`}>
          <SectionReveal className={styles.processCopy}>
            <span className={styles.eyebrow}>De la intención a la experiencia</span>
            <h2>Una base diseñada para cambiar sin perderse.</h2>
            <p>La arquitectura visual y técnica permite lanzar, ajustar y conectar nuevas capas de producto con la misma claridad del primer día.</p>
          </SectionReveal>
          <SectionReveal className={styles.steps} delay={100}>
            <div><span>01</span><strong>Entender</strong><small>Lo que importa antes de diseñar.</small></div>
            <div><span>02</span><strong>Ordenar</strong><small>La información y los recorridos.</small></div>
            <div><span>03</span><strong>Avanzar</strong><small>Con una experiencia lista para crecer.</small></div>
          </SectionReveal>
        </div>
      </section>

      <section className={styles.contactSection} id="contacto">
        <div className={`${styles.shell} ${styles.contactCard}`}>
          <SectionReveal>
            <span className={styles.eyebrow}>ReLead</span>
            <h2>Cuando el siguiente producto necesite claridad, aquí empieza.</h2>
            <p>Una base serena, funcional y preparada para lo que siga.</p>
            <Link href="#inicio" className={styles.buttonPrimary}>Volver al inicio <span aria-hidden="true">↑</span></Link>
          </SectionReveal>
          <SectionReveal className={styles.contactAside} delay={110}>
            <span>Marca</span><span>Producto</span><span>Experiencia</span><span>Sistema</span>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
