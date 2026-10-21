# Watkins Home Companion — public website

The official website for Watkins Home Companion (WHC), served at **https://watkinshomecompanion.com** via GitHub Pages.

This project is fully separate from the WHC Flutter application. It has no build step and no dependencies. It is plain HTML, CSS, and a small amount of JavaScript.

## Project structure

```
index.html                Home
features/index.html       Features (with honest status labels)
how-it-works/index.html   How It Works
pricing/index.html        Pricing (not announced, no prices or payments)
about/index.html          About
contact/index.html        Contact ("contact address coming soon"; no form, no email shown)
404.html                  "Page not found" (GitHub Pages serves this automatically)
assets/css/styles.css     All styles; brand colors are CSS variables at the top
assets/js/main.js         Mobile menu, Features filter, animated companion orb (site works without JS)
assets/img/               Logo (SVG + PNG), app icons, social-share image
favicon.svg               WHC mark
CNAME                     Custom domain for GitHub Pages
robots.txt, sitemap.xml   Search engines
site.webmanifest          Icons/colors for "add to home screen"
.nojekyll                 Tells GitHub Pages to serve files as-is
scripts/serve.mjs         Local preview server (no install needed)
```

### Logo

The WHC logo is translated 1:1 from the app's `WhcLogo` widget: the same 76×60 stroke path, 13px round stroke, gradient (`#a257ff` → `#26baff` → `#3159ec`), and the heavy "WHC" wordmark with "WATKINS HOME COMPANION" beneath. Use `assets/img/whc-logo-on-dark.svg` or `whc-logo-on-light.svg` elsewhere. Do not recolor or redraw it.

### Status labels — keep these honest

Every capability is marked as one of these:

- **In testing:** works in internal test builds and is not publicly available.
- **In development:** being built, but not finished or verified.
- **Planned:** on the roadmap only.

When a feature's real status changes, update it in **all** of these places: the homepage cards, the homepage "Where WHC stands today" columns, the Features page, and the "Status last reviewed" line on the Features page. Don't add testimonials, launch dates, prices, or availability claims until they're real.

### Editing pages

The header and footer are repeated in each HTML file. If you change the navigation or footer, make the same change in all seven HTML files. When you change a page, update its `<lastmod>` date in `sitemap.xml`.

**Contact:** the site deliberately shows no personal email address and has no contact form. The Contact page says a dedicated address is coming soon. When an address at the domain is working (see [Email](#email)), add it to `contact/index.html`. Only list an address or form once it actually delivers messages.

---

## 1. Test locally

You need Node.js (any recent version). From this folder, run:

```powershell
node scripts/serve.mjs
```

Then open http://localhost:8080. Press `Ctrl+C` to stop. To use a different port, run `$env:PORT=3000; node scripts/serve.mjs`.

> Opening the HTML files directly (double-clicking) won't load the styles correctly, because the site uses root-relative links like `/assets/...`. Always use the server.

What to check:

- Every page in the menu opens, and an unknown URL (such as `/xyz`) shows the 404 page.
- Narrow the browser window (or use DevTools device mode at about 375px wide). The ☰ menu button should appear, open and close the menu, and close with `Esc`.
- Press `Tab` from the top of a page. "Skip to main content" should appear first, and focus outlines should stay visible.
- Optional: run Lighthouse in Chrome DevTools for performance, accessibility, and SEO scores.

## 2. Publish to GitHub Pages

1. The repository is https://github.com/enochsdomain8179-a11y/WHC-Website. It must stay public for GitHub Pages on a free plan.
2. To publish changes, commit them and run `git push`. Commits use a GitHub `noreply` address so no personal email appears in the public history.
3. On GitHub, open the repo's **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, **Branch** to `main`, and the folder to `/ (root)`. Then click **Save**.
5. After a minute or two, the site appears at `https://enochsdomain8179-a11y.github.io/WHC-Website/`. Styles may look broken at that temporary address because it's a sub-folder. That's expected. They work once the custom domain is active.

Every later `git push` to `main` republishes the site automatically.

## 3. Connect watkinshomecompanion.com

### a) Verify the domain with GitHub (recommended, prevents domain takeover)

GitHub → your profile picture → **Settings → Pages → Add a domain**. Enter `watkinshomecompanion.com`. GitHub shows a **TXT** record. Add it at your domain registrar, wait a few minutes, then click **Verify**.

### b) Add DNS records at your domain registrar

| Type | Host / Name | Value |
|------|-------------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `enochsdomain8179-a11y.github.io` |

Remove any old A, AAAA, or CNAME records for `@` and `www` that point elsewhere, such as the registrar's "parked" page. Don't use wildcard (`*`) records. These IP addresses are GitHub's published Pages addresses. Double-check them against GitHub's docs ("Managing a custom domain for your GitHub Pages site") when you set this up.

### c) Set the custom domain in the repo

Go to **Settings → Pages → Custom domain**, enter `watkinshomecompanion.com`, and click **Save**. The `CNAME` file in this repo already contains the domain, so it stays set after every push. GitHub then redirects `www.watkinshomecompanion.com` to the main domain automatically.

DNS changes can take anywhere from a few minutes to 24–48 hours. To check progress, run:

```powershell
nslookup watkinshomecompanion.com
nslookup www.watkinshomecompanion.com
```

## 4. Enable HTTPS

1. Once the DNS check in **Settings → Pages** shows a green "DNS check successful", GitHub requests a free Let's Encrypt certificate. This can take up to about an hour.
2. Tick **Enforce HTTPS**. If the box is greyed out, the certificate isn't ready yet. Wait and refresh.
3. Visit `http://watkinshomecompanion.com` and confirm it redirects to `https://`.

If the certificate seems stuck, clear the Custom domain field, save, re-enter the domain, and save again. This restarts the certificate request.

## 5. After launch

- Submit `https://watkinshomecompanion.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters).
- Test the social preview by pasting the URL into a LinkedIn post or another link-preview tool. The image is `assets/img/og-image.png` (1200×630).

## Email

GitHub Pages hosts only the website. It does not provide email, and the site currently lists no email address. To add a public contact address at your own domain (for example `hello@watkinshomecompanion.com`) without exposing a personal inbox, set up the registrar's email forwarding, Google Workspace, or Microsoft 365, and add its **MX** (and SPF) records alongside the website records above. They don't conflict. Send a test message to confirm it arrives before listing the address on the Contact page.

## Not included (by design)

This version has no payment processing, customer accounts, contact-form backend, analytics, cookies, or third-party scripts. If you add analytics later, update the footer line "No accounts, payments, or personal data are collected on this website" and add a privacy policy.
