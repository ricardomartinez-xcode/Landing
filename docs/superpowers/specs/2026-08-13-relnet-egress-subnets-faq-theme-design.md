# RelNet v88: salida a Internet, subredes opt-in, FAQs y tema unificado

Fecha: 2026-08-13  
Estado: aprobado conceptualmente por el usuario; pendiente de revisión de esta especificación

## Resumen

RelNet v88 permitirá que cada nodo elija su salida a Internet entre su conexión
local, el gateway administrado Controller/Relay u otro nodo compatible. Los
gateways podrán anunciar subredes a toda RelNet, pero cada nodo decidirá si usa
la ruta local o la ruta remota. La aplicación será estado deseado auditable y
estado aplicado reportado por agentes, con protección contra fugas por defecto.

La misma entrega añadirá ayuda contextual desde `/console`, publicará un centro
de documentación sin autenticación en `https://relead.com.mx/FAQs`, lo enlazará
en el footer público junto con `/terms` y `/privacy`, y unificará el tema visual
de consola, instalación, login, páginas públicas y flujos de aprobación.

## Objetivos

- Elegir la salida a Internet por nodo: local, Controller/Relay o nodo elegible.
- Bloquear la salida si el gateway elegido falla, salvo fallback local
  explícitamente habilitado por nodo.
- Anunciar subredes globalmente sin instalar rutas automáticamente.
- Permitir que cada consumidor elija, por subred, entre red local y RelNet.
- Mostrar por separado configuración deseada y configuración realmente aplicada.
- Simplificar anuncio, activación, diagnóstico y desactivación desde `/console`.
- Mantener el controller lógico como plano de control, no como ejecutor.
- Conservar SSH, Tailscale, WireGuard/Relay, IKEv2, UFW y rutas de recuperación.
- Publicar documentación de producto accesible sin autenticación.
- Aplicar el tema visual vigente a todas las páginas HTML, incluidas aprobaciones.

## No objetivos

- Reemplazar DNS del nodo o implantar un DNS corporativo para las subredes.
- Habilitar subredes automáticamente en todos los nodos.
- Convertir el controller lógico en un host con trabajos o terminal.
- Modificar, desactivar o vaciar reglas existentes de UFW, Tailscale, Hyper-V,
  Windows Firewall o NAT que no pertenezcan a RelNet.
- Publicar datos de producción, nombres de nodos, IP privadas o secretos en FAQs.
- Cambiar la semántica de las 30 GPT Actions salvo que una operación existente
  necesite parámetros compatibles; cualquier cambio conservará el límite exacto.

## Estado actual de v87

- `exit_node` y `subnet_routes` son intención almacenada en `relnet_nodes`.
- Los heartbeats entregan esa intención, pero no existe confirmación de aplicación.
- Los agentes WireGuard limitan `AllowedIPs` a `10.77.0.0/16`.
- No hay asignación fuente → gateway, NAT de salida ni selección de subred por
  consumidor.
- `/console` expone `configure_network` mediante un formulario técnico con JSON.
- El sitio público ya sirve Términos en `/terms` y Privacidad en `/privacy`.
- `/FAQs` no existe.
- Las aprobaciones host-admin y OAuth tienen branding, pero conservan estilos
  diferentes y páginas de resultado/expiración con presentación mínima.

## Decisiones de producto aprobadas

1. Cada nodo puede elegir `local`, `controller_relay` o un nodo elegible como
   gateway de Internet.
2. El modo predeterminado ante falla es `block` (fail-closed).
3. `fallback_local` existe como opción avanzada, apagada y acompañada de una
   advertencia explícita de posible cambio de IP pública.
4. Un gateway anuncia una subred a toda RelNet, pero el anuncio no instala rutas.
5. Cada nodo selecciona `local` o `relnet` por anuncio de subred.
6. El valor predeterminado para una subred anunciada es `local`.
7. Las ACL siguen autorizando el acceso; visibilidad no equivale a permiso.
8. `/FAQs` es pública y canónica en `https://relead.com.mx/FAQs`.
9. El footer público muestra FAQs, Términos y Política de Privacidad.

## Arquitectura de control

### Gateways

Un gateway es una identidad de enrutamiento distinta de un controller lógico:

- `controller_relay`: gateway administrado dentro del dataplane del Relay.
- `node`: nodo Linux o Windows que anuncia y aplica capacidad de forwarding/NAT.

