# Wispbyte Studios website

The one-page studio site for **Wispbyte Studios**: two friends making 2D sprite games on Roblox.
It's plain HTML, CSS and a little JavaScript. There is no build step, and `index.html` in the repo root is the page Netlify publishes.

Live address: **https://wispbytestudio.com**

```
.
├── index.html              ← the page
├── site-config.js          ← links + game list (the only file you normally edit)
├── 404.html                ← "page not found"
├── netlify.toml            ← Netlify settings (publish root, headers, caching)
├── favicon.ico, site.webmanifest, robots.txt, sitemap.xml
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── video/              ← gameplay clips (create when you add the first one)
    ├── fonts/              ← Pixelify Sans (headings) + Nunito (body), self-hosted, SIL OFL
    └── img/                ← emblem, banner (desktop + mobile crop), icons, social image
```

---

## Editing links and games: `site-config.js`

Every link lives in `site-config.js`. **Leave a value empty (`""`) and its button is hidden on the live site.**
Only `https://` links are accepted.

| Setting | What it shows | Current |
|---|---|---|
| `links.discord` | "Join our Discord" button + footer link | ✅ set |
| `links.robloxGroup` | "Roblox Group" button + footer link | ✅ set |
| `links.contactEmail` | Contact line + footer "Email" link. Use a verified studio address only. | empty (hidden) |
| `featuredGame.robloxUrl` | "View on Roblox" button on Cursed Needle | empty (hidden) |
| `featuredGame.clip` | Short gameplay video (MP4/WebM in `assets/video/`) plays muted on a loop in the featured card | ✅ set |
| `featuredGame.trailerYouTubeId` | YouTube trailer in the featured card (used when there is no clip) | empty |
| `featuredGame.screenshots` | Screenshot strip under the featured card | ✅ 4 shots |
| `games` | Extra game cards under "From the Workshop" | empty (section hidden) |

**Adding a screenshot:** crop it to the game view only, put it in `assets/img/` (WebP or PNG), then:

```js
screenshots: [
  { src: "assets/img/cursed-needle-1.webp", alt: "The needle flying back through three slimes" }
]
```

**Adding a gameplay clip:** put the video in `assets/video/`, then:

```js
clip: {
  src: "assets/video/cursed-needle-gameplay.mp4",
  poster: "assets/img/cursed-needle-1.webp",   // frame shown before it loads
  alt: "Throwing and recalling the needle through a group of enemies"
}
```

The main slot uses whichever is set first: clip, then YouTube trailer, then the first screenshot. Visitors who prefer reduced motion see the clip paused with controls.

### Capturing media from Roblox Studio

Aim for footage that shows the throw → reposition → recall loop:

