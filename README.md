<p align="center">
  <img src="public/images/nav_logo.svg" alt="Gabinajm" width="200" />
</p>

<h3 align="center">
  Portfolio &mdash; Gabi Abinajm, Product Designer
</h3>

<p align="center">
  Accessible, human-centered digital experiences crafted with intentional simplicity.
</p>

<p align="center">
  <a href="https://www.gabinajm.com.br"><strong>gabinajm.com.br</strong></a>
</p>

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| CMS | Sanity v3 |
| Styling | Tailwind CSS |
| Email | SendGrid |
| Video | HLS.js (lazy-loaded) |
| Testing | Vitest |
| Monitoring | Vercel Analytics + Speed Insights |
| CI/CD | GitHub Actions + Vercel |

## Architecture

The project follows a **clean architecture** pattern with clear separation of concerns:

```
src/
  app/              Next.js routes (home, about, projects/[slug])
  adapters/routes/  UI components (presentation layer)
  domain/           Models, interfaces, types (business layer)
  services/         Sanity client, data service, queries (data layer)
  i18n/             EN/PT translations & locale provider
studio/             Sanity Studio (CMS admin)
public/             Static assets & images
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Create a `.env.local` file with the required environment variables:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_API_TOKEN=
SENDGRID_API_KEY=
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm test` | Run tests (Vitest) |
| `npm run type-check` | TypeScript strict check |

## Features

- **Bilingual** — Full EN/PT support via cookie-based locale switching
- **Password-gated projects** — Selective access control for case studies
- **Contact form** — SendGrid-powered with inline validation and toast feedback
- **Responsive** — Mobile-first design with tablet and desktop breakpoints
- **Accessible** — Semantic HTML, ARIA labels, skip-to-content, keyboard navigation
- **Performance** — ISR, image optimization, lazy-loaded video, Suspense streaming

## License

Private. All rights reserved.
