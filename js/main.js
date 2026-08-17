/* Pista Studio — interactions légères */

(function () {
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
