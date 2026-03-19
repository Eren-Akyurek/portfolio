(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const nav = document.getElementById("site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const revealElements = document.querySelectorAll(".reveal");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 768px)").matches) {
        setNavOpen(false);
      }
    });
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 769px)").matches) {
      setNavOpen(false);
    }
  });

  function scrollToHash(hash, pushHistory) {
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;

    const headerHeight = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });

    if (pushHistory) {
      history.pushState(null, "", hash);
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      if (!document.querySelector(href)) return;
      e.preventDefault();
      scrollToHash(href, true);
    });
  });

  function setActiveNav() {
    if (!sections.length || !navLinks.length) return;

    const headerH = header ? header.offsetHeight : 0;
    const scrollPos = window.scrollY + headerH + 40;
    const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

    let currentId = sections[0].id;

    if (nearBottom) {
      currentId = sections[sections.length - 1].id;
    } else {
      sections.forEach(function (section) {
        if (scrollPos >= section.offsetTop) {
          currentId = section.id;
        }
      });
    }

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", href === "#" + currentId);
    });
  }

  let ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        setActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  window.addEventListener("load", setActiveNav);

  if ("IntersectionObserver" in window && revealElements.length) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      revealElements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
