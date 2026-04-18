(function () {
  "use strict";

  var nav = document.querySelector(".site-nav");
  var navToggle = document.querySelector(".nav-toggle");
  var dropdownItems = Array.prototype.slice.call(document.querySelectorAll(".nav-item.dropdown"));
  var currentYear = document.getElementById("current-year");
  var isMobile = window.matchMedia("(max-width: 768px)");

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  function setNavOpen(open) {
    if (!nav || !navToggle) {
      return;
    }

    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }

  function closeAllDropdowns(exceptItem) {
    dropdownItems.forEach(function (item) {
      var button = item.querySelector(".dropdown-toggle");
      var shouldStayOpen = exceptItem && item === exceptItem;
      item.classList.toggle("is-open", !!shouldStayOpen);
      if (button) {
        button.setAttribute("aria-expanded", shouldStayOpen ? "true" : "false");
      }
    });
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      if (isOpen) {
        closeAllDropdowns();
      }
      setNavOpen(!isOpen);
    });
  }

  dropdownItems.forEach(function (item) {
    var button = item.querySelector(".dropdown-toggle");
    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      if (!isMobile.matches) {
        return;
      }

      var willOpen = !item.classList.contains("is-open");
      closeAllDropdowns(willOpen ? item : null);
      button.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  document.addEventListener("click", function (event) {
    if (!nav) {
      return;
    }

    var insideNav = event.target.closest(".site-header");
    if (!insideNav) {
      setNavOpen(false);
      closeAllDropdowns();
    }
  });

  document.querySelectorAll(".site-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (isMobile.matches) {
        setNavOpen(false);
        closeAllDropdowns();
      }
    });
  });

  window.addEventListener("resize", function () {
    if (!isMobile.matches) {
      setNavOpen(false);
      closeAllDropdowns();
    }
  });

  var currentPath = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".site-nav a[href]").forEach(function (link) {
    var linkPath = link.getAttribute("href");
    if (!linkPath || linkPath.charAt(0) === "#") {
      return;
    }

    if (linkPath === currentPath) {
      link.classList.add("is-active");
      var parentDropdown = link.closest(".nav-item.dropdown");
      if (parentDropdown) {
        parentDropdown.classList.add("is-current");
      }
    }
  });
})();
