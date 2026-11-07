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
    clip: { src: "", poster: "", alt: "" },

    // YouTube video ID for a trailer (the part after "v=" in the URL), e.g. "dQw4w9WgXcQ".
    // Shown instead of the placeholder art when filled.
    trailerYouTubeId: "",

    // Real screenshots placed in assets/img/, e.g.
    // { src: "assets/img/cursed-needle-1.webp", alt: "The needle flying back through three slimes" }
    // The first one replaces the placeholder art (if there is no trailer); the rest appear as a strip below.
    screenshots: []
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
