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

  /* Featured game: Cursed Needle */
  featuredGame: {
    // Roblox experience page, e.g. "https://www.roblox.com/games/1234567890/Cursed-Needle"
    // Shows the "View on Roblox" button when filled.
    robloxUrl: "",

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
   * The section stays hidden while this list is empty. Example:
   *
   * {
   *   title: "Lantern Moth",
   *   status: "Prototype",            // e.g. "In Development", "Released", "Prototype"
   *   description: "One or two sentences about the game.",
   *   image: { src: "assets/img/lantern-moth.webp", alt: "Short description of the image" },
   *   robloxUrl: "",                  // optional
   *   tags: ["2D sprite", "Co-op"]    // optional
   * }
   */
  games: []
};
