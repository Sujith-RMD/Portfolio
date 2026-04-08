# Sujith Portfolio

A cinematic, backend-focused portfolio designed to present engineering capability through shipped work, measurable outcomes, and a strong product mindset.

Built with React + TypeScript + Vite, with polished motion direction powered by Framer Motion.

## Live Website

- Production: https://sujithkumar-portfolio.vercel.app/

## Why This Portfolio Stands Out

- Backend-focused positioning with clear project outcomes
- Cinematic loading intro that plays on every refresh
- Signature hero section with cursor-following spotlight and rotating role line
- Bright, oversized skill marquee with smoother scroll presentation
- Premium, scroll-aware motion design and section choreography
- Responsive layout optimized for desktop and mobile
- Custom cursor system with accessibility fallbacks
- Sticky project cards with case-study modal overlays
- Contact conversion section with social proof links
- Event tracking hooks for CTA/navigation analytics

## Core Experience

- Present a clear engineering identity in the first screen
- Show project depth through outcomes, architecture, and tooling
- Keep the interface expressive without sacrificing readability
- Make recruiter/client contact frictionless

## Tech Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- Framer Motion
- Lucide React icons
- ESLint 9

## Project Structure

```text
.
├── public/
│   ├── 404.html
│   ├── _redirects
│   ├── RESUME.pdf
│   ├── favicon.svg
│   └── Whisk_ffff2a7bcb8b7c5b6614e7eff5344104eg.png
├── src/
│   ├── components/
│   │   ├── ContactFooter.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── Hero.tsx
│   │   ├── InfiniteMarquee.tsx
│   │   └── SelectedWorks.tsx
│   ├── utils/
│   │   └── analytics.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── vercel.json
└── package.json
```

## Getting Started

### 1) Clone

```bash
git clone https://github.com/Sujith-RMD/Portfolio.git
cd Portfolio
```

### 2) Install dependencies

```bash
npm install
```

### 3) Start development server

```bash
npm run dev
```

The app runs at:

- http://localhost:5173

## Available Scripts

- `npm run dev` - Start local development server with HMR
- `npm run build` - Type-check and create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## Build and Deployment

### Build for production

```bash
npm run build
```

Generated output:

- `dist/`

### Deploy on Vercel

This project includes `vercel.json` with:

- SPA rewrite to `index.html`
- Security headers (`X-Content-Type-Options`, `Referrer-Policy`)

Deploy steps:

1. Import this GitHub repository into Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.

## Analytics Events

Tracked interactions are handled in `src/utils/analytics.ts` through `trackEvent(eventName, params)`.

Current event categories include:

- Navigation clicks
- Resume clicks
- Hero CTA clicks
- Project repository/case study interactions
- Footer email/social interactions

In development mode, analytics payloads are logged to the console for easier verification.

## Performance and Accessibility Notes

- The loading intro is short, polished, and now appears on each page refresh.
- Hero glow and marquee effects are tuned for a stronger cinematic presentation.
- Custom cursor is automatically disabled on touch/coarse-pointer devices.
- Reduced-motion preferences are respected via CSS and motion fallbacks.
- Heavy blur/background effects are tuned down on mobile for smoother rendering.
- Keyboard focus states are included for interactive controls.

## Hiring Context

This portfolio is optimized for backend internship and collaboration visibility, highlighting practical delivery across:

- API engineering
- Data and ML workflows
- AWS/cloud deployment patterns
- Production-minded system design

## Customization Guide

Quick edits you will most commonly make:

- Loading intro and app-level motion: `src/App.tsx`
- Hero content and CTAs: `src/components/Hero.tsx`
- Marquee text and band styling: `src/components/InfiniteMarquee.tsx`
- Contact links and footer CTA: `src/components/ContactFooter.tsx`
- Motion and cursor behavior: `src/components/CustomCursor.tsx`
- Global theme/effects tokens: `src/index.css`

## Author

Sujith Kumar R

- Portfolio: https://sujithkumar-portfolio.vercel.app/
- GitHub: https://github.com/Sujith-RMD
- LinkedIn: https://www.linkedin.com/in/sujithkumar-r-267630378/
- LeetCode: https://leetcode.com/u/SujithKumar-R/
