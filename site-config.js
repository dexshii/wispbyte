/*
 * Wispbyte Studios — site settings
 * --------------------------------
 * This is the ONLY file you need to edit to change links or add games.
 *
 * Rules:
 *  - Leave a value as "" (empty) and its button/link is hidden on the live site.
 *  - Links must start with https:// or they are ignored.
 *  - contactEmail is only shown once you fill in a verified studio address.
 */
window.WISPBYTE_CONFIG = {
  links: {
    discord: "https://discord.gg/2CDGdx5ESD",
    robloxGroup: "https://www.roblox.com/communities/818013339/Wispbyte-Studios",
    contactEmail: ""
  },

  /*
   * Background music. Loops quietly; visitors can switch it off with the
   * speaker button in the header (their choice is remembered).
   * Browsers only allow sound after the visitor clicks, taps or presses a key,
   * so it starts on that first interaction if it can't start right away.
   * Leave src as "" to remove the music and the button.
   */
  music: {
    src: "/assets/audio/midnight-save-point.mp3",
    title: "Midnight Save Point",
    volume: 0.5            // 0–1, on top of the already-quiet file (iPhones ignore this and use the file's level)
  },

  /* Featured game: Cursed Needle */
  featuredGame: {
    // Roblox experience page. Shows the "Play on Roblox" button on the card
    // and the "Play Cursed Needle" button in the hero.
    robloxUrl: "https://www.roblox.com/games/122611140288767/Cursed-Needle",

    // Short gameplay recording stored in the repo (MP4 or WebM, ideally under ~10 MB), e.g.
    // { src: "assets/video/cursed-needle-gameplay.mp4", poster: "assets/img/cursed-needle-1.webp", alt: "Throwing and recalling the needle through a group of enemies" }
    // Plays muted on a loop in the featured card (paused for visitors who prefer reduced motion).
    // Takes priority over the trailer and screenshots for the main slot.
    clip: {
      src: "/assets/video/cursed-needle-gameplay.mp4",
      poster: "/assets/img/cursed-needle-power-stolen.webp",
      alt: "Cursed Needle gameplay: throwing the needle, stealing Snare and Scatter powers on the recall, building a x4 combo, landing a perfect catch and clearing the room"
    },

    // YouTube video ID for a trailer (the part after "v=" in the URL), e.g. "dQw4w9WgXcQ".
    // Used in the main slot when there is no clip.
    trailerYouTubeId: "",

    // Real screenshots placed in assets/img/, e.g.
    // { src: "assets/img/cursed-needle-1.webp", alt: "The needle flying back through three slimes" }
    // Shown as a strip under the featured card. With no clip or trailer, the first one fills the main slot instead.
    screenshots: [
      { src: "/assets/img/cursed-needle-title.webp", alt: "Cursed Needle title screen: Throw. Dodge. Recall. Reap." },
      { src: "/assets/img/cursed-needle-recall.webp", alt: "Recalling the needle through a Button Eye enemy to steal its power" },
      { src: "/assets/img/cursed-needle-combo.webp", alt: "A Snare trail and Scatter shots building a x4 combo" },
      { src: "/assets/img/cursed-needle-perfect-catch.webp", alt: "Perfect Catch: the next throw is sharper" }
    ]
  },

  /*
   * More games. Each object becomes a card under "From the Workshop".
   * The section stays hidden while this list is empty.
   *
   * Media (optional, add any time):
   *   clip:  { src: "/assets/video/game-name.mp4", poster: "/assets/img/game-name-1.webp", alt: "What the clip shows" }
   *          plays muted on a loop in the card (takes priority over image)
   *   image: { src: "/assets/img/game-name-1.webp", alt: "What the screenshot shows" }
   *   With neither, the card shows the emblem and "Screenshots & video coming soon".
   *
   *   status:    e.g. "In Development", "Coming Soon", "Released"
   *   tags:      short keywords shown as pills
   *   robloxUrl: the "View on Roblox" button appears once this is filled
   */
  games: [
    {
      title: "AFTERCUT",
      status: "In Development",
      description: "A neon-noir action game where everything dies in one hit, including you. Slow time, cut bullets back at whoever fired them, and carve a clean path through every floor. Pull off a perfect clear and watch the whole run play back as one uncut take.",
      tags: ["One-hit kills", "Slow time", "Deflect bullets", "Replay every clear"],
      clip: { src: "", poster: "", alt: "" },
      image: { src: "", alt: "" },
      robloxUrl: ""
    },
    {
      title: "Stonewake",
      status: "In Development",
      description: "Dig into a world that keeps going down. Mine ore, craft sharper tools, and build a base that holds when night falls. Every layer you break through hides new caverns, stranger creatures and something ancient waiting to wake.",
      tags: ["Dig & build", "Crafting", "Deep caverns", "Boss fights"],
      clip: { src: "", poster: "", alt: "" },
      image: { src: "", alt: "" },
      robloxUrl: ""
    },
    {
      title: "Mothgrave",
      status: "In Development",
      description: "Descend into the ruins of a buried moth kingdom, lit only by the things that still glow. Explore one vast, interconnected underworld, learn its tough and precise combat, and bind relics that change how you fight. Every forgotten corner hides a secret, a shortcut, or a guardian that never stopped waiting.",
      tags: ["Metroidvania", "Hand-drawn world", "Tough bosses", "Relic builds"],
      clip: { src: "", poster: "", alt: "" },
      image: { src: "", alt: "" },
      robloxUrl: ""
    },
    {
      title: "Cloverbrook",
      status: "In Development",
      description: "Trade the noise for a patch of overgrown land at the edge of a sleepy valley town. Plant and harvest through the seasons, fish the brook, raise animals and get to know your neighbors. Fix up the old farm, uncover what the valley has been hiding, and make Cloverbrook feel like home.",
      tags: ["Farming", "Seasons", "Cozy town life", "Fishing & foraging"],
      clip: { src: "", poster: "", alt: "" },
      image: { src: "", alt: "" },
      robloxUrl: ""
    }
  ]
};
