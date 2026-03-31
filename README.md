# ReLead Landing

Landing page de marca para presentar el ecosistema **Powered by ReLead**, comenzando con **ReCalc** y dejando la base lista para futuras apps o micrositios.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- CSS modular + variables globales

## Objetivo del diseño

Esta landing está pensada para:

1. Presentar a **ReLead** como marca madre y no solo como nombre.
2. Mostrar productos actuales y futuros dentro de un mismo sistema visual.
3. Permitir crecimiento sin rehacer el proyecto desde cero.
4. Desplegar fácilmente en **Vercel** con repositorio en **GitHub**.

## Estructura

```txt
app/
  globals.css
  layout.tsx
  page.module.css
  page.tsx
components/
  SectionReveal.tsx
```

## Cómo ejecutar en local

Requisitos mínimos:

- Node.js 20.9 o superior
- npm, pnpm, yarn o bun

Con npm:

```bash
npm install
npm run dev
```

Abre:

```txt
http://localhost:3000
```

## Subir a GitHub

```bash
git init
git add .
git commit -m "feat: create ReLead landing page"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/relead-landing.git
git push -u origin main
```

## Desplegar en Vercel

### Opción 1: desde GitHub

1. Sube este proyecto a GitHub.
2. Entra a Vercel.
3. Importa el repositorio.
4. Vercel detectará Next.js automáticamente.
5. Publica.

### Opción 2: con CLI

```bash
npm i -g vercel
vercel
```

## Qué editar primero

### Texto de marca

Edita `app/page.tsx`.

### Colores y sistema visual

Edita:

- `app/globals.css`
- `app/page.module.css`

### Nuevas apps en el ecosistema

Agrega objetos al arreglo `products` dentro de `app/page.tsx`.

## Ideas de siguientes integraciones

- Formulario real de contacto con Resend / Formspree / API route
- Analytics con Vercel Analytics
- CMS para administrar productos y textos
- Página individual para ReCalc
- Catálogo de apps Powered by ReLead
- Modo bilingüe ES / EN

## Notas

El diseño evita el look genérico de plantilla. La identidad se apoya en:

- composición editorial
- contrastes profundos
- motion sutil
- jerarquía clara
- bloques reutilizables
