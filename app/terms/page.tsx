import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | ReLead',
  description: 'Términos y Condiciones de uso de relead.com.mx y las soluciones digitales de ReLead.'
};

const sections = [
  {
    title: 'Aceptación y alcance',
    paragraphs: [
      'Al acceder, navegar o utilizar relead.com.mx (el “Sitio”) aceptas estos Términos y Condiciones. Si no estás de acuerdo, debes abstenerte de utilizar el Sitio.',
      'ReLead puede poner a disposición productos, demostraciones, aplicaciones, micrositios y otros servicios digitales. Las condiciones particulares de una solución, propuesta, contrato u orden de servicio complementarán estos Términos y prevalecerán cuando exista conflicto.'
    ]
  },
  {
    title: 'Uso permitido',
    paragraphs: [
      'Te comprometes a utilizar el Sitio de manera lícita, responsable y conforme a estos Términos. Si actúas en nombre de una organización, declaras que cuentas con facultades suficientes para obligarla.'
    ],
    bullets: [
      'No intentarás acceder sin autorización a sistemas, cuentas, datos o redes relacionadas con ReLead.',
      'No interferirás con la disponibilidad, seguridad o funcionamiento del Sitio, incluyendo automatizaciones abusivas, extracción masiva de información o ataques de denegación de servicio.',
      'No introducirás código malicioso, contenido ilegal o información que infrinja derechos de terceros.',
      'No descompilarás, realizarás ingeniería inversa ni intentarás obtener código fuente, salvo en los casos expresamente permitidos por la ley aplicable.'
    ]
  },
  {
    title: 'Información, propuestas y resultados',
    paragraphs: [
      'La información publicada en el Sitio tiene fines generales e informativos. La disponibilidad, alcance, precio, calendario, integración o funcionalidad de cualquier producto o servicio puede cambiar sin previo aviso.',
      'Las demostraciones, estimaciones, calculadoras y resultados generados por soluciones de ReLead dependen de los datos, configuraciones y supuestos disponibles. No constituyen por sí mismos una oferta vinculante, asesoría legal, financiera, fiscal o contable, ni sustituyen la validación con la institución, proveedor o asesor competente.'
    ]
  },
  {
    title: 'Propiedad intelectual',
    paragraphs: [
      'El Sitio, sus interfaces, textos, marcas, logotipos, software, bases de datos, diseño y demás materiales son propiedad de ReLead o de sus licenciantes y están protegidos por la legislación aplicable.',
      'Te otorgamos una licencia limitada, revocable, no exclusiva y no transferible para utilizar el Sitio conforme a estos Términos. No adquieres derechos sobre marcas, nombres comerciales, contenidos o componentes del Sitio.'
    ]
  },
  {
    title: 'Contenido de usuarios y comunicaciones',
    paragraphs: [
      'Eres responsable de la información que envíes a ReLead. Declara que cuentas con los derechos, autorizaciones y bases necesarias para compartirla y que no incluirás datos sensibles o confidenciales en campos que no estén destinados a ello.',
      'No envíes secretos, credenciales, datos bancarios ni información altamente sensible a través de canales abiertos del Sitio, salvo que ReLead habilite expresamente un medio seguro para ese fin.'
    ]
  },
  {
    title: 'Enlaces y servicios de terceros',
    paragraphs: [
      'El Sitio puede enlazar a servicios, sitios o productos de terceros. Esos recursos se rigen por sus propias políticas y condiciones. ReLead no controla ni garantiza su disponibilidad, contenido, prácticas de privacidad o seguridad.'
    ]
  },
  {
    title: 'Disponibilidad y cambios',
    paragraphs: [
      'Buscamos mantener el Sitio disponible y actualizado, pero pueden presentarse mantenimientos, fallas, interrupciones, cambios de diseño, limitaciones técnicas o eventos fuera de nuestro control.',
      'Podemos modificar, suspender o retirar contenidos y funcionalidades cuando sea razonable hacerlo. También podemos limitar el acceso cuando detectemos uso que infrinja estos Términos o represente un riesgo para la seguridad u operación.'
    ]
  },
  {
    title: 'Limitación de responsabilidad',
    paragraphs: [
      'En la medida permitida por la legislación aplicable, ReLead no será responsable por daños indirectos, incidentales, especiales, consecuenciales o punitivos, ni por pérdidas de datos, ingresos, oportunidades o reputación derivadas del uso o imposibilidad de uso del Sitio.',
      'Nada en estos Términos limita responsabilidades que no puedan excluirse conforme a la ley aplicable.'
    ]
  },
  {
    title: 'Privacidad, ley aplicable y contacto',
    paragraphs: [
      'El tratamiento de datos personales se rige por el Aviso de Privacidad disponible en /privacy. Estos Términos se interpretarán conforme a la legislación aplicable y cualquier controversia se atenderá ante las autoridades competentes, sin perjuicio de derechos irrenunciables que correspondan.',
      'Podemos actualizar estos Términos. La versión vigente se publicará en esta ruta con su fecha de actualización. Para dudas, utiliza los medios oficiales de contacto publicados por ReLead.'
    ]
  }
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Términos"
      title="Términos y Condiciones"
      summary="Reglas de uso para relead.com.mx y las soluciones digitales operadas por ReLead."
      updatedAt="27 de junio de 2026"
      sections={sections}
    />
  );
}
