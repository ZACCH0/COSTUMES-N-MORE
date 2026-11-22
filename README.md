# COSTUMES N MORE

Custom fursuits, fursona design, and avatars for VRChat and VTubing — made to order by the Costumes N More team.

Live site: https://costumesandmorefursuits.vercel.app/ (the Vercel project must be deployed under this name)

## About the business

Every character has a story. Costumes N More brings yours to life — custom fursuits, fursona designs, and virtual avatars, each one built around your vision, your style, and the personality you want to share with the world. No two characters are exactly alike, and that is what makes each commission exciting.

**Services**
- Fursuit making — Head Only (from $1,500), Mini Partial (from $2,700), Partial (from $5,000), Full Suit (from $7,000)
- Fursona design — request a quote
- VRChat avatar creation — request a quote
- VTuber avatar creation — request a quote

**Commissioning**
- Ask for a quote through the commission form on the Contact page.
- Quotes stay valid for 60 days. A non-refundable deposit secures your slot (payment plans available).
- You receive work-in-progress updates while your piece is created.
- Full details are on the Terms page — please read it before commissioning.

**Contact**
- Instagram: https://www.instagram.com/costumesandmorefursuits
- Email: tobiloba3214@gmail.com
- Discord / Telegram: pending from the owner

## About this repo (for collaborators)

Static site. `node scripts/build.mjs` builds `src/` + `data/` into `dist/`, which Vercel deploys. No server code: the commission form posts directly from the browser to Web3Forms.

**Project layout**
- `data/site.config.json` — links, nav, socials, services, prices and form settings (single source of truth; edit here first)
- `data/gallery.json` — gallery items, categories, alt text and visibility flags
- `src/pages/` — page bodies (first line is a meta comment with title and description)
- `src/partials/` — shared head, header, footer, social block
- `src/design-system.css`, `src/site.css` — design tokens and page styles
- `src/js/` — site, gallery and contact scripts
- `public/` — static files copied as-is. `source-images/` — untouched original photos
- `scripts/` — build, preview server, form tests, QA checks

**Run it locally**
```
node scripts/build.mjs          # builds dist/
npm run dev                     # build + preview at http://localhost:8000
npm test                        # form wiring tests (no real email is sent)
node scripts/qa-check.mjs       # links, assets, SEO and gallery consistency
```

**Updating content**
- Prices, links, services: edit `data/site.config.json`, rebuild.
- Gallery: edit `data/gallery.json` (set `hidden` to show/hide), add image files under `public/images/portfolio/`, rebuild.
- Copy: edit the page in `src/pages/`, rebuild. Shared header/footer live in `src/partials/`.

**Commission form (Web3Forms)**
- The form posts to `https://api.web3forms.com/submit`. Applications go to the owner's Gmail; replying answers the applicant (their email is the Reply-To).
- The form is currently **closed** and hidden because `forms.accessKey` is the `WEB3FORMS_ACCESS_KEY` placeholder. Create a new key while signed in as tobiloba3214@gmail.com, paste it into `data/site.config.json`, set `status.commissions` to `"open"`, rebuild and deploy, then send a test application.
- Free plan: 250 submissions/month, no file attachments (references go through links), no automatic confirmation email to applicants.

**Deploy**
- Push to `main` — Vercel builds (`node scripts/build.mjs`, output `dist/`) and deploys automatically.
- Old URLs redirect: `/gallary.html` → `/gallery`, `/term.html` → `/terms` (301, in `vercel.json`).
