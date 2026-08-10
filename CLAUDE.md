# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio + blog for Kiran C Nayak at https://knayak.dev, built with Astro 5, deployed to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml` (Node 22, `yarn build`, publishes `./dist`). Custom domain via `public/CNAME`.

## Commands

Use **yarn**, not npm (`yarn.lock` is the lockfile). Node version is pinned in `.nvmrc`.

```bash
yarn dev          # dev server
yarn build        # production build into ./dist
yarn preview      # serve the production build
yarn typecheck    # astro check (.astro + .ts files)
yarn lint         # eslint with --fix
yarn lint:ci      # eslint, no fix, zero warnings allowed
yarn format       # prettier --write
yarn format:ci    # prettier --check
```

Git hooks (husky): pre-commit runs `lint-staged` (prettier + eslint --fix on staged files); pre-push runs `typecheck && lint:ci && format:ci`. The deploy workflow runs the same three CI checks before building.

Note: `eslint-plugin-astro` is pinned to the v1 line because v3's `astro-eslint-parser` requires a newer Node than local dev uses. The react-hooks purity rules are active — hero variants receive a `PointerRef` and must only dereference `.current` inside `useFrame` callbacks, never during render.

## Architecture

- **Single React island**: `src/components/hero/HeroScene.tsx` (mounted `client:only="react"` in `src/components/sections/Hero.astro`) is the ONLY React island on the site — it owns the WebGL hero. Everything else is zero-JS `.astro` markup. Do not convert static sections to React "for consistency"; promote with `client:visible` only if real interactivity is needed.
- **Hero variants**: `src/components/hero/variants.ts` is the registry of toggle-able 3D hero scenes (particles / blob / monogram / torus), each `React.lazy`-loaded so unpicked variants are never fetched. To pick the final variant: delete the losing files in `variants/`, remove their registry entries, and remove `HeroToggle`. Variants use procedural geometry only — no glTF/HDR assets; drei `Environment` **presets are banned** (they download from a CDN at runtime); use `<Lightformer>` children instead.
- **Content lives in data files**: `src/data/{site,skills,experience,projects}.ts` — edit these to change portfolio content without touching components. Placeholder entries are marked with `PLACEHOLDER`.
- **Blog**: Astro content collection (`src/content.config.ts`, posts in `src/content/blog/*.md`, YAML front matter with `pubDate`). Pages in `src/pages/blog/`, RSS at `src/pages/rss.xml.js`. Old Hugo URLs (`/posts/...`) redirect via `astro.config.mjs`.
- **Design system**: Tailwind v4, tokens in the `@theme` block of `src/styles/global.css` plus custom classes `.glass`, `.glow-text`, `.grain`, `.prose-dark`. Fonts are self-hosted via `@fontsource` imports; `public/fonts/space-grotesk-700.woff` exists solely for the troika 3D text (needs woff/ttf, not woff2).
- **Scroll reveals**: elements with `data-reveal` are animated by a tiny IntersectionObserver script in `BaseLayout.astro`. Content is visible by default (no-JS/reduced-motion safe) — keep it that way.

## Version pinning rule

`three` uses 0.x versioning where every minor is breaking: it is pinned with `~` in `package.json` and `@types/three` must stay on the same minor. Do not caret-upgrade `three` casually.
