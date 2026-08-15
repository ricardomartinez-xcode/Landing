import Link from 'next/link';
import styles from './LegalPage.module.css';

type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  updatedAt: string;
  sections: LegalSection[];
};

export function LegalPage({ eyebrow, title, summary, updatedAt, sections }: LegalPageProps) {
  return (
    <main className={styles.page}>
      <article className={styles.content}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.summary}>{summary}</p>
          <p className={styles.updated}>Última actualización: {updatedAt}</p>
        </header>

        <div className={styles.legalGrid}>
          <nav className={styles.index} aria-label="Contenido de la página">
            <span>Contenido</span>
            <ol>
              {sections.map((section, index) => (
                <li key={section.title}><a href={`#seccion-${index + 1}`}>{section.title}</a></li>
              ))}
            </ol>
          </nav>

          <div className={styles.sections}>
            {sections.map((section, index) => (
              <section id={`seccion-${index + 1}`} key={section.title}>
                <p className={styles.number}>{String(index + 1).padStart(2, '0')}</p>
                <div>
                  <h2>{section.title}</h2>
                  {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer className={styles.footer}>
          <span>ReLead · Información legal</span>
          <Link href={eyebrow === 'Privacidad' ? '/terms' : '/privacy'}>
            {eyebrow === 'Privacidad' ? 'Consultar Términos y Condiciones →' : 'Consultar Aviso de Privacidad →'}
          </Link>
        </footer>
      </article>
    </main>
  );
}