Un nodo solo aparecerá como elegible si está activo, en línea, conectado al
dataplane, anuncia la capacidad de gateway y supera su preflight local. El
preflight debe detectar conflictos de NAT, permisos, interfaces o rutas sin
modificar el host. Marcar un nodo como disponible y elegirlo como gateway serán
acciones distintas y auditadas.

### Datos persistentes

Se incorporarán tres entidades explícitas en vez de sobrecargar más campos JSON:

#### `relnet_gateways`

- `gateway_id`, `network_id`, `kind`, `node_id` opcional y nombre visible.
- `desired_enabled` y estado aplicado (`pending`, `applying`, `active`,
  `degraded`, `error`, `disabled`).
- capacidades detectadas, revisión deseada/aplicada y último error seguro.
- unicidad por gateway de sistema o por nodo.

#### `relnet_subnet_advertisements`

- `advertisement_id`, `network_id`, `gateway_id`, `cidr` y nombre.
- estado deseado/aplicado, revisión, auditoría y timestamps.
- unicidad por red y CIDR mientras esté habilitada.
- validación de CIDR privado, límites de cantidad y detección de solapamientos.

#### `relnet_route_preferences`

- nodo consumidor y destino `internet` o `subnet`.
- para Internet: modo `local` o `relnet`, gateway y política de falla.
- para subred: anuncio y modo `local` o `relnet`.
- revisión deseada/aplicada, estado y error seguro.
- restricciones que impiden elegir el mismo nodo como su propio gateway remoto.

Los campos heredados `exit_node` y `subnet_routes` se conservarán durante la
migración como proyección de compatibilidad. No se usarán como prueba de que la
ruta está activa.

### Heartbeat y reconciliación

El heartbeat devolverá un bloque versionado `network_configuration`:

- `revision` monotónica.
- bypasses exactos para API, Relay y endpoints WireGuard activos.
- selección de Internet, gateway, fail policy y parámetros de health.
- anuncios de subred que el nodo ofrece como gateway.
- suscripciones de subred que el nodo debe instalar como consumidor.

El agente validará toda la revisión antes de aplicarla. La aplicación será
atómica: preparar, validar conectividad de control, activar y reportar. Si falla,
restaurará la última revisión válida y reportará `error`; nunca confirmará
`active` por haber recibido solamente la intención.

El reporte incluirá revisión aplicada, rutas gestionadas, estado de gateway/NAT,
handshake y error categorizado sin comandos, credenciales ni configuración
completa del host.

## Dataplane y seguridad

### Consumidor de salida a Internet

- Conserva primero rutas específicas hacia API, Relay y endpoints de peers por
  la interfaz física original para evitar un túnel circular.
- Envía el default route administrado al gateway elegido mediante RelNet.
- Instala una regla de bloqueo asociada a RelNet cuando la política es `block`.
- Solo retira esa protección y vuelve a la ruta local cuando el administrador
  habilitó `fallback_local`.
- Mantiene un cache local firmado de la última revisión para reaplicarla tras
  reinicio sin abrir una ventana de fuga.

### Gateway

- Habilita forwarding únicamente para interfaces y prefijos RelNet.
- Aplica NAT/MASQUERADE en una tabla/cadena propiedad de RelNet.
- Nunca limpia ni reemplaza reglas ajenas.
- Aplica ACL antes del forwarding y limita los orígenes a nodos autorizados.
- Publica health separado para dataplane, NAT y uplink.

Linux usará policy routing y una tabla nftables dedicada a RelNet. Windows usará
las APIs nativas de forwarding/WinNAT solamente tras un preflight compatible; si
detecta un NAT incompatible o una plataforma sin soporte, no anunciará capacidad
de gateway. Latitude deberá superar este preflight antes de mostrarse como salida.

El gateway Controller/Relay vivirá en el servicio de dataplane con capacidades
mínimas y NAT limitado a tráfico RelNet. No necesita `network_mode: host`, socket
Docker, filesystem raíz ni convertir el controller lógico en ejecutor.

### Subredes

- Un anuncio global describe disponibilidad; no modifica consumidores.
- `local` no instala una ruta RelNet para ese CIDR.
- `relnet` instala la ruta hacia el gateway del anuncio.
- En un solapamiento exacto, la selección explícita decide; no se permiten rutas
  ambiguas simultáneas administradas por RelNet.
- Al desactivar un anuncio, los consumidores eliminan la ruta de forma controlada
  y conservan el modo local.
- Si el gateway falla, el destino remoto queda bloqueado hasta recuperación o
  cambio administrativo; no cambia de gateway silenciosamente.

