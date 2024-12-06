import fs from 'fs';
import fetch from 'node-fetch';


// Fonction principale
async function fetchEvents() {
  try {
    // URL de l'API HelloAsso pour récupérer les événements (exemple, ajustez selon vos besoins)
    const apiUrl = 'https://api.helloasso.com/v5/organizations/589413bd13da4d1bb512160e83b7178d/forms?states=Public&formTypes=Event&pageIndex=1&pageSize=20';
    const apiKey = process.env.HELLOASSO_API_KEY;
    console.log(`Clé API utilisée : "${apiKey}"`);

    if (!apiKey) {
      throw new Error('La clé API n’est pas définie. Assurez-vous que HELLOASSO_API_KEY est configurée.');
    }

    // Requête API (ajustez les headers si nécessaire)
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`, // Remplacez par votre clé API
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    // Récupération des données
    const data = await response.json();

    // Formatage des données (extrait uniquement ce qui est nécessaire)
    const events = data.data.map(event => ({
      id: event.id,
      name: event.name,
      date: event.startDate,
      location: event.location,
      description: event.description,
      url: event.url,
    }));

    // Sauvegarde des données dans un fichier JSON
    fs.writeFileSync('public/events.json', JSON.stringify(events, null, 2));
    console.log('Les événements ont été mis à jour avec succès.');

  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    process.exit(1); // Code d'erreur pour signaler l'échec
  }
}

// Exécute la fonction
fetchEvents();
