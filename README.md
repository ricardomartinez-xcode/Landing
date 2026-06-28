# ReLead Landing

Landing corporativa de ReLead construida con Next.js 16, App Router, React 19 y TypeScript. El proyecto está preparado para desplegarse en **Cloudflare Workers** mediante OpenNext.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- CSS Modules + variables globales
- Cloudflare Workers + OpenNext

## Desarrollo local

Requisitos: Node.js 20.9 o superior y npm.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

Para probar la aplicación en el runtime de Cloudflare Workers antes de publicarla:

```bash
npm run preview
```

## Scripts

```bash
npm run build              # Compilación estándar de Next.js
npm run lint               # Linter
npm run preview            # Build + preview local en Cloudflare Workers
npm run deploy             # Build + despliegue directo con tu sesión de Wrangler
npm run upload             # Build + subida de versión sin promoverla
npm run cf:build           # Solo genera .open-next para CI/CD
npm run cf:deploy:built    # Despliega artefactos ya generados
npm run cf:upload:built    # Sube una versión ya generada
```

## Despliegue desde Cloudflare Workers Builds

No uses GitHub Pages ni Vercel para este repositorio.

1. En Cloudflare, abre **Workers & Pages** y elige **Create application**.
2. Selecciona **Import a repository** y conecta el repositorio `ricardomartinez-xcode/Landing`.
3. Crea el Worker con el nombre exacto `relead-landing`. Debe coincidir con el campo `name` de `wrangler.jsonc`.
4. En la configuración de Builds usa:

```txt
Root directory: /
Build command: npm run cf:build
Deploy command: npm run cf:deploy:built
Non-production branch deploy command: npm run cf:upload:built
Production branch: main
```

5. Guarda y despliega. Cloudflare generará una URL temporal `*.workers.dev` y, al hacer push a `main`, compilará y publicará automáticamente.
6. Activa las builds de ramas no productivas para tener previews de pull requests.

Cloudflare Workers Builds instala las dependencias del proyecto y utiliza la versión de Wrangler definida en `package.json`.

## Dominio personalizado

Después del primer deployment exitoso:

1. Asegúrate de que la zona `relead.com.mx` esté administrada por Cloudflare. Si el DNS está en otro proveedor, cambia los nameservers por los que Cloudflare indique.
2. En el Worker `relead-landing`, abre **Settings → Domains & Routes** y agrega `relead.com.mx` como Custom Domain.
3. Agrega también `www.relead.com.mx` solo si quieres atender ese host; después crea una Redirect Rule en Cloudflare para redirigir `www` hacia `https://relead.com.mx/$1`.
4. Elimina la configuración de dominio personalizado de GitHub Pages y la asignación previa del dominio en Vercel cuando hayas validado el Worker.

No guardes tokens, IDs de cuenta o secretos dentro de este repositorio. Para despliegues locales, inicia sesión con:

```bash
npx wrangler login
npm run deploy
```

## Variables y secretos

La landing actual no requiere variables de entorno. Si en el futuro agregas integraciones:

- Usa `.dev.vars` para secretos locales; el archivo está ignorado por Git.
- Configura secretos de producción en **Workers & Pages → Settings → Variables and Secrets**.
- Mantén valores públicos de build en la sección **Build Variables and Secrets** de Workers Builds cuando sean necesarios durante `next build`.

## Estructura

```txt
app/
  privacy/page.tsx
  terms/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  LegalPage.tsx
  SectionReveal.tsx
public/
  _headers
open-next.config.ts
wrangler.jsonc
```

## Edición de contenido

- Texto y secciones de la landing: `app/page.tsx`
- Estilos de la landing: `app/page.module.css`
- Páginas legales: `app/privacy/page.tsx` y `app/terms/page.tsx`
- Configuración de Cloudflare: `wrangler.jsonc` y `open-next.config.ts`
