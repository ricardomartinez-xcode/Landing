import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQGroup } from '@/components/ui/FAQGroup';
import { PublicAdSlot } from '@/components/monetization/PublicAdSlot';
import styles from './faqs.module.css';

const adminUrl = 'https://api.relead.com.mx/admin/';

export const metadata: Metadata = {
  title: 'FAQs | RelNet by ReLead',
  description: 'Preguntas frecuentes sobre RelNet, instalación, red privada, seguridad, acceso remoto y uso móvil.'
};

export default function FAQsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>Centro de ayuda</span>
          <h1>Preguntas frecuentes</h1>
          <p>Respuestas rápidas sobre cómo se instala, conecta y opera RelNet en los escenarios que ya soporta la plataforma.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/install" className={styles.primaryAction}>Ir a instalación</Link>
          <a href={adminUrl} className={styles.secondaryAction}>Abrir Admin ↗</a>
        </div>
      </header>

      <div className={styles.notice}>
        <span>Documentación de producto</span>
        <p>Estas respuestas describen capacidades publicadas por RelNet. Las opciones disponibles para un nodo dependen de su sistema operativo, capacidades declaradas y permisos.</p>
      </div>

      <PublicAdSlot surface="public_docs" format="contextual_ad" placement="faqs_after_intro" />

      <div className={styles.groups}>
        <FAQGroup
          title="General"
          description="Qué es RelNet y cómo se organiza la plataforma."
          items={[
            {
              question: '¿Qué es RelNet?',
              answer: <p>RelNet conecta equipos dentro de una red privada y añade un plano central para administrar nodos, políticas, telemetría, archivos y acciones remotas.</p>
            },
            {
              question: '¿Console y Admin son lo mismo?',
              answer: <p>No. Console está orientada a la operación cotidiana de nodos y red; Admin concentra funciones administrativas, observabilidad, recuperación y mantenimiento de la plataforma.</p>
            },
            {
              question: '¿Qué equipos puedo incorporar?',
              answer: <p>El sitio actual contempla nodos Windows y Linux, además de acceso móvil mediante la experiencia web y los flujos disponibles para iPhone/iPad.</p>
            }
          ]}
        />

        <FAQGroup
          title="Instalación y plataformas"
          description="Cómo entrar a RelNet desde escritorio o móvil."
          items={[
            {
              question: '¿Dónde empiezo la instalación?',
              answer: <p>Usa el <Link href="/install">workspace de instalación</Link>. Ahí se muestran las opciones por plataforma y los accesos existentes a Console, Admin e instrucciones para iOS.</p>
            },
            {
              question: '¿Existe una experiencia para iPhone o iPad?',
              answer: <p>Sí. La ruta de instalación incluye la Web App de RelNet Console y el kit de Atajos para acciones compatibles desde iOS y Siri.</p>
            },
            {
              question: '¿Android tiene aplicación nativa?',
              answer: <p>La experiencia publicada actualmente utiliza la PWA/Console web. El sitio no presenta el APK nativo como una descarga final disponible.</p>
            }
          ]}
        />

        <FAQGroup
          title="Red y acceso remoto"
          description="Conectividad, nodos y operación dentro de la red privada."
          items={[
            {
              question: '¿RelNet expone directamente mis equipos a Internet?',
              answer: <p>La arquitectura descrita por el producto conecta los nodos dentro de una red privada RelNet Mesh y concentra la operación remota en sus superficies de control.</p>
            },
            {
              question: '¿Puedo ejecutar comandos remotos?',
              answer: <p>Los nodos que declaran capacidades de terminal pueden ejecutar operaciones remotas desde las superficies y flujos autorizados. La capacidad concreta depende del nodo y su sistema operativo.</p>
            },
            {
              question: '¿RelNet puede funcionar como nodo de salida?',
              answer: <p>RelNet contempla nodos de salida autorizados para enrutar tráfico cuando esa capacidad está habilitada y permitida para el nodo.</p>
            },
            {
              question: '¿Puedo mover archivos entre nodos?',
              answer: <p>La plataforma publica capacidades de transferencia y recursos compartidos entre nodos compatibles dentro de la red privada.</p>
            }
          ]}
        />

        <FAQGroup
          title="Seguridad e identidad"
          description="Cómo se controla quién entra y qué puede hacer cada nodo."
          items={[
            {
              question: '¿Cómo se identifica un nodo?',
              answer: <p>El producto describe identidad Ed25519 por nodo, aprobación explícita y capacidades declaradas para separar la identidad del equipo de los permisos de operación.</p>
            },
            {
              question: '¿Vincular un equipo le da acceso total automáticamente?',
              answer: <p>No. RelNet separa vinculación, aprobación, reautenticación, capacidades y políticas. La incorporación de un nodo no equivale a conceder acceso irrestricto.</p>
            },
            {
              question: '¿Cómo se protegen las acciones remotas?',
              answer: <p>El sitio actual menciona políticas por nodo, rotación de credenciales, actualizaciones firmadas y leases de comandos como parte del modelo de operación protegida.</p>
            }
          ]}
        />

        <FAQGroup
          title="Móvil e iPhone"
          description="Console, Atajos y acciones desde el teléfono."
          items={[
            {
              question: '¿Los Atajos de iOS guardan el token en cada atajo?',
              answer: <p>El kit publicado usa un atajo base “RelNet · API” para centralizar el token; los demás flujos llaman a ese helper en lugar de duplicarlo.</p>
            },
            {
              question: '¿Puedo usar Siri con RelNet?',
              answer: <p>Sí, para los Atajos documentados en el kit móvil. La acción final sigue dependiendo de que el nodo esté en línea y declare la capacidad solicitada.</p>
            },
            {
              question: '¿Dónde están las instrucciones completas de iOS?',
              answer: <p>Están enlazadas desde <Link href="/install">Instalación</Link>, junto con el paquete público de instrucciones y los flujos disponibles.</p>
            }
          ]}
        />

        <FAQGroup
          title="Administración y problemas"
          description="Qué revisar cuando algo no aparece o no responde."
          items={[
            {
              question: 'Un nodo aparece pero una acción no está disponible. ¿Por qué?',
              answer: <p>Las acciones se condicionan a las capacidades declaradas por el nodo, su estado efectivo y los permisos aplicables. Revisa primero esos datos antes de asumir un fallo de la interfaz.</p>
            },
            {
              question: '¿Dónde reviso la salud o administración de la plataforma?',
              answer: <p>Usa <a href={adminUrl}>Admin</a> para las funciones administrativas y de observabilidad que estén habilitadas para tu sesión.</p>
            },
            {
              question: '¿Dónde consulto la información legal?',
              answer: <p>Las rutas <Link href="/privacy">Privacidad</Link> y <Link href="/terms">Términos</Link> permanecen como secciones principales del sitio.</p>
            }
          ]}
        />
      </div>
    </main>
  );
}