### Recuperación

- El canal de control permanece accesible por bypass explícito.
- La consola incluye “Volver a salida local” y “Desactivar uso de subred” como
  acciones confirmadas.
- El agente admite un comando de recuperación firmado que solo elimina reglas
  propiedad de RelNet.
- La promoción conserva rollback de aplicación, base de datos y agentes.

## Experiencia en `/console`

### Salida a Internet

Una vista por nodo mostrará:

- salida actual y deseada;
- select de `Red local`, `Controller/Relay` o gateway elegible;
- estado y última verificación del gateway;
- switch avanzado de fallback local con advertencia;
- resumen de impacto y confirmación de un solo uso;
- estado `pendiente`, `aplicando`, `activa`, `degradada` o `error`.

No se exigirá JSON para el flujo normal. El panel avanzado seguirá disponible
para diagnóstico controlado, no como ruta principal.

### Subredes

El flujo guiado tendrá dos pasos independientes:

1. **Anunciar subred:** gateway, nombre y CIDR, con preflight y resumen.
2. **Elegir uso por nodo:** `Red local` o `Usar vía RelNet` para cada anuncio.

La tabla global mostrará gateway, CIDR, estado, consumidores activos y conflictos.
Las tarjetas de cada nodo mostrarán subredes disponibles y su selección. Activar
una subred requerirá confirmación; escoger `local` será una desactivación segura.

### Ayuda contextual

Políticas, capacidades, subredes, salida a Internet, VPN móvil, SSH, RelDrop y
RelShare mostrarán enlaces “Conocer más” a anclas públicas bajo
`https://relead.com.mx/FAQs`. Abrirlos no enviará cookies, datos del nodo ni
parámetros operativos; se usará una URL fija y `rel="noreferrer"`.

## Centro público `relead.com.mx/FAQs`

La página se implementará en el proyecto Next.js público, no en `/console` ni en
`api.relead.com.mx`. Debe responder 200 sin autenticación ni cookies de consola.
El contenido principal será renderizado en servidor para accesibilidad e
indexación; el buscador será una mejora progresiva cliente.

Secciones:

1. **RelNet:** conceptos, arquitectura, nodos, controller y Relay.
2. **RelNet Policies:** propósito, precedencia, tags, protocolos, puertos,
   allow/deny, ejemplo completo y diagnóstico.
3. **Subredes:** anuncio global, selección local/RelNet, solapamientos, activación
   y desactivación.
4. **Capacidades:** qué representan, concesión y revocación.
   - Conexión SSH.
   - RelDrop.
   - RelShare.
5. **Exit nodes / nodos de salida:** elegibilidad, selección, fail-closed y
   fallback local.
6. **VPN móvil:** IKEv2, perfiles, alcance y solución de problemas.
7. **Diagnóstico y preguntas frecuentes.**

Cada tema cubrirá qué es, para qué sirve, cómo funciona, cómo se usa, cómo se
configura, riesgos y pasos de reversión. El ejemplo de Policies usará nombres e
IPs ficticios.

`/FAQs` será la ruta canónica; `/faqs` redirigirá permanentemente. El footer
global de `relead.com.mx`, incluidas FAQs y páginas legales, mostrará:

- FAQs → `/FAQs`
- Términos y Condiciones → `/terms`
- Política de Privacidad → `/privacy`

## Tema visual unificado

Se definirá un contrato de tokens RelNet: colores, tipografía, espaciado, radios,
sombras, estados, focus, botones, formularios, tablas y superficies de código.

En la plataforma, un helper compartido del paquete `ai_core` generará el head,
marca y clases para páginas HTML de auth-broker. Los assets serán locales y las
CSP conservarán `img-src 'self'`, `form-action 'self'`, `frame-ancestors 'none'`
y scripts con nonce cuando sean necesarios.

La auditoría visual abarcará:

- `/console`, `/console/login` y `/install`;
- diálogos y resultados de confirmación;
- aprobación host-admin pendiente, aprobada, denegada, consumida y expirada;
- autorización OAuth, error, cancelación, éxito y autorización ya utilizada;
- `relead.com.mx`, `/FAQs`, `/terms` y `/privacy`;
- vistas desktop y móvil, foco visible, contraste y ausencia de overflow.

Las superficies técnicas como terminales, logs y bloques de código conservarán
fondos oscuros aunque el resto del tema sea claro.

## API y autorización

