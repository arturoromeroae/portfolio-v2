# Arturo Romero — Senior Full Stack Developer Portfolio

Professional portfolio built with Angular 20, featuring bilingual support (ES/EN), dark mode design, and enterprise-grade architecture.

## Tech Stack

- **Angular 21** — Standalone Components, Signals, Lazy Loading
- **TypeScript** — strict mode
- **SCSS** — custom design system, no CSS frameworks
- **ngx-translate** — i18n ES/EN with LocalStorage persistence
- **Angular Router** — fragment navigation with smooth scroll

## Features

- Dark mode premium design (Vercel/Linear/Stripe inspired)
- Fully responsive (mobile-first)
- Bilingual: Spanish / English — auto-detects browser language
- SEO: meta tags, Open Graph, Twitter Card, JSON-LD, sitemap, robots.txt
- Typewriter effect on hero
- Interactive experience tabs
- Scroll progress indicator
- Contact form with reactive validation
- Lazy-loaded HomeComponent
- WCAG-friendly focus states

## Getting Started

```bash
npm install
npm start       # http://localhost:4200
npm run build   # production build → dist/portfolio
```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── interfaces/     # TypeScript interfaces
│   │   └── services/       # LanguageService, PortfolioDataService
│   ├── features/
│   │   ├── hero/           # Hero section with typewriter
│   │   ├── about/          # About + code snippet card
│   │   ├── technologies/   # Tech stack by category with bars
│   │   ├── experience/     # Tab-based professional timeline
│   │   ├── projects/       # Featured projects cards
│   │   ├── certifications/ # Credential badges
│   │   ├── availability/   # Work modalities
│   │   └── contact/        # Reactive form
│   └── shared/
│       └── components/
│           ├── header/            # Fixed nav + hamburger
│           ├── footer/            # Links + built-with
│           ├── language-switcher/ # ES/EN toggle
│           └── scroll-progress/   # Top progress bar
├── assets/
│   ├── i18n/        # es.json, en.json
│   ├── images/      # Project thumbnails
│   └── cv/          # Arturo-Romero-CV.pdf
└── styles.scss      # Global design tokens + utilities
```

## Customization

1. Replace `src/assets/cv/Arturo-Romero-CV.pdf` with your actual CV
2. Update social links in `PortfolioDataService`
3. Add project images to `src/assets/images/`
4. Update `src/index.html` canonical URL when deploying

## Deployment

```bash
npm run build
# Deploy dist/portfolio to Netlify / Vercel / Azure Static Web Apps / GitHub Pages
```

---

Built with Angular 21 + TypeScript · Lima, Perú 🇵🇪
