(function () {
  "use strict";

  var config = window.WISPBYTE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- helpers ---------- */
  function get(path) {
    return path.split(".").reduce(function (obj, key) {
      return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, config);
  }

  function safeUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      var url = new URL(value.trim());
      return url.protocol === "https:" ? url.href : "";
    } catch (e) {
      return "";
    }
  }

  function safeEmail(value) {
    if (typeof value !== "string") return "";
    var v = value.trim();
    return /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(v) ? v : "";
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  /* ---------- config-driven links (empty = hidden) ---------- */
  document.querySelectorAll("[data-link]").forEach(function (link) {
    var raw = get(link.getAttribute("data-link"));
    var isMail = link.hasAttribute("data-mailto");
    var value = isMail ? safeEmail(raw) : safeUrl(raw);
    if (!value) return;

    link.href = isMail ? "mailto:" + value : value;
    if (isMail && !link.textContent.trim()) link.textContent = value;
    link.hidden = false;

    var footerItem = link.closest("[data-footer-item]");
    if (footerItem) footerItem.hidden = false;
    var contact = link.closest("[data-contact]");
    if (contact) contact.hidden = false;
    var reveal = link.closest("[data-reveal-with-link]");
    if (reveal) reveal.hidden = false;
  });

  var links = config.links || {};
  if (!safeUrl(links.discord) && !safeUrl(links.robloxGroup) && !safeEmail(links.contactEmail)) {
    var pending = document.querySelector("[data-links-pending]");
    if (pending) pending.hidden = false;
  }

  /* ---------- featured game media ---------- */
  var featured = config.featuredGame || {};
  var media = document.querySelector("[data-featured-media]");
  var shots = (featured.screenshots || []).filter(function (s) {
    return s && typeof s.src === "string" && s.src.trim();
  });
  var trailerId = typeof featured.trailerYouTubeId === "string" &&
    /^[\w-]{6,20}$/.test(featured.trailerYouTubeId.trim()) ? featured.trailerYouTubeId.trim() : "";

  // Short gameplay recording hosted in the repo (assets/video/...): muted loop with controls.
  function makeClip(clip, fallbackLabel) {
    var src = clip && typeof clip.src === "string" ? clip.src.trim() : "";
    if (!src) return null;
    var video = document.createElement("video");
    video.className = "trailer";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = true; // lets visitors pause the loop
    video.preload = "metadata";
    if (typeof clip.poster === "string" && clip.poster.trim()) video.poster = clip.poster.trim();
    video.setAttribute("aria-label", clip.alt || fallbackLabel);
    if (!reduceMotion.matches) video.autoplay = true;
    var source = document.createElement("source");
    source.src = src;
    source.type = /\.webm$/i.test(src) ? "video/webm" : "video/mp4";
    video.appendChild(source);
    return video;
  }

  var featuredClip = makeClip(featured.clip, "Cursed Needle gameplay clip");

  if (media && featuredClip) {
    media.replaceChildren(featuredClip);
  } else if (media && trailerId) {
    var frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/" + trailerId;
    frame.title = "Cursed Needle trailer";
    frame.loading = "lazy";
    frame.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.className = "trailer";
    media.replaceChildren(frame);
  } else if (media && shots.length) {
    var first = shots.shift();
    var img = el("img", "screenshot");
    img.src = first.src;
    img.alt = first.alt || "Cursed Needle screenshot";
    img.decoding = "async";
    media.replaceChildren(img);
  }

  var strip = document.querySelector("[data-featured-shots]");
  if (strip && shots.length) {
    shots.forEach(function (s) {
      var li = el("li");
      var img = el("img");
      img.src = s.src;
      img.alt = s.alt || "Cursed Needle screenshot";
      img.loading = "lazy";
      img.decoding = "async";
      li.appendChild(img);
      strip.appendChild(li);
    });
    strip.hidden = false;
  }

  /* ---------- more game cards ---------- */
  function makeImage(item, lazy) {
    var img = el("img");
    img.src = item.src;
    img.alt = item.alt || "";
    if (lazy) img.loading = "lazy";
    img.decoding = "async";
    return img;
  }

  // One media item (video or image) for a card's main viewer.
  function makeMediaItem(item, title) {
    if (item.type === "video") return makeClip(item, title + " gameplay clip");
    return makeImage(item, true);
  }

  // Steam-style gallery: a main viewer plus thumbnail buttons that swap what it shows.
  function makeGallery(items, title) {
    var box = el("div", "game-media has-gallery");
    var view = el("div", "gallery-view");
    view.appendChild(makeMediaItem(items[0], title));
    box.appendChild(view);
    if (items.length < 2) return box;

    var thumbs = el("ul", "gallery-thumbs");
    thumbs.setAttribute("aria-label", title + " screenshots and videos");
    var buttons = [];
    items.forEach(function (item, i) {
      var li = el("li");
      var btn = el("button", "gallery-thumb" + (item.type === "video" ? " is-video" : ""));
      btn.type = "button";
      btn.setAttribute("aria-label", "Show " + (item.type === "video" ? "video" : "screenshot") + " " + (i + 1) + " of " + items.length + (item.alt ? ": " + item.alt : ""));
      btn.setAttribute("aria-pressed", String(i === 0));
      var thumbSrc = item.thumb || item.poster || (item.type === "video" ? "" : item.src);
      if (thumbSrc) {
        var t = el("img");
        t.src = thumbSrc;
        t.alt = "";
        t.loading = "lazy";
        t.decoding = "async";
        btn.appendChild(t);
      }
      btn.addEventListener("click", function () {
        if (btn.getAttribute("aria-pressed") === "true") return;
        view.replaceChildren(makeMediaItem(item, title));
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      });
      buttons.push(btn);
      li.appendChild(btn);
      thumbs.appendChild(li);
    });
    box.appendChild(thumbs);
    return box;
  }

  function validMedia(list) {
    return (Array.isArray(list) ? list : []).filter(function (m) {
      return m && typeof m.src === "string" && m.src.trim();
    });
  }

  var games = Array.isArray(config.games) ? config.games : [];
  var grid = document.querySelector("[data-game-grid]");
  if (grid && games.length) {
    var normalCards = [];
    games.forEach(function (g) {
      if (!g || !g.title) return;
      var li = el("li");
      var card = el("article", "game-card mini");

      var mediaBox;
      var media = validMedia(g.media);
      var cardClip = makeClip(g.clip, g.title + " gameplay clip");
      if (media.length) {
        mediaBox = makeGallery(media, g.title);
      } else if (cardClip) {
        mediaBox = el("div", "game-media");
        mediaBox.appendChild(cardClip);
      } else if (g.image && g.image.src) {
        mediaBox = el("div", "game-media");
        mediaBox.appendChild(makeImage(g.image, true));
      } else {
        mediaBox = el("div", "game-media empty");
        var emblem = el("img");
        emblem.src = "/assets/img/wispbyte-emblem.webp";
        emblem.alt = "";
        mediaBox.appendChild(emblem);
        mediaBox.appendChild(el("p", "media-soon", "Screenshots & video coming soon"));
      }
      card.appendChild(mediaBox);

      var body = el("div", "game-body");
      body.appendChild(el("h4", "game-title", g.title));
      if (g.status) {
        var status = el("p", "status");
        status.appendChild(el("span", "status-dot"));
        status.lastChild.setAttribute("aria-hidden", "true");
        status.appendChild(document.createTextNode(g.status));
        body.appendChild(status);
      }
      if (g.description) body.appendChild(el("p", "game-desc", g.description));
      if (Array.isArray(g.tags) && g.tags.length) {
        var tags = el("ul", "tags");
        g.tags.forEach(function (t) { tags.appendChild(el("li", "", String(t))); });
        body.appendChild(tags);
      }
      var url = safeUrl(g.robloxUrl);
      if (url) {
        var a = el("a", "btn btn-small btn-primary", "View on Roblox");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
        a.appendChild(el("span", "sr-only", " (opens in a new tab)"));
        body.appendChild(a);
      }
      card.appendChild(body);
      li.appendChild(card);
      if (g.wide) li.classList.add("is-wide");
      else normalCards.push(li);
      grid.appendChild(li);
    });
    // A regular card left alone on the last row is stretched so the grid has no gaps.
    if (normalCards.length % 2 === 1) normalCards[normalCards.length - 1].classList.add("is-orphan");
    grid.classList.add("count-" + normalCards.length);
    if (grid.children.length) document.querySelector("[data-more-games]").hidden = false;
  }

  /* ---------- background music ---------- */
  var startMusic = null;
  var listenForFirstInteraction = null;
  var root = document.documentElement;
  var music = config.music || {};
  var musicBtn = document.querySelector("[data-music-toggle]");
  var musicSrc = typeof music.src === "string" ? music.src.trim() : "";

  if (musicBtn && musicSrc) {
    var PREF_KEY = "wispbyte-music";
    var targetVolume = Math.min(1, Math.max(0, Number(music.volume) || 0.5));
    var audio = new Audio();
    audio.src = musicSrc;
    audio.loop = true;
    audio.preload = "none";
    audio.volume = 0;

    var fadeTimer = null;
    var resumeOnVisible = false;
    var stopping = false; // true while fading out, so a quick second click turns music back on
    var title = typeof music.title === "string" && music.title.trim() ? music.title.trim() : "Background music";

    var readPref = function () {
      try { return window.localStorage.getItem(PREF_KEY); } catch (e) { return null; }
    };
    var writePref = function (value) {
      try { window.localStorage.setItem(PREF_KEY, value); } catch (e) { /* storage blocked: ignore */ }
    };

    var render = function () {
      var playing = !audio.paused && !stopping;
      musicBtn.setAttribute("aria-pressed", String(playing));
      musicBtn.classList.toggle("is-playing", playing);
      musicBtn.title = (playing ? "Pause music: " : "Play music: ") + title;
    };

    var fadeTo = function (to, done) {
      window.clearInterval(fadeTimer);
      var step = (to - audio.volume) / 30;
      fadeTimer = window.setInterval(function () {
        var next = audio.volume + step;
        if ((step >= 0 && next >= to) || (step < 0 && next <= to) || step === 0) {
          audio.volume = to;
          window.clearInterval(fadeTimer);
          if (done) done();
        } else {
          audio.volume = next;
        }
      }, 50);
    };

    var start = function () {
      stopping = false;
      if (!audio.paused) { fadeTo(targetVolume); render(); return Promise.resolve(true); }
      audio.volume = 0;
      var attempt = audio.play();
      if (attempt && attempt.then) {
        return attempt.then(function () { fadeTo(targetVolume); render(); return true; },
          function () { render(); return false; });
      }
      fadeTo(targetVolume);
      render();
      return Promise.resolve(true);
    };

    var stop = function () {
      stopping = true;
      render();
      fadeTo(0, function () { stopping = false; audio.pause(); render(); });
    };

    // Browsers block sound until the visitor interacts, so retry on the first click, tap or key.
    var unlockEvents = ["pointerdown", "keydown", "touchstart"];
    var onFirstInteraction = function (e) {
      if (e.target.closest && e.target.closest("[data-music-toggle]")) return; // the button handles itself
      if (e.type === "keydown" && (e.key === "Escape" || e.key === "Tab" || e.altKey || e.ctrlKey || e.metaKey)) return;
      start().then(function (ok) { if (ok) removeUnlock(); });
    };
    var removeUnlock = function () {
      unlockEvents.forEach(function (t) { document.removeEventListener(t, onFirstInteraction, true); });
    };

    musicBtn.addEventListener("click", function () {
      removeUnlock();
      if (audio.paused || stopping) {
        writePref("on");
        start();
      } else {
        writePref("off");
        stop();
      }
    });

    audio.addEventListener("play", render);
    audio.addEventListener("pause", render);

    // Pause in background tabs, resume when the visitor comes back.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && !audio.paused) {
        resumeOnVisible = true;
        audio.pause();
      } else if (!document.hidden && resumeOnVisible) {
        resumeOnVisible = false;
        start();
      }
    });

    musicBtn.hidden = false;
    render();

    listenForFirstInteraction = function () {
      unlockEvents.forEach(function (t) { document.addEventListener(t, onFirstInteraction, true); });
    };
    startMusic = start;

    // With the opening screen, the music starts on its click (see below).
    if (readPref() !== "off" && !root.classList.contains("gate")) {
      start().then(function (ok) { if (!ok) listenForFirstInteraction(); });
    }
  }

  /* ---------- opening screen ("open the book") ---------- */
  var gate = document.querySelector("[data-gate]");
  if (gate && root.classList.contains("gate") && startMusic) {
    var behind = document.querySelectorAll("body > :not([data-gate])");
    var openBtn = gate.querySelector("[data-gate-open]");
    var opened = false;

    behind.forEach(function (el) { el.inert = true; });
    if (window.matchMedia("(hover: none)").matches) openBtn.textContent = "Tap to open";
    openBtn.focus({ preventScroll: true });

    var finish = function () {
      if (!gate.isConnected) return;
      root.classList.remove("gate");
      root.classList.add("gate-done");
      gate.remove();
    };

    var openGate = function () {
      if (opened) return;
      opened = true;
      document.removeEventListener("keydown", onGateKey, true);
      startMusic().then(function (ok) { if (!ok) listenForFirstInteraction(); });
      behind.forEach(function (el) { el.inert = false; });
      gate.classList.add("is-opening");
      gate.addEventListener("animationend", finish);
      window.setTimeout(finish, reduceMotion.matches ? 250 : 1600);
    };

    var onGateKey = function (e) {
      if (e.key === "Tab" || e.key === "Shift" || e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      openGate();
    };

    gate.addEventListener("click", openGate);
    document.addEventListener("keydown", onGateKey, true);
  } else if (gate) {
    root.classList.remove("gate");
    gate.remove();
  }

  /* ---------- year ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setOpen(open, returnFocus) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    if (!open && returnFocus) toggle.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
    });
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") === "true" && !e.target.closest(".site-header")) setOpen(false);
    });
    window.matchMedia("(min-width: 721px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- in-page links: move focus to the section for keyboard/screen-reader users ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () {
      var id = a.getAttribute("href").slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      // Let the browser scroll first, then move focus without a second jump.
      window.setTimeout(function () { target.focus({ preventScroll: true }); }, 0);
    });
  });

  /* ---------- gentle reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    document.documentElement.classList.add("can-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (r) { io.observe(r); });
  }
})();
