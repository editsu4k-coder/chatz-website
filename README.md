# ChatZ — Official Website

The official product site for **ChatZ**, the friend-only screen-time app for Android.
Static, dependency-free, dark-first — built to feel like a premium consumer product.

**Live:** https://chatz-website.vercel.app · **Repo:** https://github.com/editsu4k-coder/chatz-website

Every push to `main` auto-deploys to production via the Vercel ↔ GitHub connection
(Vercel GitHub App, all-repositories scope).

## Pages

| Route | Purpose |
|-------|---------|
| `index.html` (`/`) | Full landing experience: hero, product intro, features, interactive app demo, friends, live privacy demo, how-it-works, showcase, philosophy, download + release info, FAQ teaser |
| `privacy.html` | Privacy policy — mirrors the policy shown in the app (Settings → Privacy) |
| `faq.html` | Full FAQ with live search filter (26 questions) |
| `support.html` | Support contacts + self-serve fixes (restricted settings, missing stats, sync, notifications) |

## Run locally

Any static server works:

```bash
node serve.js          # → http://localhost:8321
# or: npx serve . / python -m http.server
```

Opening `index.html` directly from disk also works (the GitHub release fetch runs fine from `file://`).

## Deploy

Already deployed: pushes to `main` deploy automatically (Vercel project `world-vault/chatz-website`).
To deploy from another machine, import the repo at [vercel.com/new](https://vercel.com/new) — no build settings needed.

## Configuration — single source

**`js/site-config.js`** is the only file you normally need to touch:

- `githubRepo` — `"owner/repo"` whose **GitHub Releases** host the APK. The site fetches
  `https://api.github.com/repos/<repo>/releases/latest` and populates version, release date,
  APK size, SHA-256 (asset digest), release notes, and the download button URL — the same
  channel the in-app updater downloads from.
- `fallbackRelease` — static values used only when the API is unreachable (offline preview /
  rate limit). Refresh after each release, or rely on the live fetch.
- `support` — the contact addresses shown on the site (mirrors the in-app contacts).

Nothing else is hardcoded: the footer version, hero chip, download metadata and release card
all read from the same source.

## Stack

- Hand-written HTML / CSS / vanilla JS — no frameworks, no build step, no tracking.
- Self-hosted **Inter variable** font (`assets/fonts/`).
- All app mockups are real DOM/CSS/SVG (drawn avatars from the app's palette system) — no screenshots.
- Icons: inline Lucide-style SVG sprite.
- `prefers-reduced-motion` fully respected; animations are IntersectionObserver-driven and settle after reveal.

## Notes

- The demo phone (`#explore`) is fully interactive: tabs, friend search, sending a message,
  Active/Silent mode, per-category privacy switches — all wired to shared demo state.
- The privacy section toggle demo reflects the app's actual behavior: disabled categories are
  removed immediately, never shown as zeros; Silent mode pauses everything and presence shows away.
