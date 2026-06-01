# gabinajm-portfolio

Portfolio website for Gabi Abinajm, Product Designer.

**Live:** [gabinajm-portfolio](https://gabinajm-portfolio.vercel.app/)

## Stack

- **Framework:** Next.js 16 (App Router)
- **CMS:** Sanity v3 (studio in `studio/`)
- **Styling:** Tailwind CSS
- **Email:** SendGrid
- **Video:** HLS.js (lazy-loaded)
- **Monitoring:** Vercel Analytics + Speed Insights
- **Deploy:** Vercel (auto-deploy on push to `main`)

## Getting Started

```bash
npm install
npm run dev
```

Requires a `.env` file with Sanity and SendGrid credentials. Check Vercel environment variables for reference.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Run tests (Vitest) |
| `npm run type-check` | TypeScript check |

## Project Structure

```
src/
  app/            # Next.js pages (home, about, projects/[slug])
  adapters/       # Route components (UI layer)
  domain/         # Types and models
  services/       # Sanity data service, queries
  i18n/           # EN/PT translations
studio/           # Sanity Studio
public/           # Static assets
```

## i18n

Supports English and Portuguese. Language is set via a `locale` cookie, toggled by the language switcher in the nav. CMS fields use `_pt` suffix variants with no EN fallback for PT content.

## License

Private. All rights reserved.
