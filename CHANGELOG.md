# Changelog

All notable changes to this project will be documented here.
Format: `[version] — YYYY-MM-DD`

---

## [0.1.0] — 2026-04-08

### Added
- Initial portfolio site with React + Vite (no React Router — manual `history` API routing)
- Sections: About, Experience, Projects, Labs, Accomplishments, Blogs
- Dark / Light theme toggle with `localStorage` persistence
- In-site blog system with Markdown rendering (via `marked`)
- Blog post routing (`/blogs/:slug`) with Back navigation
- Labs section with internal routing (no new tab)
- **Audio Player Lab** — WebGL2 raymarched terrain shader that reacts to music beats
  - Two-pass rendering: buffer (audio history waterfall) + image (raymarched terrain)
  - Audio bridge taps into React player's `<audio>` element via Web Audio API
  - Waveform bars (`.ap-waveform`) driven by real FFT data instead of CSS animation
  - Default track loaded from S3 (`Fearless Funk.mp3`)
  - Uploaded files automatically captured and visualized
  - Default audio file blocked via `HTMLMediaElement.src` prototype override
- Favicon assets (`favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, `site.webmanifest`)
- **404 page** — themed, matches site design, "Go home" button
- **GitHub Pages SPA fix** — `404.html` redirects unknown paths, `index.html` restores URL before React loads
- `ShaderPlayer` React component (full-screen iframe wrapper with Back button)
- Sidebar animated canvas background (`ShaderCanvas`) — reacts to theme

### Fixed
- Mobile buttons not clickable — `pointer-events: none` on `ShaderCanvas` overlay
- AudioContext blocked on load — moved creation inside click handler only
- Uploaded audio not triggering visuals — fixed blob URL detection in capture logic
- Sidebar gradient barely visible — increased shader canvas opacity

---

## Versioning Guide

| Change type | Bump |
|---|---|
| New section, major feature | `MINOR` (1.x.0) |
| Bug fix, UI tweak, content update | `PATCH` (1.0.x) |
| Full redesign | `MAJOR` (x.0.0) |

To bump version before a deploy:
```bash
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
```
Then update this file with what changed, build, and copy to portfolio.
