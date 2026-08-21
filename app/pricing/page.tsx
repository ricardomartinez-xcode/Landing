import type { Metadata } from 'next';
import Link from 'next/link';
import { aiLabel, formatMxn, monthlyCadence, planCta, publicPlans, yearlyLabel } from '@/lib/public-commercial';
import styles from './pricing.module.css';

export const metadata: Metadata = {
  title: 'Pricing de RelNet | ReLead',
  description: 'Planes públicos de RelNet en MXN, RelNet AI y capacidades de mesh privado, acceso remoto y archivos.'
};

export default function PricingPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.kicker}>RelNet · Pricing</span>
        <h1>Mesh privado, acceso remoto e IA con un plan claro.</h1>
        <p>Precios públicos en MXN. RelNet AI se habilita sólo en los planes que lo incluyen y su consumo se expresa en AI Credits.</p>
        <div className={styles.actions}><a className={styles.primary} href="https://console.relead.com.mx/register">Empezar con Free</a><Link className={styles.secondary} href="/install">Instalación</Link></div>
      </header>

      <section className={styles.plans} aria-label="Planes públicos de RelNet">
        {publicPlans.map((plan) => {
          const cta = planCta(plan);
          return <article className={`${styles.plan} ${plan.slug === 'pro' ? styles.featured : ''}`} key={plan.slug}>
            <div className={styles.planHead}><span>{plan.name}</span>{plan.slug === 'pro' && <small>Recomendado</small>}</div>
            <p>{plan.description}</p>
            <div className={styles.price}><strong>{formatMxn(plan.monthly_price)}</strong><span>{monthlyCadence(plan)}</span><small>{yearlyLabel(plan)}</small></div>
            <div className={styles.ai}><span>RelNet AI</span><strong>{aiLabel(plan)}</strong>
              {plan.slug === 'pro' && <small>100 AI Credits al mes.</small>}
              {plan.slug === 'team' && <small>Pool compartido de 500 AI Credits al mes.</small>}
              {plan.slug === 'business' && <small>Cuota contractual configurable.</small>}
            </div>
            <p className={styles.activation}>{plan.self_service ? 'Alta autoservicio disponible.' : 'Activación asistida; el entitlement se confirma por el flujo comercial.'}</p>
            <a className={plan.slug === 'pro' ? styles.primary : styles.secondary} href={cta.href}>{cta.label}</a>
          </article>;
        })}
      </section>

      <section className={styles.positioning}>
        <div><span className={styles.kicker}>RelNet</span><h2>Una red privada que prefiere direct P2P.</h2><p>RelNet intenta direct P2P entre peers autorizados. Cuando ese camino no está disponible puede usar Peer Relay y después RelNet Relay como fallback; el plano de control no transporta el payload ordinario.</p></div>
        <div className={styles.capabilities}><article><strong>SSH / RDP</strong><p>Acceso remoto según plataforma, capacidad y autorización.</p></article><article><strong>RelDrop / RelShare</strong><p>Archivos y recursos compartidos sobre el data path peer.</p></article><article><strong>Exit Node / Subnet Router</strong><p>Salida o acceso a prefijos donde la capacidad correspondiente esté concedida.</p></article><article><strong>RelNet AI</strong><p>Disponible según plan y cuota publicada.</p></article></div>
      </section>

      <section className={styles.aiPolicy}><span className={styles.kicker}>IA pública</span><h2>Créditos contractuales, sin equivalencias inventadas.</h2><p>Los AI Credits son la unidad pública de consumo de RelNet AI. Free no incluye RelNet AI; Pro incluye 100 AI Credits al mes; Team incluye un pool de 500 AI Credits al mes; Business usa una cuota contractual configurable.</p></section>

      <section className={styles.ads}><span className={styles.kicker}>Publicidad</span><h2>La regla depende de la superficie.</h2><p>Free puede incluir patrocinio nativo directo en su dashboard. Scripts de terceros están prohibidos en ese dashboard.</p><p>Los planes de pago permanecen sin anuncios en el dashboard.</p><p>Las superficies públicas pueden mostrar publicidad contextual o patrocinio directo conforme a la política pública vigente.</p></section>

      <footer className={styles.footer}><Link href="/FAQs">FAQs</Link><Link href="/install">Instalación</Link><a href="https://console.relead.com.mx/">Abrir Console</a></footer>
    </main>
  );
}
