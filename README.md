# M33.LIVE — LUXONN Architectural Trophy Residences

[![Astro 7](https://img.shields.io/badge/Astro-7.4-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

High-end luxury real estate platform showcasing trophy architectural residences across Dubai, New York, Miami, Lake Como, and Aspen.

Built with **Astro 7**, **React 19**, **Tailwind CSS v4**, **GSAP**, **Lenis Smooth Scroll**, and deployed to Cloudflare Workers with Static Assets.

---

## ⚡ Tech Stack

* **Framework:** [Astro 7](https://astro.build) with Rust-powered compiler & Vite 8 / Rolldown
* **Adapter:** `@astrojs/cloudflare` targeting Cloudflare Workers & Static Assets
* **UI Components:** React 19 Islands (`@astrojs/react`)
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
* **Animation:** GSAP 3 (ScrollTrigger, Timeline) & Motion
* **Scroll Engine:** Lenis Smooth Scroll (`lenis/react`)
* **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites

* Node.js `>=22.23.4` (or Bun `>=1.4.0`)
* Cloudflare Wrangler CLI (`wrangler`)

### Installation

```bash
# With bun (recommended)
bun install

# Or with npm
npm install
```

### Development Server

```bash
npm run dev
# Or
bun run dev
```

Runs the Astro dev server at `http://localhost:3000`.

### Production Build

```bash
npm run build
# Or
bun run build
```

Generates the server entrypoint in `dist/server` and client static assets in `dist/client`.

---

## ☁️ Cloudflare Deployment

### Local CLI Deploy

```bash
npm run deploy
# Or
bun run deploy
```

Configured via `wrangler.jsonc` with custom domain routing:
* `m33.live`
* `www.m33.live`

---

## 🔄 Automated CI/CD (GitHub Actions)

When pushed to GitHub (`main` branch), `.github/workflows/deploy.yml` automatically:
1. Checks out the repository
2. Sets up Node.js 22
3. Installs dependencies
4. Runs `astro build`
5. Deploys the Worker & Static Assets to Cloudflare using `cloudflare/wrangler-action`

### Required Repository Secrets:
* `CLOUDFLARE_API_TOKEN`
* `CLOUDFLARE_ACCOUNT_ID` (Set to `e0814c592e43284a2f6f9984bef32631`)
