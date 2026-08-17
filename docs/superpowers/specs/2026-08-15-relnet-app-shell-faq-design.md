# RelNet App Shell + FAQs Design

## Objetivo
Rediseñar `relead.com.mx` como una superficie tipo aplicación, preservando logo/favicon, comportamiento actual y despliegue OpenNext/Cloudflare. Se añade `/FAQs` como ruta principal y se unifica navegación, controles, paneles, tablas y responsive.

## Estado verificado
El repositorio usa Next.js 16.2.11 + React 19.2.4. Hoy solo existen `/`, `/install`, `/privacy` y `/terms`. Se revisó todo el historial de `Landing`, sus 9 PR refs alcanzables y el checkout accesible de RelNet v89: no existe archivo, ruta ni contenido con `FAQ`, `FAQs` o `Preguntas frecuentes`. Por ello `/FAQs` se implementará como funcionalidad nueva, no como restauración de una revisión Git recuperable.

## Dirección aprobada
Usar la opción 3: **app-shell completo** en todas las rutas. Debe sentirse como un producto técnico deliberadamente diseñado, no como landing genérica. Evitar gradientes ornamentales, glows, tarjetas repetitivas, redondeos excesivos y composiciones artificiales de hero + cards.

## Shell global
Todas las rutas comparten:
- sidebar persistente en escritorio;
- sidebar compacta en anchos intermedios;
- drawer en móvil/tablet estrecha;
- topbar con contexto y tema;
- área principal adaptable;
- navegación activa accesible.

Orden principal: Inicio `/`, Instalación `/install`, FAQs `/FAQs`, Privacidad `/privacy`, Términos `/terms`.

`/FAQs` será canónica y `/faqs` redirigirá a `/FAQs`.

## Marca y tema
No redibujar, recolorear ni sustituir logo, favicon o iconos RelNet existentes.

Tema con modos `system`, `light`, `dark`: system por defecto, elección explícita persistida localmente, sin flash visible de tema incorrecto. Usar variables semánticas para fondos, superficies, texto, bordes, acento, estados y focus.

## Componentes compartidos
Separar componentes enfocados:
- `components/shell/*`: AppShell, Sidebar, MobileNav, Topbar, NavItem.
- `components/theme/*`: bootstrap y control de tema.
- `components/ui/*`: botones, select/dropdown, disclosure/accordion, panel y patrón de tabla.
- refactor de `LegalPage` para integrarlo al shell.

Tablas: ancho mínimo legible, nunca romper IDs/URLs carácter por carácter, scroll horizontal antes que compresión destructiva y detalle apilado en móvil cuando convenga.

## Rutas
### `/`
Convertir la landing larga en overview de producto dentro del shell. Conservar capacidades ya descritas, reorganizadas en resumen, estado/capacidades, arquitectura, primeros pasos, seguridad y accesos directos a instalación/FAQs.

### `/install`
Conservar enlaces operativos existentes, incluido Admin y descargas iOS. Reorganizar como workspace de instalación con selector de plataforma, estado detectado, pasos progresivos, ayuda/avanzado desplegable y controles seguros en móvil.

### `/FAQs`
Crear `app/FAQs/page.tsx`. Como no existe fuente v89 recuperable, el contenido se basará únicamente en capacidades ya presentes en el sitio/repositorio, sin inventar garantías. Categorías: General, Instalación/plataformas, Red/acceso remoto, Seguridad/identidad, Móvil/iPhone, Administración/solución de problemas. Usar accordion accesible con teclado y `aria-expanded`; incluir enlaces contextuales a `/install`, `/` y Admin cuando aplique.

### `/privacy` y `/terms`
Mantener el contenido legal semánticamente intacto y llevarlo al shell con ancho editorial, jerarquía tipográfica y contraste adecuado.

## Responsive y accesibilidad
- Phone: una columna, drawer, objetivos táctiles ~44 px, sin clipping.
- Tablet: grid adaptable y drawer/sidebar compacta.
- Laptop/desktop: sidebar persistente y uso eficiente del ancho.
- Wide desktop: paneles/tablas pueden crecer, prosa mantiene ancho controlado.
- Sin overflow horizontal salvo tablas/código intencionalmente desplazables.
- Landmarks semánticos, focus visible, `aria-current`, navegación por teclado, `prefers-reduced-motion`, etiquetas accesibles y orden correcto de headings.

## Rutas y enlaces
Deben responder: `/`, `/install`, `/FAQs`, `/privacy`, `/terms`. `/faqs` redirige a `/FAQs`. Las rutas estáticas de descarga existentes se mantienen. Los enlaces a Admin siguen siendo externos.

## Validación
Antes de completar:
1. `npm run lint` pasa.
2. `npm run build` pasa.
3. OpenNext/Cloudflare build sigue válido.
4. Smoke de las 5 rutas + redirect `/faqs`.
5. Auditoría de enlaces internos sin destinos inexistentes.
6. Revisión responsive en phone/tablet/desktop.
7. Verificación light/dark/system y persistencia.
8. Teclado en sidebar/drawer/selectores/FAQs.
9. Enlaces externos y descargas de instalación siguen funcionales y sin clipping.

## No objetivos
No cambiar backend/API, no rediseñar marca, no inventar capacidades y no desplegar a producción salvo instrucción explícita posterior.
