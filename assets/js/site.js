/* WANG YAO — portfolio interactions */
(function () {
  "use strict";

  /* ---------- nav ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealItems = document.querySelectorAll("[data-reveal]");
  if (revealItems.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
      revealItems.forEach(function (el) { io.observe(el); });
    } else {
      revealItems.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  /* ---------- type reveal : split headline into letters ---------- */
  var splitEls = document.querySelectorAll("[data-split]");
  if (splitEls.length) {
    var splitReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    splitEls.forEach(function (el) {
      if (el.querySelector(".split-line")) return;
      var lines = el.innerHTML.split(/<br\s*\/?>/i);
      var frag = document.createDocumentFragment();
      var index = 0;
      lines.forEach(function (html) {
        var line = document.createElement("span");
        line.className = "split-line";
        var text = html.replace(/<[^>]+>/g, "");
        var tokens = text.match(/[\u3400-\u9fff]|[\w'’@#$%&+.\-]+|\s+/g) || [];
        tokens.forEach(function (token) {
          if (/^\s+$/.test(token)) {
            line.appendChild(document.createTextNode(token));
            return;
          }
          if (/[\u3400-\u9fff]/.test(token)) {
            var ch = document.createElement("span");
            ch.className = "split-ch";
            ch.style.setProperty("--i", index++);
            var inner = document.createElement("span");
            inner.textContent = token;
            ch.appendChild(inner);
            line.appendChild(ch);
            return;
          }
          var word = document.createElement("span");
          word.className = "split-word";
          Array.prototype.forEach.call(token.split(""), function (letter) {
            var ch = document.createElement("span");
            ch.className = "split-ch";
            ch.style.setProperty("--i", index++);
            var inner = document.createElement("span");
            inner.textContent = letter;
            ch.appendChild(inner);
            word.appendChild(ch);
          });
          line.appendChild(word);
        });
        frag.appendChild(line);
      });
      el.innerHTML = "";
      el.appendChild(frag);
    });

    if (splitReduced || !("IntersectionObserver" in window)) {
      splitEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var splitIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            splitIo.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      splitEls.forEach(function (el) { splitIo.observe(el); });
    }
  }

  /* ---------- page scroll progress (home + project pages) ---------- */
  var progress = document.querySelector(".scroll-progress i, .proj-progress i");
  if (progress) {
    var pRaf = 0;
    var updateProgress = function () {
      pRaf = 0;
      var max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      var v = Math.min(1, Math.max(0, window.scrollY / max));
      progress.style.transform = "scaleX(" + v + ")";
    };
    var queueProgress = function () {
      if (!pRaf) pRaf = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", queueProgress, { passive: true });
    window.addEventListener("resize", queueProgress);
  }

  /* ---------- project page: clip reveal for image plates ---------- */
  var pans = document.querySelectorAll("[data-pan]");
  if (pans.length) {
    if ("IntersectionObserver" in window) {
      var panIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            panIo.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.04 });
      pans.forEach(function (el) { panIo.observe(el); });
    } else {
      pans.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  /* ---------- project page: module rail ---------- */
  var railLinks = document.querySelectorAll(".rail a[href^='#']");
  var modules = document.querySelectorAll(".mod[id]");
  if (railLinks.length && modules.length) {
    var activeId = "";
    var rRaf = 0;
    var updateRail = function () {
      rRaf = 0;
      var marker = window.innerHeight * 0.5;
      var current = modules[0].id;
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].getBoundingClientRect().top <= marker) current = modules[i].id;
      }
      if (current !== activeId) {
        activeId = current;
        var target = "#" + current;
        railLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === target);
        });
      }
    };
    var queueRail = function () {
      if (!rRaf) rRaf = requestAnimationFrame(updateRail);
    };
    updateRail();
    window.addEventListener("scroll", queueRail, { passive: true });
    window.addEventListener("resize", queueRail);
  }

  /* ---------- project page: counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (counters.length && "IntersectionObserver" in window && !reduced) {
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        countIo.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var pad = parseInt(el.getAttribute("data-pad") || "0", 10);
        var format = function (n) {
          var s = n.toLocaleString("en-US");
          if (pad > 1 && n < Math.pow(10, pad)) {
            var digits = s.replace(/,/g, "");
            while (digits.length < pad) digits = "0" + digits;
            s = digits;
          }
          return s;
        };
        var start = performance.now();
        var tick = function (now) {
          var p = Math.min(1, (now - start) / 1200);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = format(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.2 });
    counters.forEach(function (c) { countIo.observe(c); });
  }

  /* ---------- project page: gentle hero drift ---------- */
  var drift = document.querySelector("[data-drift]");
  var driftImg = drift ? drift.querySelector("img") : null;
  if (drift && driftImg && !reduced) {
    var dRaf = 0;
    var updateDrift = function () {
      dRaf = 0;
      var rect = drift.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;
      var p = rect.top / window.innerHeight - 0.5;
      var off = Math.max(-16, Math.min(26, p * -34));
      driftImg.style.transform = "translate3d(0," + off + "px,0) scale(1.045)";
    };
    var queueDrift = function () {
      if (!dRaf) dRaf = requestAnimationFrame(updateDrift);
    };
    updateDrift();
    window.addEventListener("scroll", queueDrift, { passive: true });
  }

  /* ---------- barcode ornament ---------- */
  var bars = document.querySelectorAll(".barcode");
  bars.forEach(function (el, idx) {
    if (el.children.length) return;
    var seed = 137 + idx * 29;
    for (var i = 0; i < 36; i++) {
      var bar = document.createElement("i");
      seed = (seed * 9301 + 49297) % 233280;
      bar.style.width = (1 + (seed % 3)) + "px";
      bar.style.height = (48 + (seed % 52)) + "%";
      el.appendChild(bar);
    }
  });

  /* ---------- subtle pointer parallax on hero ---------- */
  var visual = document.querySelector("[data-parallax]");
  var visualImg = visual ? visual.querySelector("img") : null;
  if (visual && visualImg && window.matchMedia("(hover: hover)").matches) {
    visual.addEventListener("pointermove", function (e) {
      var r = visual.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      visualImg.style.transform = "scale(1.08) translate3d(" + (x * -14) + "px," + (y * -14) + "px,0)";
    });
    visual.addEventListener("pointerleave", function () {
      visualImg.style.transform = "";
    });
  }

  /* ---------- lightbox ---------- */
  var box = document.getElementById("lightbox");
  var boxImg = box ? box.querySelector("img") : null;
  if (box && boxImg) {
    var zoomables = document.querySelectorAll(".gallery figure, .spread figure, [data-zoom]");
    zoomables.forEach(function (fig) {
      var img = fig.querySelector("img");
      if (!img) return;
      fig.addEventListener("click", function () {
        boxImg.src = img.src;
        boxImg.alt = img.alt || "";
        box.classList.add("is-open");
        box.setAttribute("aria-hidden", "false");
      });
    });
    var close = function () {
      box.classList.remove("is-open");
      box.setAttribute("aria-hidden", "true");
    };
    box.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }
})();
