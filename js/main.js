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

  // Parallaxe légère sur l'image immersive
  var parallaxImg = document.querySelector("[data-parallax]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (parallaxImg && !reduceMotion) {
    var ticking = false;
    var updateParallax = function () {
      var rect = parallaxImg.parentElement.getBoundingClientRect();
      var progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      parallaxImg.style.transform = "translateY(" + (progress * -60).toFixed(1) + "px)";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
    updateParallax();
  }

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
