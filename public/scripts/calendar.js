const monthTitle = document.getElementById("month-title");
const calendarGrid = document.getElementById("calendar-grid");
let currentMonth = new Date().getMonth(); // Mois actuel
let currentYear = new Date().getFullYear();

// Fonction pour naviguer entre les mois
function navigateMonth(direction) {
  console.log("navigateMonth appelé avec direction :", direction);
  currentMonth += direction;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateCalendar();
}

// Expose la fonction à l'objet global
window.navigateMonth = navigateMonth;

// Charger les événements depuis le fichier JSON
async function loadEvents() {
  try {
    const response = await fetch("/public/events.json");
    const data = await response.json();
    console.log("Événements chargés :", data); // Vérifie dans la console
    return data;
  } catch (error) {
    console.error("Erreur de chargement des événements :", error);
  }
}

// Fonction pour afficher le calendrier
function updateCalendar() {
  calendarGrid.innerHTML = ""; // Nettoie l'ancien contenu du calendrier
  const firstDayOfMonth =
    (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Ajuste pour commencer la semaine le lundi
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Nombre de jours dans le mois

  loadEvents().then((events) => {
    // Ajouter des cases vides pour les jours avant le début du mois
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarGrid.innerHTML += `<div></div>`;
    }

    // Remplir les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      // Vérifier si un événement commence ce jour-là
      const event = events.find((event) => {
        // Extraire la date (partie avant l'heure) de startDate
        const eventStartDate = new Date(event.startDate)
          .toISOString()
          .split("T")[0]; // Extrait la date au format YYYY-MM-DD
        return eventStartDate === dateStr; // Comparer uniquement les dates
      });

      if (event) {
        const sanitizedTitle = event.title.replace(/'/g, "\\'");
        calendarGrid.innerHTML += `
        <div 
          style="background:yellow; font-weight:bold; cursor:pointer; text-align: center;
          padding: 0.4rem; margin:0.1rem; border-radius:90px"
          @click="modalOpen = true; modalTitle = '${sanitizedTitle}'; modalDescription = '${event.description}'; modalUrl = '${event.url}'; modalImage = '${event.logoUrl}'"
        >
          ${day}
        </div>`;
      } else {
        calendarGrid.innerHTML += `<div style="padding: 0.5rem;">${day}</div>`;
      }
    }
  });

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  monthTitle.innerHTML = `${months[currentMonth]} ${currentYear}`;
}

// Initialiser le calendrier
updateCalendar();
