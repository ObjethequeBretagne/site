document.addEventListener("astro:page-load", () => {
  const checkbox = document.getElementById("hamburgerMenuToggle");
  const navWrapper = document.getElementById("navigationWrapper");

  // active les intéractions une fois le script chargé
  checkbox.disabled = false;

  // ferme le menu en cas de changement de page
  checkbox.checked = false;
  navWrapper?.classList.remove("active");

  // Fermer automatiquement le menu après avoir cliqué sur un lien
  document.querySelectorAll("#navigationWrapper ul li").forEach((item) => {
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
});

document.addEventListener("astro:after-swap", () => {
  setTimeout(() => {
    if (window.location.hash) {
      const anchor = document.querySelector(window.location.hash);
      if (anchor) {
        anchor.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, 100); // Temps d’attente avant d’exécuter le scroll
});
