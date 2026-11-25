<<<<<<< HEAD
# Bio Resources Pvt Ltd

Marketing website for **Bio Resources Pvt Ltd** — a life-sciences research
partner offering computational studies, in vitro assays, nanotechnology,
research projects/internships and thesis/manuscript support.

Built as a single-page app with a premium "scientific boutique-lab" aesthetic:
glassmorphism surfaces, a film-grain overlay, code-drawn DNA/molecule/leaf
motifs, an optional WebGL DNA-helix hero, and full light/dark theming.

---

## Tech stack

| Area | Choice |
| --- | --- |
| Build tool | Vite 8 |
| UI | React 19 + TypeScript |
| Routing | React Router (client-side, lazy-loaded routes) |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Animation | Framer Motion, GSAP + ScrollTrigger, Lenis smooth scroll |
| 3D | Three.js via `@react-three/fiber` + `@react-three/drei` (lazy) |
| Forms | react-hook-form + Zod |
| Icons | lucide-react |
| Lint | oxlint |

---

## Getting started

**Requirements:** Node.js **20.19+** or **22.12+** (Vite 8) and npm.

```bash
npm install       # install dependencies
npm run dev       # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build     # type-check (tsc -b) and build to /dist
npm run preview   # preview the production build locally
npm run lint      # run oxlint
```

The build must finish with **zero TypeScript errors**. `tsc -b` is run as part
of `npm run build`, so a type error will fail the build.

---

## Editing content

**All visitor-facing text and contact details live in one file:**

```
src/data/site.ts
```

Nothing is hardcoded in components — edit `site.ts` and the whole site updates.
Key sections:

- `company` — name, tagline, description, production `url`, lead scientist.
- `nav` — the header/footer navigation links.
- `contact` — email, single phone number (+ WhatsApp link), address, working
  hours, map embed, socials.
- `stats`, `coreStrength`, `whoNeedsUs`, `techniques` — home-page content.
- `services` — the five services (each `slug` becomes `/services/:slug`).
- `focusAreas`, `howItWorks` — focus gallery and the "How it works" story.
- `home`, `about`, `servicesPage`, `contactPage`, `notFound`, `footer` — page copy.

Rules for this file:

- **Never invent** statistics, testimonials, clients or certifications.
- Fields that still need confirmation are marked with `// VERIFY:` — see the
  **Before launch** checklist at the end of this README.

---

## Swapping images

Photos live in **`public/images/`** and are referenced by path only. The folder
is created on first use.

1. Add your image to `public/images/`, e.g. `public/images/founder.jpg`.
2. Point the matching `site.ts` field at it, e.g. `company.leadScientist.photo`.

Currently referenced placeholder images:

- `company.leadScientist.photo` → `/images/founder.jpg` (founder portrait).
  If the file is missing, the UI gracefully falls back to a code-drawn DNA
  motif, so the site never shows a broken image.

All decorative visuals (leaves, molecules, hexagons, DNA helixes, gradients,
particle fields) are **drawn in code** (SVG / CSS / Canvas / WebGL). There are
no hotlinked third-party images.

---

## Contact form endpoint

The enquiry form posts JSON to the endpoint set in **`VITE_FORM_ENDPOINT`**.

1. Copy the example env file and fill in your endpoint:

   ```bash
   cp .env.example .env
   ```

   ```dotenv
   # .env
   VITE_FORM_ENDPOINT=https://your-form-service.example/your-endpoint
   ```

2. The form POSTs `{ firstName, lastName, email, phone, service, message,
   source, submittedAt }` as `application/json`.

**Fallback behaviour:** if `VITE_FORM_ENDPOINT` is empty (the development
default) or the request fails, the form opens the visitor's email app with a
pre-filled `mailto:` message instead, so an enquiry is never silently lost.

Other form details: Zod validation, a hidden honeypot field (`companyWebsite`)
for bot prevention, and a success state that reads *"We will send you a
confirmation within 24 hours."*

> Vite only exposes variables prefixed with `VITE_` to client code. Never commit
> real secrets — `.env*` is git-ignored.

---

## SEO

- **Per page:** each page calls `useSeo({ title, description, path, image? })`
  ([`src/lib/seo.ts`](src/lib/seo.ts)), which sets `<title>`, `description`,
  `robots`, canonical, Open Graph and Twitter tags.
