document.addEventListener("astro:page-load", () => {
  /// Menu Mobile
  const checkbox = document.getElementById("hamburgerMenuToggle");
  const navWrapper = document.getElementById("navigationWrapper");

  // active les intéractions une fois le script chargé
  checkbox.disabled = false;

  // ferme le menu en cas de changement de page
  checkbox.checked = false;
  navWrapper?.classList.remove("active");

  // Fermer automatiquement le menu après avoir cliqué sur un lien
  document.querySelectorAll("#navigationWrapper .submenuMobile li, #nav-espace-bricolage-mobile").forEach((item) => {
    item.addEventListener("click", () => {
      checkbox.checked = false;
      navWrapper?.classList.remove("active");
    });
  });

  // Écouteur d'évènements attaché à "change" pour checkbox
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      navWrapper?.classList.add("active");
    } else {
      navWrapper?.classList.remove("active");
    }
  });

  const detailsElements = document.querySelectorAll("details");

  detailsElements.forEach((detailsElement) => {
    detailsElement.addEventListener("click", () => {
      detailsElements.forEach((otherDetailsElement) => {
        if (
          otherDetailsElement !== detailsElement &&
          otherDetailsElement.open
        ) {
          otherDetailsElement.removeAttribute("open");
        }
      });
    });
  });

  /// Menu Web
  document.querySelectorAll("#menuWeb > li").forEach((menuItem) => {
    let timeout;

    menuItem.addEventListener("mouseenter", () => {
      clearTimeout(timeout); // On annule la fermeture si la souris revient vite
      const submenu = menuItem.querySelector(".submenu");
      if (submenu) {
        submenu.style.opacity = "1";
        submenu.style.visibility = "visible";
        submenu.style.pointerEvents = "auto";
      }
    });

    menuItem.addEventListener("mouseleave", () => {
      timeout = setTimeout(() => {
        const submenu = menuItem.querySelector(".submenu");
        if (submenu) {
          submenu.style.opacity = "0";
          submenu.style.visibility = "hidden";
          submenu.style.pointerEvents = "none";
        }
      }, 100); // 🔥 Délai de 100ms avant fermeture
    });
  });
});

document.addEventListener("astro:after-swap", () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (window.location.hash) {
        const anchor = document.querySelector(window.location.hash);
        if (anchor) {
          anchor.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
});