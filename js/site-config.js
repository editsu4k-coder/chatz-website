/* ============================================================
   ChatZ website — single configuration source
   ------------------------------------------------------------
   Release data is fetched live from GitHub Releases (the same
   channel the ChatZ in-app updater downloads APKs from). The
   `fallbackRelease` block is only used when the API can't be
   reached (offline preview / rate limit) — refresh it when you
   publish a new release, or just rely on the live fetch.

   Support contacts mirror the ones configured inside the app
   (Settings → Privacy / Help / About).
   ============================================================ */

window.CHATZ_CONFIG = {
  // GitHub "owner/repo" that publishes ChatZ APK releases.
  githubRepo: "editsu4k-coder/chatz",

  // Only assets matching this are treated as the downloadable APK.
  apkAssetPattern: "\\.apk$",

  // Static fallback (verified 2026-10-02 against the live release).
  fallbackRelease: {
    version: "1.7",
    tag: "v1.7",
    releaseDate: "2026-10-02",
    apkSizeBytes: 8812644,
    downloadUrl:
      "https://github.com/editsu4k-coder/chatz/releases/download/v1.7/chatz-v1.7.apk",
    sha256: "2d3077afa8832d83fc4f2b61e43dc05049a5960fb6be3726dc54d1a3a2d6e72a",
    notes: [
      "Restricted-settings guidance",
      "Floating update card",
      "Honest not-syncing stats state",
      "Toggle flicker fix",
    ],
    releasePage: "https://github.com/editsu4k-coder/chatz/releases",
  },

  // Contact points — already configured in the Android app.
  support: {
    email: "chatz.org@gmail.com",
    emailLabel: "Product help, privacy requests, account deletion",
    developerEmail: "Mirmajid@proton.me",
    developerLabel: "Developer / business contact",
    telegram: "https://t.me/Mirmajid01",
    telegramHandle: "@Mirmajid01",
  },
};
