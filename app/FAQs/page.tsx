import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQGroup } from '@/components/ui/FAQGroup';
import styles from './faqs.module.css';

export const metadata: Metadata = {
  title: 'FAQs de RelNet | ReLead',
  description: 'Preguntas públicas sobre RelNet, conectividad, acceso remoto, archivos, RelNet AI y planes.'
};

export default function FAQsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div><span className={styles.kicker}>RelNet · documentación pública</span><h1>Preguntas frecuentes</h1><p>Conceptos de producto y límites que sí están publicados para las superficies públicas.</p></div>
        <div className={styles.headerActions}><Link href="/pricing" className={styles.primaryAction}>Pricing</Link><Link href="/install" className={styles.secondaryAction}>Instalación</Link></div>
      </header>

      <div className={styles.groups}>
        <FAQGroup title="RelNet" description="Mesh privado, Controllers y caminos de datos." items={[
          { question: '¿Qué es RelNet?', answer: <p>RelNet conecta nodos y servicios dentro de una red privada con un plano de control separado del tráfico ordinario de datos.</p> },
          { question: '¿Cómo se conecta un peer?', answer: <p>RelNet prefiere direct P2P. Si ese camino no está disponible puede intentar Peer Relay y después RelNet Relay, siempre sujeto a autorización y estado aplicable.</p> },
          { question: '¿Qué significa Controller activo-activo?', answer: <p>Los Controllers elegibles pueden coordinar estado sin depender de roles permanentes de primario/secundario. La preferencia de conexión no crea privilegios especiales.</p> },
          { question: '¿Qué son Exit Node y Subnet Router?', answer: <p>Son capacidades de red distintas: Exit Node cubre salida autorizada y Subnet Router acceso a prefijos autorizados. No se presumen habilitadas sólo por pertenecer a un plan.</p> }
        ]} />

        <FAQGroup title="Acceso y archivos" description="Servicios sobre el data path peer." items={[
          { question: '¿RelNet contempla SSH y RDP?', answer: <p>Sí. La disponibilidad efectiva depende de la plataforma, capacidades del nodo y autorización aplicable.</p> },
          { question: '¿Qué son RelDrop y RelShare?', answer: <p>RelDrop cubre transferencias entre peers y RelShare recursos compartidos persistentes, con operaciones sujetas a capacidades y autorización.</p> },
          { question: '¿La API transporta el payload normal de SSH, RDP o archivos?', answer: <p>No como camino ordinario. El control puede autorizar y coordinar; el payload de servicio permanece en el data path peer autorizado.</p> }
        ]} />

        <FAQGroup title="Pricing y RelNet AI" description="Planes, créditos y publicidad." items={[
          { question: '¿Cuáles son los precios públicos?', answer: <p>Free cuesta MXN $0/mes; Pro MXN $199/mes o MXN $1,990/año; Team MXN $499/mes o MXN $4,990/año; Business se cotiza. Consulta <Link href="/pricing">Pricing</Link> como tabla pública compartida.</p> },
          { question: '¿Qué incluye RelNet AI?', answer: <p>Free no incluye RelNet AI. Pro incluye 100 AI Credits al mes. Team incluye un pool de 500 AI Credits al mes. Business usa una cuota contractual configurable. No publicamos equivalencias adicionales para los créditos.</p> },
          { question: '¿Los planes pagados tienen anuncios?', answer: <p>Los dashboards de planes pagados permanecen sin anuncios. Free puede incluir patrocinio nativo directo en su dashboard; scripts publicitarios de terceros están prohibidos allí. Las superficies públicas pueden incluir publicidad contextual o patrocinio directo conforme a su política.</p> }
        ]} />

        <FAQGroup title="Instalación y soporte" description="Publicar sólo flujos congelados." items={[
          { question: '¿Dónde encuentro el instalador?', answer: <p>La ruta <Link href="/install">Instalación</Link> muestra Windows y Linux. Si el paquete o comando final aún no está congelado, la documentación permanece en BLOCKER en lugar de publicar una receta provisional.</p> },
          { question: '¿Dónde inicio sesión?', answer: <p>La experiencia autenticada vive en console.relead.com.mx. relead.com.mx permanece como web pública y api.relead.com.mx como API.</p> }
        ]} />
      </div>
    </main>
  );
}
