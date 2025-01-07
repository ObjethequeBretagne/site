import fs from 'fs';
import fetch from 'node-fetch';

// Fonction pour rafraîchir le token
async function refreshToken(refreshToken) {
  const apiUrl = 'https://api.helloasso.com/oauth2/token';

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.HELLOASSO_CLIENT_ID,
    client_secret: process.env.HELLOASSO_CLIENT_SECRET,
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du rafraîchissement du token: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Nouveau token reçu:', data.access_token);
    return data;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    process.exit(1);
  }
}

// Fonction principale pour récupérer les événements
async function fetchEvents() {
  const apiUrl = 'https://api.helloasso.com/v5/organizations/l-objetheque-de-cornouaille/forms?states=Public&formTypes=Event&pageIndex=1&pageSize=20';
  let accessToken = process.env.HELLOASSO_ACCESS_TOKEN;
  const refreshTokenEnv = process.env.HELLOASSO_REFRESH_TOKEN;

  if (!accessToken || !refreshTokenEnv) {
    console.error('Les variables HELLOASSO_ACCESS_TOKEN et HELLOASSO_REFRESH_TOKEN doivent être définies.');
    process.exit(1);
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    });

    // Si le token est expiré
    if (response.status === 401) {
      console.log('Token expiré, tentative de rafraîchissement...');
      const newTokens = await refreshToken(refreshTokenEnv);
      accessToken = newTokens.access_token;

      // Relancer la requête avec le nouveau token
      const retryResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (!retryResponse.ok) {
        throw new Error(`Erreur API après rafraîchissement: ${retryResponse.statusText}`);
      }

      const data = await retryResponse.json();
      processEvents(data);
    } else if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    } else {
      const data = await response.json();
      processEvents(data);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    process.exit(1);
  }
}

// Fonction pour traiter et sauvegarder les événements
function processEvents(data) {
  // Vérifier si la réponse contient des événements
  if (!data.data || !Array.isArray(data.data)) {
    console.error('Aucun événement trouvé dans les données.');
    return;
  }

  const events = data.data.map(event => {
    const sanitizedDescription = event.description
      .replace(/'/g, "\\'") // Échapper les apostrophes
      .replace(/\n/g, '<br>'); // Remplacer les sauts de ligne par <br>
    // Définir des URLs par défaut si elles ne sont pas fournies
    const defaultLogoUrl = 'assets/img/logo.png';
    return {
      id: event.id,
      title: event.title,  // Titre de l'événement
      description: sanitizedDescription,  // Description
      startDate: event.startDate,  // Date de début
      endDate: event.endDate,  // Date de fin
      location: event.location,  // Localisation (si disponible)
      url: event.url,  // URL de l'événement
      bannerUrl: event.banner?.publicUrl || defaultLogoUrl,  // URL de la bannière
      logoUrl: event.logo?.publicUrl || defaultLogoUrl,  // URL du logo
    };
  });

  // Sauvegarde des données dans un fichier JSON
  fs.writeFileSync('public/events.json', JSON.stringify(events, null, 2));
  console.log('Les événements ont été mis à jour avec succès.');
}

// Exécute la fonction principale
fetchEvents();
