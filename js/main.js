/* ==========================================================================
   ChatZ website — interactions
   Vanilla JS, no dependencies. Everything degrades gracefully without JS:
   content is fully visible, the demo opens on Pulse, accordions are native.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE_POINTER = window.matchMedia("(pointer: fine)").matches;

  /* ======================= Avatars (drawn, like the app) ==================
     The Android app draws 16 SVG archetypes × 12 palettes at runtime and
     stores only an id. The site mirrors that idea with a small subset.     */

  var PALETTES = [
    { from: "#FFC46B", to: "#FF8A5B", face: "#FFF3E6", ink: "#4A2E23", accent: "#E8763F" },
    { from: "#8FE3D2", to: "#46B79F", face: "#F0FFF9", ink: "#17453C", accent: "#2F9A82" },
    { from: "#9CCBFF", to: "#5A8FEF", face: "#F2F8FF", ink: "#1D3A63", accent: "#4A7FDD" },
    { from: "#C3A8FF", to: "#8264E8", face: "#F7F3FF", ink: "#33265E", accent: "#7A5AE0" },
    { from: "#FFB3CD", to: "#F06C9D", face: "#FFF2F7", ink: "#5C1F38", accent: "#E75A8D" },
    { from: "#C6EC8F", to: "#7CC24A", face: "#F9FFEF", ink: "#2E4419", accent: "#6BB13A" },
    { from: "#FFD3A5", to: "#F5A05A", face: "#FFF8F1", ink: "#5A3520", accent: "#EF9542" },
    { from: "#93E6FF", to: "#37B5DD", face: "#EFFBFF", ink: "#123F52", accent: "#2AA3CA" },
    { from: "#B8A0FF", to: "#6E4FE0", face: "#F4F1FF", ink: "#2C1F5E", accent: "#6A4AD6" },
    { from: "#FFE894", to: "#F2C23C", face: "#FFFDF0", ink: "#4E3D0E", accent: "#E0AC24" },
    { from: "#FFAA96", to: "#F2665E", face: "#FFF4F1", ink: "#5C2620", accent: "#E8564E" },
    { from: "#7CDFC8", to: "#2E9E8C", face: "#EFFBF7", ink: "#12423A", accent: "#249583" }
  ];

  function eyes(color, cy) {
    return (
      '<circle cx="24" cy="' + cy + '" r="3" fill="' + color + '"/>' +
      '<circle cx="40" cy="' + cy + '" r="3" fill="' + color + '"/>'
    );
  }
  function smile(color, cy) {
    return '<path d="M26 ' + cy + 'q6 5 12 0" fill="none" stroke="' + color + '" stroke-width="2.6" stroke-linecap="round"/>';
  }

  var ART = {
    cat: function (p) {
      return (
        '<path d="M14 26 L18 10 L28 20 Z" fill="' + p.ink + '"/>' +
        '<path d="M50 26 L46 10 L36 20 Z" fill="' + p.ink + '"/>' +
        '<path d="M16 24 L19 14 L25 20 Z" fill="' + p.accent + '"/>' +
        '<path d="M48 24 L45 14 L39 20 Z" fill="' + p.accent + '"/>' +
        eyes(p.ink, 33) + smile(p.ink, 41) +
        '<path d="M30 37h4l-2 3z" fill="' + p.accent + '"/>'
      );
    },
    fox: function (p) {
      return (
        '<path d="M12 28 L15 8 L30 20 Z" fill="' + p.ink + '"/>' +
        '<path d="M52 28 L49 8 L34 20 Z" fill="' + p.ink + '"/>' +
        '<ellipse cx="32" cy="42" rx="15" ry="11" fill="' + p.face + '"/>' +
        eyes(p.ink, 31) +
        '<path d="M32 39l-3.4 4.2h6.8z" fill="' + p.ink + '"/>' +
        '<path d="M28 47q4 3.4 8 0" fill="none" stroke="' + p.ink + '" stroke-width="2.4" stroke-linecap="round"/>'
      );
    },
    panda: function (p) {
      return (
        '<circle cx="15" cy="16" r="9" fill="' + p.ink + '"/>' +
        '<circle cx="49" cy="16" r="9" fill="' + p.ink + '"/>' +
        '<ellipse cx="23" cy="34" rx="7.5" ry="8.5" fill="' + p.ink + '" transform="rotate(-14 23 34)"/>' +
        '<ellipse cx="41" cy="34" rx="7.5" ry="8.5" fill="' + p.ink + '" transform="rotate(14 41 34)"/>' +
        '<circle cx="24" cy="33" r="2.4" fill="' + p.face + '"/>' +
        '<circle cx="40" cy="33" r="2.4" fill="' + p.face + '"/>' +
        '<path d="M29 44h6l-3 3.4z" fill="' + p.ink + '"/>' +
        smile(p.ink, 50)
      );
    },
    bunny: function (p) {
      return (
        '<rect x="17" y="2" width="9" height="24" rx="4.5" fill="' + p.ink + '" transform="rotate(-8 21.5 14)"/>' +
        '<rect x="38" y="2" width="9" height="24" rx="4.5" fill="' + p.ink + '" transform="rotate(8 42.5 14)"/>' +
        '<rect x="19.5" y="6" width="4" height="15" rx="2" fill="' + p.face + '" transform="rotate(-8 21.5 13.5)"/>' +
        '<rect x="40.5" y="6" width="4" height="15" rx="2" fill="' + p.face + '" transform="rotate(8 42.5 13.5)"/>' +
        eyes(p.ink, 35) +
        '<path d="M30 42h4l-2 3z" fill="' + p.accent + '"/>' +
        smile(p.ink, 47)
      );
    },
    robot: function (p) {
      return (
        '<line x1="32" y1="8" x2="32" y2="15" stroke="' + p.ink + '" stroke-width="2.6"/>' +
        '<circle cx="32" cy="7" r="3.4" fill="' + p.accent + '"/>' +
        '<rect x="12" y="15" width="40" height="32" rx="11" fill="' + p.face + '"/>' +
        '<rect x="20" y="26" width="7" height="9" rx="2.5" fill="' + p.ink + '"/>' +
        '<rect x="37" y="26" width="7" height="9" rx="2.5" fill="' + p.ink + '"/>' +
        '<path d="M26 41h12" stroke="' + p.ink + '" stroke-width="2.6" stroke-linecap="round"/>'
      );
    },
    ghost: function (p) {
      return (
        '<path d="M12 52 V30 a20 20 0 0 1 40 0 V52 l-6.5-4.5 -6.7 4.5 -6.8-4.5 -6.7 4.5 -6.6-4.5 Z" fill="' + p.face + '"/>' +
        '<circle cx="25" cy="32" r="3.4" fill="' + p.ink + '"/>' +
        '<circle cx="39" cy="32" r="3.4" fill="' + p.ink + '"/>' +
        '<ellipse cx="32" cy="42" rx="3.6" ry="4.4" fill="' + p.accent + '"/>'
      );
    },
    star: function (p) {
      return (
        '<path d="M32 8 l6.6 13.6 15 2.1 -10.9 10.5 2.6 14.8 -13.3-7.1 -13.3 7.1 2.6-14.8 -10.9-10.5 15-2.1 Z" fill="' + p.face + '"/>' +
        eyes(p.ink, 33) + smile(p.ink, 41)
      );
    },
    sprout: function (p) {
      return (
        '<path d="M32 52 V30" stroke="' + p.accent + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M32 34 C20 34 14 26 14 18 C26 18 32 24 32 34 Z" fill="' + p.accent + '"/>' +
        '<path d="M32 30 C44 30 50 22 50 14 C38 14 32 20 32 30 Z" fill="' + p.ink + '"/>' +
        eyes(p.ink, 40) +
        '<path d="M27 47 q5 4 10 0" fill="none" stroke="' + p.ink + '" stroke-width="2.4" stroke-linecap="round"/>'
      );
    },
    alien: function (p) {
      return (
        '<path d="M32 8 C18 8 10 18 10 30 C10 40 20 46 32 46 C44 46 54 40 54 30 C54 18 46 8 32 8 Z" fill="' + p.face + '"/>' +
        '<ellipse cx="24" cy="30" rx="4.6" ry="7" fill="' + p.ink + '" transform="rotate(12 24 30)"/>' +
        '<ellipse cx="40" cy="30" rx="4.6" ry="7" fill="' + p.ink + '" transform="rotate(-12 40 30)"/>' +
        '<path d="M28 41 q4 3 8 0" fill="none" stroke="' + p.ink + '" stroke-width="2.4" stroke-linecap="round"/>'
      );
    }
  };

  var avIndex = 0;
  function paintAvatars(root) {
    (root || document).querySelectorAll(".p-avatar[data-avatar]").forEach(function (el) {
      if (el.dataset.avDone) return;
      el.dataset.avDone = "1";
      var art = el.dataset.avatar;
      var pal = PALETTES[(parseInt(el.dataset.palette, 10) || 0) % PALETTES.length];
      el.style.setProperty("--av-from", pal.from);
      el.style.setProperty("--av-to", pal.to);
      var draw = ART[art];
      if (!draw) return;
      avIndex += 1;
      var svg =
        '<svg viewBox="0 0 64 64" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%">' +
        draw(pal) +
        "</svg>";
      var holder = document.createElement("span");
      holder.style.cssText = "position:absolute;inset:0;border-radius:inherit;overflow:hidden";
      holder.innerHTML = svg;
      el.appendChild(holder);
    });
  }
  paintAvatars(document);

  /* ============================ Nav & menu ============================ */
  var nav = document.getElementById("siteNav");
  var burger = document.querySelector(".nav__burger");
  var menu = document.getElementById("mobileMenu");

  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (burger && menu) {
    menu.querySelectorAll(".mobile-menu__links a").forEach(function (a, i) {
      a.style.setProperty("--i", i);
    });
    var setMenu = function (open) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
    });
  }

  /* ============================ Reveals ============================ */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll(".reveal, .steps__track").forEach(function (el) { io.observe(el); });

  /* Counters */
  function fmtDuration(mins) {
    mins = Math.round(mins);
    var h = Math.floor(mins / 60), m = mins % 60;
    if (h <= 0) return m + "m";
    return h + "h " + (m < 10 ? "0" + m : m) + "m";
  }
  var cio = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target;
        var target = parseFloat(el.dataset.count || "0");
        var format = el.dataset.format;
        if (REDUCED || !target) return;
        var t0 = null, DUR = 1500;
        function frame(t) {
          if (t0 === null) t0 = t;
          var k = Math.min(1, (t - t0) / DUR);
          var eased = 1 - Math.pow(1 - k, 4);
          var val = target * eased;
          el.textContent = format === "duration" ? fmtDuration(val) : Math.round(val);
          if (k < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

  /* Rings: copy data-ring into --r so CSS can animate to it */
  document.querySelectorAll("[data-ring]").forEach(function (el) {
    el.style.setProperty("--r", el.dataset.ring || "0.62");
  });

  /* ============================ Cursor ============================ */
  if (FINE_POINTER && !REDUCED) {
    var cursor = document.getElementById("cursor");
    if (cursor) {
      var cx = -100, cy = -100, tx = cx, ty = cy, seen = false;
      document.addEventListener("pointermove", function (e) {
        tx = e.clientX; ty = e.clientY;
        if (!seen) { seen = true; cx = tx; cy = ty; cursor.classList.add("is-on"); }
      }, { passive: true });
      (function loop() {
        cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
        cursor.style.transform = "translate(" + cx + "px," + cy + "px)";
        requestAnimationFrame(loop);
      })();
      var HOVER = "a, button, [role='button'], summary, input, label.p-toggle, .p-friend[data-goto-friend]";
      document.addEventListener("pointerover", function (e) {
        cursor.classList.toggle("is-link", !!e.target.closest(HOVER));
      }, { passive: true });
    }
  }

  /* ============================ Magnetic buttons ============================ */
  if (FINE_POINTER && !REDUCED) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        var y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        btn.style.transform = "translate(" + x * 3 + "px," + (y * 3 - 1) + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  /* ============================ Hero parallax ============================ */
  var heroPhone = document.querySelector(".hero__phone");
  if (heroPhone && FINE_POINTER && !REDUCED) {
    var hero = document.querySelector(".hero");
    var raf = null;
    hero.addEventListener("pointermove", function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        heroPhone.style.setProperty("--ry", -9 + x * 7 + "deg");
        heroPhone.style.setProperty("--rx", 4 - y * 6 + "deg");
      });
    }, { passive: true });
    hero.addEventListener("pointerleave", function () {
      heroPhone.style.setProperty("--ry", "-9deg");
      heroPhone.style.setProperty("--rx", "4deg");
    });
  }

  /* ======================= Shared demo / privacy state ======================= */
  var state = {
    mode: "active",
    shares: { screen: true, apps: true, data: false, status: true }
  };
  var SHARE_LABELS = { screen: "Screen time", apps: "App usage", data: "Data usage", status: "Active status" };

  function applyState() {
    var silent = state.mode === "silent";

    /* Mode buttons everywhere */
    document.querySelectorAll("[data-demo-mode]").forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.demoMode === state.mode);
    });

    /* Share checkboxes everywhere */
    document.querySelectorAll("input[data-share]").forEach(function (c) {
      c.checked = !!state.shares[c.dataset.share];
    });

    /* Demo phone (Pulse) silent presentation */
    var pulse = document.getElementById("screen-pulse");
    if (pulse) {
      var val = pulse.querySelector(".p-today__value");
      var label = pulse.querySelector(".p-today__label");
      var sub = pulse.querySelector(".p-today__sub");
      var fr = pulse.querySelector(".p-friend__sub");
      if (silent) {
        if (val) val.textContent = "Paused";
        if (label) label.textContent = "Stats sharing";
        if (sub) sub.textContent = "Silent — friends can't see today";
        if (fr) { fr.dataset.orig = fr.dataset.orig || fr.textContent; fr.textContent = "Stats sharing is paused"; }
        pulse.classList.add("is-silent");
      } else {
        if (val) val.textContent = "4h 28m";
        if (label) label.textContent = "Screen time today";
        if (sub) sub.textContent = "Goal · 7h 00m";
        if (fr && fr.dataset.orig) fr.textContent = fr.dataset.orig;
        pulse.classList.remove("is-silent");
      }
    }
    var demoPhone = document.getElementById("demoPhone");
    if (demoPhone) demoPhone.classList.toggle("phone--silent", silent);

    /* Privacy section: friend view */
    var pausedBox = document.getElementById("privacyPaused");
    var view = document.getElementById("privacyView");
    var summary = document.getElementById("privacySummary");
    var note = document.getElementById("demoModeNote");
    if (pausedBox && view) {
      pausedBox.hidden = !silent;
      view.style.display = silent ? "none" : "";
    }
    if (summary) {
      if (silent) summary.textContent = "Silent mode — sharing paused";
      else {
        var n = 0;
        Object.keys(state.shares).forEach(function (k) { if (state.shares[k]) n += 1; });
        summary.textContent = n + " of 4 categories shared";
      }
    }
    if (!silent && view) {
      view.querySelectorAll(".pv-row").forEach(function (row) {
        row.classList.toggle("is-off", !state.shares[row.dataset.pv]);
      });
    }
    if (note) note.textContent = silent
      ? "Silent — sharing is paused and you appear offline until you switch back."
      : "Active — sharing today's stats with your circle.";
  }

  document.addEventListener("change", function (e) {
    var c = e.target;
    if (c.matches("input[data-share]")) {
      state.shares[c.dataset.share] = c.checked;
      applyState();
    }
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-demo-mode]");
    if (b) { state.mode = b.dataset.demoMode; applyState(); }
  });
  applyState();

  /* ======================= Interactive demo phone ======================= */
  var phone = document.getElementById("demoPhone");
  if (phone) {
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".demo__tab"));
    var screens = Array.prototype.slice.call(phone.querySelectorAll(".scr"));
    var current = 0;

    function goto(idx) {
      if (idx === current || idx < 0 || idx >= screens.length) return;
      var back = idx < current;
      var to = screens[idx];
      screens.forEach(function (s) {
        s.classList.remove("is-active", "scr--back");
        s.hidden = true;
      });
      to.hidden = false;
      to.classList.toggle("scr--back", back);
      to.classList.add("is-active");
      to.scrollTop = 0;
      tabs.forEach(function (t, i) {
        t.classList.toggle("is-active", i === idx);
        t.setAttribute("aria-selected", String(i === idx));
      });
      current = idx;
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { goto(i); });
    });

    /* Friend cards → Usage screen */
    var FRIENDS = {
      mira: { name: "Mira", handle: "@mira · Today", total: "4h 12m", avatar: "fox", palette: "0", battery: "78% · charging" },
      dan: { name: "Dan", handle: "@danbuilds · Today", total: "2h 47m", avatar: "robot", palette: "2", battery: "54% · on battery" },
      aiko: { name: "Aiko", handle: "@aiko · Yesterday", total: "1h 05m", avatar: "star", palette: "9", battery: "91% · charging" }
    };
    phone.querySelectorAll("[data-goto-friend]").forEach(function (card) {
      var open = function () {
        var f = FRIENDS[card.dataset.gotoFriend];
        if (!f) return;
        document.getElementById("usageName").textContent = f.name;
        document.getElementById("usageHandle").textContent = f.handle;
        document.getElementById("usageTotal").textContent = f.total;
        document.getElementById("usageBattery").innerHTML =
          '<svg class="icon"><use href="#i-battery"/></svg> ' + f.battery;
        var av = document.getElementById("usageAvatar");
        av.dataset.avatar = f.avatar; av.dataset.palette = f.palette;
        av.dataset.avDone = ""; av.querySelector("span") && av.querySelector("span").remove();
        paintAvatars(av.parentElement);
        goto(3);
      };
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });

    /* Friend search filter */
    var search = document.getElementById("demoFriendSearch");
    if (search) {
      var list = document.getElementById("demoFriendList");
      var emptyNote = document.createElement("p");
      emptyNote.className = "p-note";
      emptyNote.textContent = "No results — try a different @handle or name.";
      emptyNote.hidden = true;
      list.after(emptyNote);
      search.addEventListener("input", function () {
        var q = search.value.trim().toLowerCase();
        var visible = 0;
        list.querySelectorAll("[data-name]").forEach(function (card) {
          var hit = !q || card.dataset.name.indexOf(q) !== -1 || card.textContent.toLowerCase().indexOf(q) !== -1;
          card.hidden = !hit;
          if (hit) visible += 1;
        });
        emptyNote.hidden = visible > 0;
      });
    }

    /* Composer */
    var composer = document.getElementById("demoComposer");
    if (composer) {
      var thread = document.getElementById("demoThread");
      var input = document.getElementById("demoInput");
      var replies = ["you're one to talk 😌", "ok stat detective", "touch grass later? 🌱"];
      var ri = 0;
      composer.addEventListener("submit", function (e) {
        e.preventDefault();
        var text = input.value.trim();
        if (!text) return;
        var out = document.createElement("div");
        out.className = "p-msg p-msg--out";
        out.textContent = text;
        thread.appendChild(out);
        input.value = "";
        thread.scrollTop = thread.scrollHeight;
        setTimeout(function () {
          var rep = document.createElement("div");
          rep.className = "p-msg p-msg--in";
          rep.textContent = replies[ri++ % replies.length];
          thread.appendChild(rep);
          thread.scrollTop = thread.scrollHeight;
        }, 1100);
      });
    }
  }

  /* ======================= Download: release details toggle ======================= */
  var dlBtn = document.getElementById("dlDetailsBtn");
  var relCard = document.getElementById("releaseCard");
  if (dlBtn && relCard) {
    dlBtn.addEventListener("click", function () {
      var open = dlBtn.getAttribute("aria-expanded") === "true";
      dlBtn.setAttribute("aria-expanded", String(!open));
      relCard.hidden = open;
    });
  }

  /* ======================= FAQ accordion (smooth height) ======================= */
  document.querySelectorAll(".acc").forEach(function (acc) {
    var summary = acc.querySelector("summary");
    var body = acc.querySelector(".acc__body");
    if (!summary || !body) return;
    summary.addEventListener("click", function (e) {
      e.preventDefault();
      if (REDUCED) { acc.open = !acc.open; return; }
      if (acc.open) {
        var h = body.offsetHeight;
        body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }],
          { duration: 260, easing: "cubic-bezier(.22,1,.36,1)" })
          .onfinish = function () { acc.open = false; };
      } else {
        acc.open = true;
        var h2 = body.offsetHeight;
        body.animate([{ height: "0px", opacity: 0 }, { height: h2 + "px", opacity: 1 }],
          { duration: 320, easing: "cubic-bezier(.22,1,.36,1)" });
      }
    });
  });

  /* ======================= FAQ page: search filter ======================= */
  var faqSearch = document.getElementById("faqSearch");
  if (faqSearch) {
    var faqCount = document.getElementById("faqCount");
    var accs = Array.prototype.slice.call(document.querySelectorAll(".doc__body .acc"));
    var groups = Array.prototype.slice.call(document.querySelectorAll(".doc__body .faq-group"));
    var noneNote = document.createElement("p");
    noneNote.className = "faq-count";
    noneNote.textContent = "No matches — try a different word, or contact support below.";
    noneNote.hidden = true;
    var foot = document.querySelector(".faq-foot");
    if (foot) foot.before(noneNote); else accs[accs.length - 1].after(noneNote);
    faqSearch.addEventListener("input", function () {
      var q = faqSearch.value.trim().toLowerCase();
      var visible = 0;
      accs.forEach(function (acc) {
        var hit = !q || acc.textContent.toLowerCase().indexOf(q) !== -1;
        acc.hidden = !hit;
        if (hit) visible += 1;
      });
      groups.forEach(function (g) {
        var el = g.nextElementSibling, any = false;
        while (el && !el.classList.contains("faq-group")) {
          if (el.classList.contains("acc") && !el.hidden) any = true;
          el = el.nextElementSibling;
        }
        g.hidden = !any;
      });
      noneNote.hidden = visible > 0;
      if (faqCount) faqCount.textContent = visible + (visible === 1 ? " question" : " questions");
    });
  }

  /* Open a target accordion from a hash link, e.g. faq.html#install-apk */
  function openHashTarget() {
    if (!location.hash) return;
    var el = document.querySelector(location.hash);
    if (el && el.classList.contains("acc")) {
      el.open = true;
      setTimeout(function () { el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" }); }, 60);
    }
  }
  openHashTarget();
  window.addEventListener("hashchange", openHashTarget);
})();