- **Structured data:** site-wide `LocalBusiness` JSON-LD is injected from
  `site.ts` via [`src/components/seo/LocalBusinessJsonLd.tsx`](src/components/seo/LocalBusinessJsonLd.tsx).
- **`public/robots.txt`** and **`public/sitemap.xml`** are served as static
  files. Both reference the domain — keep them in sync with `company.url`.
- Static fallback `og:*`/`twitter:*` tags live in `index.html` for crawlers that
  don't run JavaScript.

When you set the production domain, update **all three**: `company.url` in
`site.ts`, `public/robots.txt`, and `public/sitemap.xml`.

---

## Deploying

The site is a static SPA, so build output in `/dist` can be hosted anywhere.

**Important:** because routing is client-side, the host must rewrite unknown
paths to `/index.html` so deep links like `/services/computational-studies`
work on refresh. This repo ships the config for both platforms:
[`public/_redirects`](public/_redirects) (Netlify) and
[`vercel.json`](vercel.json) (Vercel).

### Netlify

1. Connect the repository in Netlify (or drag the `dist` folder into the UI).
2. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Add your environment variable under **Site settings → Environment variables**
   (`VITE_FORM_ENDPOINT`).
4. `public/_redirects` is copied into `dist` on build and enables the SPA
   fallback automatically.

### Vercel

1. Import the repository in Vercel. It auto-detects Vite.
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
2. Add `VITE_FORM_ENDPOINT` under **Project → Settings → Environment Variables**.
3. `vercel.json` provides the SPA rewrite to `/index.html`.

To test the production build locally first:

```bash
npm run build
npm run preview
```

---

## Project structure

```
public/            Static assets (favicon, robots.txt, sitemap.xml, _redirects)
src/
  components/      Reusable UI, layout, motif, and SEO components
  data/site.ts     Single source of truth for all content
  hooks/           useSeo helpers: media query, reduced motion, 3D capability…
  lib/             cn, enquiry (form submit), icons registry, seo
  pages/           Route components (lazy-loaded in App.tsx)
  providers/       Theme + smooth-scroll context providers
  sections/        Home-page sections
  three/           Lazy WebGL helix scene + SVG fallback
  App.tsx          Routes
```

---

## Accessibility & performance

- **Reduced motion:** all animation is disabled or simplified under
  `prefers-reduced-motion: reduce` (CSS + `MotionConfig reducedMotion="user"`).
- **Colour contrast:** body text meets WCAG AA. A dedicated `--accent` token is
  used for coloured text (the brighter brand teal/lime are reserved for fills).
- **Keyboard:** a global `:focus-visible` ring, a "Skip to content" link, and
  labelled controls throughout.
- **Performance:** routes are code-split; the WebGL scene is lazy-loaded and
  gated behind a hardware capability check; `devicePixelRatio` is capped;
  looping animations pause while the browser tab is hidden.

---

## Before launch — placeholder checklist

Replace/confirm everything marked `// VERIFY:` in the code. See
`src/data/site.ts`, `index.html` and
`src/components/seo/LocalBusinessJsonLd.tsx`. Summary:

- [ ] Production domain — `company.url` in `site.ts`, `public/robots.txt`,
      `public/sitemap.xml`, and `index.html`.
- [ ] Founder portrait — add `public/images/founder.jpg`.
- [ ] Company logo — add `public/images/logo.png` (navbar, footer, preloader,
      favicon and `og:image` fallback).
- [ ] Confirm the address spelling ("Sankagiri, Salem District, Tamil Nadu")
      and the Google Maps pin.
- [ ] Confirm working hours (`Mon–Fri, 10:00 AM – 5:30 PM`).
- [ ] Confirm service scope wording (assay panels, computational methods,
      nanomaterial workflows, internship eligibility, writing-support scope).
- [ ] Confirm the About-page story wording.
- [ ] Confirm the legal business name, full postal address, country and opening
      hours used in the `LocalBusiness` structured data.
- [ ] Optionally add a social preview image and pass it to `useSeo({ image })`.
=======
# Bio-Resources
>>>>>>> 8836909b48bef7ef6416dd14d0f880dcfea87f4e
