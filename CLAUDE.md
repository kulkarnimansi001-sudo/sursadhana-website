# SurSadhana Website — Project Context for Claude Code

## What this repo is
Public marketing website for **SurSadhana Music Classes**, Pune.
- **Live URL**: https://sursadhana.co.in
- **Deploy**: `git push` to `main` → GitHub Actions → GitHub Pages. Never run any deploy command manually.
- **Companion repo**: `c:\Users\mansi\student-portal` → deploys to `app.sursadhana.co.in` (Firebase Hosting). Two separate git repos — changes to each must be pushed separately.

## Owner
**Mansi Swarup Deshpande** — school founder, non-developer. She uses the admin panel to manage content; Claude Code makes all code changes.

## Pages & JS files
| Page | CMS script | Notes |
|---|---|---|
| `index.html` | `js/cms.js` | Homepage: gallery, news, achievements, courses, testimonials |
| `guru.html` | `js/guru-cms.js` | Guru page: bio, photos, timeline, awards, concerts, videos |
| `gallery.html` | `js/gallery-cms.js` | Albums + lightbox; dynamic category/year filters |
| `blog.html` | `js/blog-cms.js` | Blog posts |
| `faq.html` | inline `<script type="module">` | Loads FAQ from Firestore; falls back to static HTML |

**Every page** also loads `js/i18n.js` for EN/MR/HI language switching.

## Critical non-obvious facts

### Social floating bar
5 social icons (2 YouTube, 2 Instagram, 1 Facebook) are **injected by `js/i18n.js`** via an IIFE at the end of the file. They are NOT in any HTML file. Edit `i18n.js` to change icons/links.
- Desktop: fixed left sidebar, expands on hover
- Mobile (≤600px): bottom horizontal strip; `body` gets `padding-bottom: 56px`

### Two-gallery architecture (do NOT merge)
| | Homepage gallery | Gallery page |
|---|---|---|
| Collection | `website_gallery` | `website_albums/{id}/photos/{id}` |
| Page | `index.html` #gallery section | `gallery.html` |
| Admin tab | Media | Albums |

### Guru hero photo
- File: `images/teacher/mansi.jpg` — static, never auto-replaced
- `guru-cms.js` does NOT update the hero `<img>`. The `id="guruMainPhoto"` was intentionally removed from the hero element so Firestore photo loading cannot overwrite it
- Firestore photos from `website_teacher_photos` only update `guroBioPhoto` (bio section) and thumbnails
- Animation: `guruImgReveal` keyframe = `scale(1.15)→scale(1)` zoom-out, 2.4s, no opacity fade
- Hero is `height: 100vh`, full-bleed behind the transparent fixed navbar

### CSS class patterns
- `.guru-bio-grid` — 2-col desktop, 1-col mobile (replaces what was an inline style)
- `.guru-highlights-grid` — 2-col, collapses to 1-col at 480px

## Firebase / Firestore
- **Project**: `music-class-83080`
- All `website_*` collections are publicly readable (no auth required)
- Key collections for this repo:
  - `website_gallery` — homepage gallery photos
  - `website_albums/{id}/photos/{id}` — gallery page albums
  - `website_teacher/main` — name, badge, bio, highlights, guru_stats
  - `website_teacher_photos` — bio section photos (NOT hero)
  - `website_guru/main` — timeline, lineage, philosophy
  - `website_faq/{id}` — question, answer, order
  - `website_news`, `website_achievements`, `website_guru_articles` — content cards
  - `website_settings/main` — phone, email, address, stats

## Mobile breakpoints
- `900px` — single-column teacher/contact layouts, timeline collapses
- `768px` — nav hamburger, hero stacks, guru bio grid collapses
- `600px` — social bar moves to bottom strip
- `480px` — gallery 1-col, highlights 1-col

## Common tasks
- **Edit FAQ**: Admin panel → ⚙️ Settings tab → scroll to FAQ section
- **Add gallery photo**: Admin panel → 🖼️ Media tab (homepage) or 📁 Albums tab (gallery page)
- **Edit gallery photo caption**: Admin panel → 📁 Albums → open album → type in caption field below each photo → click away to save
- **Change social links**: `js/i18n.js` end of file — `var items = [...]` array
- **Deploy**: `git add ... && git commit -m "..." && git push`
