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

  // Static fallback (verified 2026-10-05 against release v1.9).
  fallbackRelease: {
    version: "1.9",
    tag: "v1.9",
    releaseDate: "2026-10-04",
    apkSizeBytes: 8816012,
    downloadUrl:
      "https://github.com/editsu4k-coder/chatz/releases/download/v1.9/chatz-v1.9.apk",
    sha256: "1412bd30cff48752da18e4e7e4cdaa5778c6ff4dd2b69a36865cc82f51bf106a",
    notes: [
      "Catch-up notifications: activity that lands while the OEM freezer suspends ChatZ now reaches you as one summary alert when the app wakes",
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
