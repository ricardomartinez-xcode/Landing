import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad | ReLead',
  description: 'Aviso de Privacidad de ReLead para relead.com.mx y sus soluciones digitales.'
};

const sections = [
  {
    title: 'Responsable y alcance',
    paragraphs: [
      'ReLead (en adelante, “ReLead”, “nosotros” o el “Responsable”) opera relead.com.mx y puede poner a disposición productos, aplicaciones, micrositios, formularios y servicios digitales relacionados.',
      'Este Aviso describe el tratamiento de los Datos Personales que se obtengan al navegar en el Sitio, comunicarse con ReLead o utilizar soluciones que remitan expresamente a este documento. Cuando un producto tenga un aviso particular, ese aviso complementará o prevalecerá para ese producto.'
    ]
  },
  {
    title: 'Datos que podemos tratar',
    paragraphs: [
      'El Sitio está diseñado para solicitar únicamente la información necesaria según la interacción que realices. No solicitamos intencionalmente datos personales sensibles a través de la landing.'
    ],
    bullets: [
      'Datos de contacto que nos proporciones, como nombre, correo, teléfono, empresa o contenido de tu mensaje.',
      'Datos de relación comercial o de soporte cuando solicitas información, una demostración, atención o una propuesta.',
      'Datos técnicos y de uso, como dirección IP, navegador, dispositivo, páginas consultadas, fecha, hora, registros de seguridad y diagnósticos de errores.',
      'Preferencias de cookies e identificadores técnicos cuando se habiliten herramientas de medición, seguridad o experiencia de usuario.'
    ]
  },
  {
    title: 'Finalidades del tratamiento',
    bullets: [
      'Atender solicitudes, mensajes, demostraciones y comunicaciones relacionadas con ReLead.',
      'Operar, proteger, mantener y mejorar el Sitio y las soluciones digitales de ReLead.',
      'Prevenir fraude, abuso, accesos no autorizados y otros riesgos de seguridad.',
      'Cumplir obligaciones legales, contractuales y de auditoría aplicables.',
      'Realizar analítica agregada para entender el uso del Sitio y mejorar su rendimiento.'
    ]
  },
  {
    title: 'Base y decisiones sobre el uso de datos',
    paragraphs: [
      'El tratamiento se realizará, según corresponda, para atender tu solicitud, ejecutar una relación precontractual o contractual, cumplir obligaciones legales, proteger intereses legítimos de seguridad y continuidad operativa, o con tu consentimiento cuando sea requerido.',
      'No utilizamos los datos recabados en esta landing para adoptar decisiones automatizadas que produzcan efectos jurídicos o relevantes sobre las personas sin intervención humana.'
    ]
  },
  {
    title: 'Proveedores, transferencias y terceros',
    paragraphs: [
      'ReLead puede apoyarse en proveedores de infraestructura, hosting, analítica, correo, soporte, seguridad y monitoreo. Estos proveedores podrán tratar datos únicamente para prestar sus servicios a ReLead y bajo obligaciones razonables de confidencialidad y seguridad.',
      'La infraestructura o los proveedores pueden encontrarse dentro o fuera de México. Cuando aplique, ReLead procurará usar medidas contractuales, técnicas y organizativas razonables conforme a la legislación aplicable. ReLead no vende datos personales.'
    ]
  },
  {
    title: 'Conservación y seguridad',
    paragraphs: [
      'Conservamos los datos durante el tiempo necesario para las finalidades descritas, la atención de solicitudes, el cumplimiento de obligaciones legales y la resolución de controversias. Después, procuramos eliminarlos, bloquearlos o anonimizaros según resulte aplicable.',
      'Implementamos medidas administrativas, técnicas y organizativas razonables para reducir riesgos de acceso, pérdida, alteración o uso no autorizado. Ningún sistema puede garantizar seguridad absoluta; por ello mantenemos procesos de prevención, monitoreo y respuesta ante incidentes.'
    ]
  },
  {
    title: 'Derechos y solicitudes',
    paragraphs: [
      'Puedes solicitar acceso, rectificación, cancelación u oposición al tratamiento de tus datos personales, así como ejercer derechos equivalentes que resulten aplicables. Para iniciar una solicitud, utiliza los medios oficiales de contacto publicados por ReLead e indica tu nombre, la relación con ReLead, la información que permita localizar tus datos y el derecho que deseas ejercer.',
      'Podremos solicitar información adicional únicamente para verificar tu identidad o representación. El ejercicio de derechos puede estar sujeto a excepciones y plazos previstos por la legislación aplicable.'
    ]
  },
  {
    title: 'Cookies y tecnologías similares',
    paragraphs: [
      'El Sitio puede usar cookies y tecnologías similares para recordar preferencias, habilitar funciones técnicas, reforzar la seguridad y obtener métricas de uso. Puedes limitar o eliminar cookies desde la configuración de tu navegador; desactivar cookies esenciales puede afectar algunas funciones.',
      'Cuando se incorporen herramientas no esenciales que requieran consentimiento conforme a la normativa aplicable, ReLead habilitará los mecanismos de preferencia correspondientes.'
    ]
  },
  {
    title: 'Cambios y contacto',
    paragraphs: [
      'Podemos actualizar este Aviso para reflejar cambios normativos, operativos o de producto. La versión vigente estará disponible en esta ruta e indicará su fecha de actualización.',
      'Para dudas o solicitudes relacionadas con privacidad, utiliza los medios oficiales de contacto de ReLead. Cuando exista una relación comercial o contractual, también podrás usar el canal señalado en la documentación aplicable.'
    ]
  }
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacidad"
      title="Aviso de Privacidad"
      summary="Cómo ReLead trata la información personal al operar su sitio y sus soluciones digitales."
      updatedAt="27 de junio de 2026"
      sections={sections}
    />
  );
}