- **Screenshots:** set the Studio window or play-test to a 16:9 size (e.g. 1920×1080) and hide the Studio panels so only the game view shows. Take 3–6 shots: a recall hitting several enemies, a stolen power in use, an item combo, the HUD.
- **Gameplay clip:** record 8–20 seconds with a screen recorder (Windows: Xbox Game Bar `Win+Alt+R`, or OBS; macOS: `Cmd+Shift+5`). Trim it to the best loop, without sound.
- **Size it for the web** (needs [ffmpeg](https://ffmpeg.org)):

  ```bash
  ffmpeg -i raw.mov -vf "scale=1280:-2,fps=30" -an -c:v libx264 -crf 26 -preset slow -movflags +faststart assets/video/cursed-needle-gameplay.mp4
  ```

  ```bash
  ffmpeg -i shot.png -vf "scale=1600:-2" -quality 85 assets/img/cursed-needle-1.webp
  ```

  Keep clips under ~10 MB and screenshots under ~400 KB each.
- **File names:** use lowercase with dashes, e.g. `cursed-needle-1.webp`, `cursed-needle-gameplay.mp4`.

**Adding a new game card:** add an object to `games`:

```js
games: [
  {
    title: "Lantern Moth",
    status: "Prototype",
    description: "One or two sentences about the game.",
    image: { src: "assets/img/lantern-moth.webp", alt: "Short description of the image" },
    robloxUrl: "",               // optional; the button appears once filled
    tags: ["2D sprite", "Co-op"] // optional
  }
]
```

Commit and push. Netlify redeploys automatically.

---

## Preview locally

The page uses root paths (`/assets/...`), so open it through a small local server instead of double-clicking the file.

With Python (already on macOS and most Linux machines):

```bash
python3 -m http.server 8080
```

Or with Node.js:

```bash
npx serve .
```

Then open http://localhost:8080 (or the address `serve` prints).
To see the mobile layout, use your browser's device toolbar (Chrome/Edge: `F12` → `Ctrl+Shift+M`).

---

## Publish on Netlify

### 1. Connect the GitHub repo

1. Sign in at https://app.netlify.com.
2. Click **Add new project** → **Import an existing project** → **GitHub**, and authorize Netlify if asked.
3. Choose the **`dexshii/wispbyte`** repository.
4. Use these build settings. `netlify.toml` already contains them, so Netlify should fill them in:
   - **Branch to deploy:** the branch with the site (e.g. `main`)
   - **Base directory:** *(empty)*
   - **Build command:** *(empty)*
   - **Publish directory:** `.`
5. Click **Deploy**. After a few seconds you get a preview address like `https://something.netlify.app`. Check the site there first.

### 2. Add the domain in Netlify

1. In the project, open **Domain management** → **Add a domain**.
2. Enter **`wispbytestudio.com`**, click **Verify**, then **Add domain**. Netlify will also add `www.wispbytestudio.com` and redirect it to the main domain.
3. Netlify will say the domain is using **external DNS** and show the records to create. Typically these are:
   - an **A** record for `@` (the bare domain) pointing to Netlify's load-balancer IP
   - a **CNAME** record for `www` pointing to your `*.netlify.app` address

   **Use exactly the values Netlify shows you.** Leave this tab open.

> Don't switch the domain's nameservers to Netlify DNS. Keep DNS at Squarespace, so your Google Workspace email keeps working untouched.

### 3. Enter the web records in Squarespace (keep the email records)

1. In Squarespace, open **Domains** → `wispbytestudio.com` → **DNS** → **DNS Settings**.
2. **Remove only the old web records** that would conflict with Netlify:
   - `A` records on `@` that point to Squarespace (e.g. `198.185.159.144`, `198.185.159.145`, `198.49.23.144`, `198.49.23.145`). These are often grouped under the **Squarespace Defaults** preset.
   - The `CNAME` record on `www` (e.g. `ext-sq.squarespace.com`).
3. **Add the records Netlify showed** in **Custom records**: the `A` record for `@` and the `CNAME` record for `www`.
4. **Don't touch the Google Workspace mail records.** Keep these exactly as they are:
   - all **MX** records (`smtp.google.com` or the `ASPMX.L.GOOGLE.COM` set)
   - **TXT** records for SPF (`v=spf1 include:_spf.google.com ~all`), DKIM (`google._domainkey`), DMARC (`_dmarc`) and any `google-site-verification`
   - anything in the **Google Workspace** preset

   Mail uses MX/TXT records. The website uses A/CNAME on `@`/`www`. Changing one doesn't affect the other.
5. Save. DNS changes usually show up within minutes, but can take up to 48 hours.

### 4. HTTPS

Back in Netlify → **Domain management** → **HTTPS**: once the DNS check passes, Netlify issues a free Let's Encrypt certificate automatically. If **Verify DNS configuration** is shown, click it. HTTPS is enforced automatically once the certificate is active.

### 5. Final check

- https://wispbytestudio.com and https://www.wispbytestudio.com both open the site.
- Send yourself a test email at the Google Workspace address to confirm mail still arrives.

---

## Notes

- **Accessibility:** skip link, a screen-reader-only `<h1>` (the banner already shows the studio name), descriptive alt text, visible focus outlines, a keyboard-operable mobile menu (Esc closes it), and contrast at or above WCAG AA.
- **Motion:** the "book cover opening" intro, drifting wisps, and scroll fade-ins are switched off when the visitor's system has *Reduce motion* turned on.
- **Without JavaScript:** content and navigation still work. Config-driven buttons stay hidden rather than showing broken links.
- **Security headers** (CSP etc.) are set in `netlify.toml`. If you later add an inline `<script>` or a third-party embed, update the `Content-Security-Policy` line there.
- Fonts: [Pixelify Sans](https://github.com/eifetx/Pixelify-Sans) and [Nunito](https://github.com/googlefonts/nunito), both under the SIL Open Font License (license files in `assets/fonts/`).
