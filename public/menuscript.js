document.addEventListener('astro:page-load', () => {
  const checkbox = document.getElementById(
    "hamburgerMenuToggle"
  );
  const navWrapper = document.getElementById("navigationWrapper");

  checkbox.disabled = false;

  // Fermer automatiquement le menu après avoir cliqué sur un lien
  document
          .querySelectorAll("#navigationWrapper ul li")
          .forEach((item) => {
            item.addEventListener("click", () => {
              checkbox.checked = false;
              navWrapper?.classList.remove("active");
            });
          });

        // ferme le menu en cas de rafraichissement de la page
        window.addEventListener("beforeunload", (event) => {
          checkbox.checked = false;
          navWrapper?.classList.remove("active");
        });

        // Écouteur d'évènements attaché à "change" pour checkbox
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            navWrapper?.classList.add("active");
          } else {
            navWrapper?.classList.remove("active");
          }
        });
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