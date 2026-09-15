# Work On Time — Client Pitch Demo

**Live:** https://furniture-demo-indol.vercel.app
**Repo:** https://github.com/Padha06/work-on-time

Single-page, scroll-driven pitch site for a furniture-building / repair / aluminum-door business.
Built per `AI Build Spec` (10 sections, design tokens, placeholder rules).

## Run

```bash
cd furniture-demo
npm install --legacy-peer-deps
npm run dev      # http://localhost:5173
npm run build    # verified working
npm run preview  # serves dist/
```

## What's inside (spec mapping)

| Spec | Implementation |
|---|---|
| §1 stack | React + Vite + Tailwind + GSAP/ScrollTrigger + Lenis + `@splinetool/react-spline` + R3F/Drei |
| §3 / §5 all 10 sections | `src/App.jsx` composes Hero, TrustStrip, Services, BeforeAfter, FinishExplorer, CaseStudy, Process, Portfolio, Testimonials, Contact |
| §4 tokens | charcoal/graphite/aluminum/wood/cream/accent + Inter/Fraunces in `tailwind.config.js` + `src/index.css` |
| §5.1 hero | `Hero.jsx` — Spline embed if `VITE_SPLINE_SCENE_URL` set, else self-contained R3F sliding door (scroll + drag + toggle + range input), static image for `prefers-reduced-motion` |
| §5.4 before/after | `BeforeAfter.jsx` — pointer/touch/keyboard divider, 4 slides, before simulated with CSS filter so images align |
| §5.5 + §6.5 swatch/configurator | `FinishExplorer.jsx` + lazy `DoorStage.jsx` — 5 aluminum finishes + 3 glass tints driving live R3F materials |
| §5.10 contact | `wa.me` prefilled links + demo form (console log, no backend) |
| §8 placeholders | `SampleTag.jsx` `[Sample — to be replaced]` + `[TODO: client …]` markers, no Lorem Ipsum |

## Reference resources (skimmed before coding)

1. `Harkirattttt/ThreeJS-Furniture-Store` — vanilla Three.js + GSAP "room" pattern (key/fill lights, shadow ground plane, eye-level camera). Reused as the lighting/room pattern in `SlidingDoorScene.jsx`. No code copied.
2. `AxiomeCG/react-three-fiber-boilerplate` (MIT) — Drei + GSAP scaffold idea; its role (stretch configurator) is merged live into `DoorStage.jsx` instead of Leva dev controls.
3. Spline `#door` — community pages are JS-rendered; implemented as a **remix slot**: set `VITE_SPLINE_SCENE_URL` (see `.env.example`) to swap the R3F hero for the live Spline scene, no code change.
4. Spline `#furniture` ("Lamm Genya") — swatch-switching pattern replicated as frame/glass state → live material props.
5. Webflow/ThemeForest furniture templates — pacing/photo-treatment inspiration only, no code or assets copied.

## Performance notes

- R3F + Spline code-split via `React.lazy` + `manualChunks` (main bundle ~83 kB; three/spline load only when their canvas mounts).
- Images: Unsplash `auto=format` (WebP when supported) + `loading="lazy"` below the fold.
- Box-geometry-only door models (no GLTF) for mid-range phones; `dpr={[1, 1.75]}` caps pixel ratio.
- `prefers-reduced-motion` disables Lenis + scroll-linked 3D, shows static hero.
- Before real-phone sign-off: run Lighthouse on `npm run preview`, test on throttled 4G + a mid-range Android per spec §6.

## Still TODO (client to provide)

- WhatsApp number, phone, address/hours/area (`src/data/content.js` top)
- Real stats, project photos, testimonials, brand color/logo
- Spline door remix URL → `.env` as `VITE_SPLINE_SCENE_URL`
- Deploy: Vercel/Netlify (connect repo, `npm run build`, publish `dist/`)
