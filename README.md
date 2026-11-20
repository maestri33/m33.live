# M33.LIVE — Maestri Oficial (Evangelho da Graça & Vida em Cristo)

[![Astro 7](https://img.shields.io/badge/Astro-7.4-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

Plataforma oficial de **Maestri Oficial** ([@maestri.oficial](https://www.instagram.com/maestri.oficial/)), anunciando a obra consumada da cruz, o dom da justiça pela fé e a liberdade de viver pela graça.

Construído com **Astro 7**, **React 19**, **Tailwind CSS v4** e hospedado em **Cloudflare Workers com Static Assets** para altíssima performance, SEO e tempo de resposta instantâneo.

---

## ⚡ Tech Stack

- **Framework:** [Astro 7](https://astro.build) com compilador em Rust & Vite 8 / Rolldown
- **Adapter:** `@astrojs/cloudflare` (Cloudflare Workers & Static Assets)
- **UI Components:** React 19 Islands (`@astrojs/react`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Tipografia:** Fraunces (Editorial Serif), Plus Jakarta Sans, JetBrains Mono
- **Ícones:** Lucide React
- **SEO & Structured Data:** Schema.org Person JSON-LD, OpenGraph, Twitter Cards

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- **Node.js** >=22.23.4 ou **Bun** >=1.4.0

### Instalação de dependências
```bash
# Com bun (recomendado)
bun install

# Ou com npm
npm install
```

### Servidor de Desenvolvimento
```bash
bun run dev
# Ou
npm run dev
```
Inicia o servidor em `http://localhost:3000` (ou porta configurada).

### Build de Produção
```bash
bun run build
# Ou
npm run build
```

---

## ☁️ Deploy no Cloudflare Workers

Configurado através de `wrangler.jsonc` com custom domain para:
- `m33.live`
- `www.m33.live`

Deploy manual via CLI:
```bash
bun run deploy
# Ou
npx wrangler deploy
```

---

## 🔄 CI/CD Automático (GitHub Actions)

A cada push na branch `main`, o workflow em `.github/workflows/deploy.yml`:
1. Faz checkout do repositório
2. Configura Node.js 22
3. Instala dependências
4. Executa `npm run build` (Astro 7)
5. Faz o deploy automático no Cloudflare Workers via `cloudflare/wrangler-action`

### Secrets do Repositório no GitHub:
- `CLOUDFLARE_API_TOKEN` (Token de API Cloudflare com permissão de Workers/Edit)
- `CLOUDFLARE_ACCOUNT_ID` (`e0814c592e43284a2f6f9984bef32631`)
