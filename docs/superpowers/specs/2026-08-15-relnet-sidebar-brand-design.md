# RelNet Sidebar & Brand Refresh — Diseño aprobado

Fecha: 2026-08-15
Estado: aprobado para planificación
Opción elegida: A — identidad RelNet conservada con sidebar compacto y refinado

## Objetivo

Corregir el bloque blanco que aparece detrás del logo RelNet en el sidebar y mejorar la jerarquía visual del shell sin cambiar la arquitectura de navegación ni introducir dependencias innecesarias.

El resultado debe sentirse como un control plane técnico, limpio y profesional, coherente con el lenguaje visual del prototipo ReLead Control Plane: navy oscuro, cian como acento, superficies discretas, estados claros y densidad media.

## Causa del problema observado

`components/shell/AppShell.tsx` muestra actualmente el activo `/relnet-brand.webp` dentro del sidebar. En la UI actual ese activo se renderiza con un rectángulo blanco visible sobre el fondo oscuro. El repositorio también contiene `public/relnet-brand.png`, cuyo formato incluye transparencia.

La corrección no debe ocultar el defecto con un fondo adicional en CSS. Debe usar un activo de marca que preserve la transparencia y ajustar el contenedor del logo para que la identidad se integre naturalmente con el sidebar.

## Alcance visual aprobado

### 1. Marca

- Mantener el logotipo RelNet como identidad principal.
- Usar una variante transparente del activo de marca.
- Eliminar cualquier caja blanca o superficie visible alrededor del logo.
- Reducir su presencia vertical para liberar espacio en la navegación.
- Mantener proporción y nitidez en desktop, tablet y móvil.

### 2. Sidebar

- Ancho desktop ligeramente más compacto que el actual, conservando legibilidad.
- Espaciado vertical más consistente entre marca, estado de entorno, navegación y acciones externas.
- Fondo navy casi negro con borde lateral sutil.
- Estados hover y activo con contraste suficiente, sin bloques excesivamente brillantes.
- La tarjeta `RelNet · Private control plane` se mantiene, pero se simplifica visualmente para funcionar como indicador de contexto/estado y no competir con la marca.

### 3. Navegación

- Sustituir los indicadores textuales `IN`, `IS`, `FQ`, `PR`, `TM` por iconos SVG simples y consistentes.
- No añadir librerías de iconos salvo que ya existan; preferir SVG inline o componentes locales ligeros.
- Mantener exactamente las rutas actuales:
  - `/`
  - `/install`
  - `/FAQs`
  - `/privacy`
  - `/terms`
- El estado activo debe usar cian/acento y una superficie suave.
- Mantener etiquetas completas en desktop y drawer móvil.

### 4. Responsive

- Desktop: sidebar fijo y compacto.
- Tablet: conservar el modo reducido existente, pero mostrar un isotipo o recorte de marca limpio en vez de un recorte accidental del logo horizontal.
- Móvil: drawer lateral con logo transparente, botón de cierre accesible y backdrop.
- No introducir scroll horizontal global ni saltos de layout.

### 5. Accesibilidad

- Mantener `aria-label`, `aria-current` y navegación semántica.
- Iconos decorativos con `aria-hidden="true"` cuando corresponda.
- Foco visible para enlaces y botones.
- Contraste suficiente en texto secundario, estado activo y controles.
- Respetar `prefers-reduced-motion`.

## Arquitectura y archivos previstos

Cambios limitados al shell y activos relacionados:

- `components/shell/AppShell.tsx`
  - activo de marca transparente;
  - estructura de iconos de navegación;
  - pequeños ajustes semánticos si son necesarios.
- `components/shell/AppShell.module.css`
  - dimensiones del sidebar;
  - tratamiento de marca;
  - navegación, estado activo y responsive;
  - foco visible y ajustes de densidad.
- `components/shell/nav.ts`
  - mantener rutas y labels;
  - sustituir abreviaturas visuales por identificadores de icono si resulta útil para mantener el componente limpio.
- `public/`
  - reutilizar el PNG transparente existente o generar una variante optimizada transparente derivada del activo fuente, únicamente si mejora peso/nitidez sin alterar la identidad.

No se modificarán páginas de contenido, lógica de instalación, APIs, autenticación ni despliegue.

## Estrategia de implementación

1. Añadir una prueba de contrato que falle si el shell vuelve a usar el activo de marca problemático o si desaparecen las rutas principales.
2. Cambiar únicamente la fuente/representación de marca necesaria para resolver el fondo blanco.
3. Refactorizar la representación de los glyphs de navegación a iconos SVG ligeros.
4. Ajustar CSS del sidebar en desktop/tablet/móvil.
5. Ejecutar tests, lint y build.
6. Verificar visualmente en al menos tres anchos representativos: desktop, tablet y móvil.

## Criterios de aceptación

- El logo RelNet se ve integrado sobre el fondo oscuro sin rectángulo blanco.
- La marca no domina visualmente el sidebar.
- Navegación con iconos claros y consistentes; no aparecen `IN`, `IS`, `FQ`, `PR`, `TM` como sustitutos de iconos.
- La ruta activa se identifica con claridad sin exceso de contraste.
- La tarjeta de entorno se percibe secundaria respecto a la marca y navegación.
- Sidebar y drawer funcionan correctamente en desktop, tablet y móvil.
- No cambian las URLs ni el comportamiento funcional de navegación.
- Tests, lint y build completan sin errores.
- No se publica ni despliega automáticamente como parte de este cambio.

## Fuera de alcance

- Rediseño de las páginas internas de Inicio, Instalación, FAQs, Privacidad o Términos.
- Cambios de backend/API.
- Cambios en `api.relead.com.mx`.
- Nuevas dependencias de UI salvo necesidad justificada y aprobada.
- Promoción o despliegue a producción.
