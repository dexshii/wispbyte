# Wispbyte Studios website

The one-page studio site for **Wispbyte Studios**: four friends making games on Roblox.
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
    ├── audio/              ← background music
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
| `music` | Quiet looping background music + speaker button in the header (`src: ""` removes both) | ✅ Midnight Save Point |
| `links.discord` | "Join our Discord" button + footer link | ✅ set |
| `links.robloxGroup` | "Roblox Group" button + footer link | ✅ set |
| `links.contactEmail` | Contact line + footer "Email" link. Use a verified studio address only. | empty (hidden) |
| `featuredGame.robloxUrl` | "View on Roblox" button on Cursed Needle | empty (hidden) |
| `featuredGame.clip` | Short gameplay video (MP4/WebM in `assets/video/`) plays muted on a loop in the featured card | ✅ set |
| `featuredGame.trailerYouTubeId` | YouTube trailer in the featured card (used when there is no clip) | empty |
| `featuredGame.screenshots` | Screenshot strip under the featured card | ✅ 4 shots |
| `games` | Extra game cards under "From the Workshop" (a card alone on the last row is shown wide; each card can take a `clip` video or an `image`, otherwise it says "Screenshots & video coming soon") | ✅ AFTERCUT, Stonewake, Mothgrave, Cloverbrook (no media yet) |

**Background music:** `assets/audio/midnight-save-point.mp3` was trimmed, faded at both ends for a smooth loop, and lowered to about -24 LUFS. iPhones ignore volume set from the page, so the file itself is kept quiet. Browsers only allow sound after the visitor clicks, taps or presses a key, so the site opens with a full-screen book cover ("Click to open"). That one click opens the cover and starts the music. The speaker button in the header turns it on or off. Visitors who turn it off skip the cover on later visits, and so do visitors without JavaScript. Music pauses in background tabs. Removing `music.src` also removes the cover. To use another track at the same level:

```bash
ffmpeg -i new-track.mp3 -af "loudnorm=I=-24:TP=-3:LRA=7" -b:a 128k -map_metadata -1 assets/audio/new-track.mp3
```

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
    tags: ["Action", "Co-op"] // optional
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
- **Security** (all in `netlify.toml`; HTTPS and HSTS come from Netlify):
  - **Content-Security-Policy:** scripts, styles, fonts, images, audio and video load only from this site. Plugins (`<object>`) and workers are off, and forms are disabled because the site has none. The page can't be framed, and the only allowed embed is a YouTube trailer (youtube-nocookie). The one inline `<script>` in `index.html` (it decides whether to show the opening cover before the page draws) is allowed by its SHA-256 hash, so **if you edit that script, update the hash**. Any new third-party embed also has to be added here.
  - **Trusted Types:** page code can't inject raw HTML strings, which blocks DOM-based XSS in Chrome/Edge. `main.js` only uses `textContent`/`createElement`; keep it that way.
  - **Other headers:** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, a `Permissions-Policy` that turns off camera, mic, location, payments, USB and similar, and `Cross-Origin-Opener-Policy` / `Cross-Origin-Resource-Policy: same-origin`.
  - **Not served:** `README.md` returns 404 on the site. Netlify never serves `.git`, `.gitignore` or `netlify.toml`.
  - **Config links:** only `https://` links and valid email addresses from `site-config.js` are used, and all config text is inserted as plain text.
  - **Console warnings on the live site:** Netlify injects its own toolbar script (`/.netlify/scripts/hud`). The CSP blocks its inline code, so the browser console shows two warnings. Visitors aren't affected.
- Fonts: [Pixelify Sans](https://github.com/eifetx/Pixelify-Sans) and [Nunito](https://github.com/googlefonts/nunito), both under the SIL Open Font License (license files in `assets/fonts/`).
