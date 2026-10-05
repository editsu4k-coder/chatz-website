/* ==========================================================================
   ChatZ website — release / download integration
   Reads the latest GitHub Release (the same channel the in-app updater
   downloads from) and populates every [data-release] hook on the page.
   Falls back to the static values in js/site-config.js on any failure.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.CHATZ_CONFIG || {};
  var FALLBACK = CFG.fallbackRelease || {};

  function set(key, value) {
    document.querySelectorAll('[data-release="' + key + '"]').forEach(function (el) {
      el.textContent = value;
    });
  }

  function fmtSize(bytes) {
    if (!bytes) return "";
    return (bytes / 1000 / 1000).toFixed(1) + " MB";
  }

  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return iso;
    }
  }

  function versionFromTag(tag) {
    return (tag || "").replace(/^v/i, "");
  }

  function parseNotes(body) {
    if (!body) return [];
    var items = [];
    var push = function (part) {
      part = part.trim().replace(/\.$/, "");
      if (part.length > 2 && part.length <= 200 && items.indexOf(part) === -1) items.push(part);
    };
    body.trim().split(/\r?\n/).forEach(function (line) {
      line = line.trim().replace(/^[-*•]\s*/, "").replace(/^\d+[.)]\s*/, "");
      if (!line) return;
      var parts = line.split(/\s*·\s*/);
      parts.forEach(function (part) {
        // A comma-list ("A, B, C" with every item short) becomes one note per
        // item; sentences that merely contain commas stay whole.
        var bits = part.split(/,\s*/);
        if (bits.length > 1 && bits.every(function (b) { return b.trim().length >= 3 && b.trim().length <= 60; })) {
          bits.forEach(push);
        } else {
          push(part);
        }
      });
    });
    return items.slice(0, 6);
  }

  var currentSha = null;

  function apply(rel) {
    if (!rel) return;
    var version = rel.versionName || versionFromTag(rel.tag);
    if (version) set("version", version);
    if (rel.date) set("date", fmtDate(rel.date));
    if (rel.size) set("size", fmtSize(rel.size));
    var btn = document.getElementById("dlButton");
    if (btn && rel.downloadUrl) btn.href = rel.downloadUrl;
    var page = document.querySelector('[data-release="releasePage"]');
    if (page && rel.releasePage) page.href = rel.releasePage;

    var shaEl = document.getElementById("releaseSha");
    if (shaEl && rel.sha256) {
      currentSha = rel.sha256;
      shaEl.textContent = rel.sha256.slice(0, 8) + "…" + rel.sha256.slice(-6);
      shaEl.title = rel.sha256;
    }

    var notes = rel.notes;
    if (typeof notes === "string") notes = parseNotes(notes);
    var list = document.getElementById("releaseNotes");
    if (list && notes && notes.length) {
      list.innerHTML = "";
      notes.forEach(function (n) {
        var li = document.createElement("li");
        li.textContent = n;
        list.appendChild(li);
      });
    }
  }

  /* Copy button — bound once, reads the live checksum, honest about failure. */
  var copyBtn = document.getElementById("shaCopy");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var flash = function (ok) {
        copyBtn.classList.add(ok ? "is-copied" : "is-error");
        copyBtn.innerHTML = '<svg class="icon"><use href="#' + (ok ? "i-check" : "i-x") + '"/></svg>';
        copyBtn.setAttribute("aria-label", ok ? "Checksum copied" : "Copy failed — select the checksum text instead");
        setTimeout(function () {
          copyBtn.innerHTML = '<svg class="icon"><use href="#i-copy"/></svg>';
          copyBtn.classList.remove("is-copied", "is-error");
          copyBtn.setAttribute("aria-label", "Copy full SHA-256 checksum");
        }, 1600);
      };
      if (!currentSha) return;
      var fallbackCopy = function () {
        try {
          var ta = document.createElement("textarea");
          ta.value = currentSha;
          ta.setAttribute("readonly", "");
          ta.style.cssText = "position:fixed;left:-9999px";
          document.body.appendChild(ta);
          ta.select();
          var ok = document.execCommand("copy");
          document.body.removeChild(ta);
          flash(ok);
        } catch (e) { flash(false); }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentSha).then(function () { flash(true); }, fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }

  /* Start from the configured fallback so the page is never empty,
     then upgrade with live data when GitHub responds. */
  apply({
    versionName: FALLBACK.version,
    tag: FALLBACK.tag,
    date: FALLBACK.releaseDate,
    size: FALLBACK.apkSizeBytes,
    downloadUrl: FALLBACK.downloadUrl,
    sha256: FALLBACK.sha256,
    notes: FALLBACK.notes,
    releasePage: FALLBACK.releasePage
  });

  if (CFG.githubRepo) {
    fetch("https://api.github.com/repos/" + CFG.githubRepo + "/releases/latest", {
      headers: { Accept: "application/vnd.github+json" }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.tag_name) return;
        var re = new RegExp(CFG.apkAssetPattern || "\\.apk$", "i");
        var asset = (j.assets || []).find(function (a) { return re.test(a.name); });
        apply({
          versionName: versionFromTag(j.tag_name),
          tag: j.tag_name,
          date: j.published_at,
          size: asset && asset.size,
          downloadUrl: asset && asset.browser_download_url,
          sha256: asset && asset.digest ? String(asset.digest).replace(/^sha256:/, "") : null,
          notes: j.body,
          releasePage: j.html_url || "https://github.com/" + CFG.githubRepo + "/releases"
        });
      })
      .catch(function () { /* fallback already applied */ });
  }
})();
