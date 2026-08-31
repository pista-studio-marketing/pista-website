/* Pista Studio — interactions légères */

(function () {
  // Le point signature: pastille ronde dessinée, jamais le glyphe carré de la fonte
  document.querySelectorAll(".dot, .dot--rouge, .accent, .count-big em, .taux .montant em, .marquee-inner i").forEach(function (el) {
    if (el.textContent.trim() === ".") {
      el.textContent = "";
      el.classList.add("prond");
      el.setAttribute("aria-hidden", "true");
    }
  });

  // Les points des surtitres, devises et signatures deviennent aussi des pastilles rouges
  document.querySelectorAll(".label, .kicker, .devise, .signature").forEach(function (el) {
    if (el.children.length === 0 && el.textContent.indexOf(".") !== -1) {
      var t = el.textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      el.innerHTML = t.replace(/\./g, '<span class="prond prond--txt" aria-hidden="true"></span>');
    }
  });

  // Menu mobile
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Apparition au défilement
  var revealed = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealed.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealed.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealed.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var langFr = (document.documentElement.lang || "fr").indexOf("fr") === 0;

  // Course de nuit, bascule jour/nuit mémorisée
  try {
    if (localStorage.getItem("pista-theme") === "nuit") {
      document.body.classList.add("nuit");
    }
  } catch (e) {}

  var navLinks = document.querySelector(".nav-links");
  if (navLinks) {
    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.className = "lang-switch theme-toggle";
    var majTheme = function () {
      var nuit = document.body.classList.contains("nuit");
      btn.textContent = nuit ? (langFr ? "Jour" : "Day") : (langFr ? "Nuit" : "Night");
      btn.setAttribute("aria-label", langFr ? "Basculer le mode nuit" : "Toggle night mode");
    };
    btn.addEventListener("click", function () {
      document.body.classList.toggle("nuit");
      try {
        localStorage.setItem("pista-theme", document.body.classList.contains("nuit") ? "nuit" : "jour");
      } catch (e) {}
      majTheme();
    });
    majTheme();
    li.appendChild(btn);
    navLinks.appendChild(li);
  }

  // Séquence de départ, les feux s'éteignent puis la course part
  var veutDepart = document.body.hasAttribute("data-depart");
  var dejaVu = false;
  try { dejaVu = sessionStorage.getItem("pista-depart") === "1"; } catch (e) {}

  if (veutDepart && !dejaVu && !reduceMotion) {
    try { sessionStorage.setItem("pista-depart", "1"); } catch (e) {}
    var overlay = document.createElement("div");
    overlay.className = "depart-overlay";
    overlay.setAttribute("aria-hidden", "true");
    for (var d = 0; d < 5; d++) {
      overlay.appendChild(document.createElement("i"));
    }
    document.body.appendChild(overlay);
    var feux = overlay.querySelectorAll("i");
    feux.forEach(function (f, i) {
      setTimeout(function () { f.classList.add("on"); }, 300 + i * 320);
    });
    setTimeout(function () {
      feux.forEach(function (f) { f.classList.remove("on"); });
    }, 300 + 5 * 320 + 420);
    setTimeout(function () {
      overlay.style.opacity = "0";
      setTimeout(function () { overlay.remove(); }, 550);
    }, 300 + 5 * 320 + 700);
  }

  // Compteur de tours dans la marge
  var tours = document.querySelectorAll("main > section");
  if (tours.length > 1) {
    var compteur = document.createElement("div");
    compteur.className = "lap-counter";
    document.body.appendChild(compteur);
    var motTour = langFr ? "Tour" : "Lap";
    compteur.textContent = motTour + " 1 / " + tours.length;
    if ("IntersectionObserver" in window) {
      var obsTours = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var idx = Array.prototype.indexOf.call(tours, e.target) + 1;
            compteur.textContent = motTour + " " + idx + " / " + tours.length;
          }
        });
      }, { rootMargin: "-45% 0px -45% 0px" });
      tours.forEach(function (s) { obsTours.observe(s); });
    }
  }

  // Le point signature suit le curseur
  if (hasPointer && !reduceMotion) {
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.appendChild(dot);

    var mx = 0, my = 0, cx = 0, cy = 0, started = false;

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (!started) {
        started = true;
        cx = mx;
        cy = my;
        dot.classList.add("actif");
        boucle();
      }
    });

    document.addEventListener("mouseleave", function () {
      dot.classList.remove("actif");
      started = false;
    });

    document.addEventListener("mouseover", function (e) {
      if (e.target.closest("a, button, .svc-row, .sector-row")) {
        dot.classList.add("grossi");
      } else {
        dot.classList.remove("grossi");
      }
    });

    function boucle() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      dot.style.transform = "translate(" + (cx - 5) + "px," + (cy - 5) + "px)";
      if (started) window.requestAnimationFrame(boucle);
    }

    // Trainée de freinage quand le curseur accélère
    var lastX = 0, lastY = 0, lastTrail = 0;
    document.addEventListener("mousemove", function (e) {
      var now = Date.now();
      var dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 34 && now - lastTrail > 28) {
        lastTrail = now;
        var t = document.createElement("span");
        t.className = "trail-dot";
        t.style.left = e.clientX + "px";
        t.style.top = e.clientY + "px";
        document.body.appendChild(t);
        window.requestAnimationFrame(function () {
          t.style.opacity = "0";
          t.style.transform = "translate(-50%, -50%) scale(0.3)";
        });
        setTimeout(function () { t.remove(); }, 650);
      }
      lastX = e.clientX;
      lastY = e.clientY;
    }, { passive: true });
  }

  // Barre de progression, un tour de piste en défilant
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  var majProgress = function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    progress.style.width = pct + "%";
  };
  window.addEventListener("scroll", majProgress, { passive: true });
  majProgress();

  // Année courante dans le pied de page
  var year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Formulaire de contact (démo, sans serveur)
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var success = form.getAttribute("data-success");
      var note = form.querySelector(".form-note");
      if (note) {
        note.textContent = success;
      }
      form.reset();
    });
  }
})();