- Las mutaciones de gateway, salida y subred siguen el confirmation gate actual.
- La API valida allowlists estrictas, IDs opacos, CIDRs y tamaños.
- Usuarios restringidos por tags solo cambian consumidores y gateways dentro de
  su alcance.
- La lectura distingue `desired_*` de `applied_*`.
- Todo cambio genera auditoría con actor, recurso, revisión y resultado, sin
  payloads sensibles.
- FAQs no usa endpoints administrativos ni expone estado de producción.

## Manejo de errores

- Preflight incompatible: el gateway no es elegible y la UI explica la categoría.
- Gateway offline: consumidores fail-closed muestran `degraded`.
- Configuración inválida: rechazo antes de persistir o revisión marcada `error`.
- Reconciliación parcial: rollback a la última revisión válida.
- Subred solapada: requiere una selección explícita y bloquea rutas ambiguas.
- Agente antiguo: conserva red local y aparece como “actualización requerida”.
- Controller/Relay degradado: no se ofrece a nuevas selecciones; las existentes
  siguen la política de falla configurada.

## Estrategia de pruebas

### Unitarias y de contrato

- Validación de gateways, CIDRs, solapamientos, selecciones y fail policy.
- Migración, restricciones e idempotencia de revisiones.
- Heartbeat deseado/aplicado y redacción de errores.
- Allowlists, roles, tags y confirmation gates.
- Render y enlaces de `/FAQs`, footer y anclas contextuales.
- Paridad de tokens visuales y cobertura de todas las páginas HTML de aprobación.

### Integración de red

- Network namespaces Linux para NAT, rutas, kill switch, rollback y reinicio.
- Preflight Windows sin cambios y pruebas PowerShell de reglas propiedad de RelNet.
- Consumidor Linux → Controller/Relay con IP de salida esperada.
- Consumidor Linux → gateway de nodo compatible.
- Caída del gateway: ausencia de Internet con fail-closed.
- Fallback explícito: recuperación por salida local.
- Anuncio global sin ruta instalada.
- Selección de subred por consumidor y reversión a local.
- Control plane, SSH y recovery accesibles durante cambios de default route.

### End-to-end y visual

- Playwright en desktop y móvil para consola, FAQs, legales y aprobaciones.
- `/FAQs` responde 200 en una sesión sin cookies; `/faqs` redirige.
- El footer contiene los tres enlaces públicos en todas las páginas del sitio.
- Screenshots revisables para estados normal, error, confirmación y expiración.
- Prueba IKEv2 externa y conservación de UDP 500/4500.
- `verify.sh`, `smoke-test.sh`, Compose config, healthchecks y logs redactados.

## Entrega y promoción

1. Crear candidato inmutable v88 a partir de v87.
2. Implementar con TDD: prueba fallida, cambio mínimo, refactor.
3. Construir instaladores/agentes firmables con la nueva revisión de protocolo.
4. Desplegar en staging sin reutilizar puertos de producción.
5. Validar primero Controller/Relay con un consumidor de prueba.
6. Validar un gateway Linux; habilitar Latitude únicamente si su preflight Windows
   y la prueba de NAT pasan sin conflicto.
7. Ejecutar suite de red, IKEv2, regresión, seguridad y visual.
8. Publicar `/FAQs` en el Worker de `relead.com.mx` y verificar URLs públicas.
9. Crear backup previo a promoción y registrar rollback.
10. Promover v88 mediante el flujo de aprobación humana existente.
11. Verificar producción, persistencia tras restart y rutas de recuperación.

La nueva selección de salida permanecerá en `local` para todos los nodos al
migrar. Ningún default route ni anuncio se activará automáticamente al promover.

## Criterios de aceptación

- Un nodo compatible puede usar salida local, Controller/Relay u otro gateway.
- La IP de salida observada coincide con el gateway elegido.
- Una caída no produce fuga local con la política predeterminada.
- Una subred anunciada es visible globalmente y no se usa hasta que un nodo opta.
- El nodo puede volver a red local sin dejar rutas o NAT huérfanos.
- La UI distingue estado deseado y aplicado y ofrece reversión clara.
- SSH, Tailscale/recovery, Relay e IKEv2 continúan funcionando.
- `/FAQs` es pública en `relead.com.mx`, tiene todo el contenido acordado y está
  enlazada desde consola y footer.
- FAQs, términos, privacidad, consola, login, instalación y aprobaciones comparten
  el tema actualizado y pasan la auditoría visual.
- Staging y producción no compiten por listeners.
- Todas las pruebas actuales y nuevas pasan con evidencia reciente.

