# 🔄 Objethèque de Cornouaille - Site Web

Ce dépôt contient le code source du site web de l'Objethèque de Cornouaille, une bibliothèque d'objets à Quimper permettant aux adhérents d'emprunter des objets plutôt que de les acheter.

[![Site Objethèque de Cornouaille](https://img.shields.io/badge/Site-objethequecornouaille.fr-orange)](https://objethequecornouaille.fr)
[![Construit avec Astro](https://img.shields.io/badge/Construit_avec-Astro-ff5e00)](https://astro.build)
![License](https://img.shields.io/badge/Licence-Hippocrate-blue)

## 📋 À propos du projet

L'Objethèque de Cornouaille est une association qui offre un service de prêt d'objets aux adhérents. Ce site web permet de présenter l'association, ses valeurs, les modalités d'adhésion et de prêt, ainsi que l'accès au catalogue des objets disponibles.

Le slogan de l'Objethèque : **"Emprunte sans limite... Et limite ton empreinte !"**

## 🛠️ Technologies utilisées

- [Astro](https://astro.build/) - Framework pour créer des sites web performants
- HTML/CSS/JavaScript
- GitHub Actions pour le déploiement automatique
- API HelloAsso pour les événements

## 🚀 Structure du projet

```
/
├── .github/workflows/     # GitHub Actions pour déploiement et mise à jour des événements
├── public/                # Ressources statiques (images, scripts, etc.)
├── src/
│   ├── assets/           # Images et ressources
│   ├── components/       # Composants Astro réutilisables
│   ├── layouts/          # Gabarits de page
│   └── pages/            # Pages du site
├── fetch-events.js       # Script pour récupérer les événements depuis HelloAsso
└── astro.config.mjs      # Configuration Astro
```

## ⚙️ Installation et lancement

Pour développer en local :

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser le build
npm run preview
```

Le site sera accessible à l'adresse : `http://localhost:4321`

## 🔄 Fonctionnalités principales

- Présentation de l'association et de ses valeurs
- Modalités d'adhésion (particuliers et structures)
- Accès au catalogue d'objets (via myTurn)
- Agenda des événements à venir (synchronisé avec HelloAsso)
- Procédure de don d'objets
- Formulaire de contact
- Page bénévoles

## 🤝 Contribution

1. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
2. Effectuez vos modifications
3. Validez vos changements (`git commit -m 'Ajout de nouvelle-fonctionnalite'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créez une Pull Request

## 📦 Déploiement

Le site est automatiquement déployé sur GitHub Pages via GitHub Actions lorsque des modifications sont poussées sur la branche `astro-version`.

## 📅 Mises à jour automatisées

Le site utilise GitHub Actions pour:
- Récupérer quotidiennement les événements depuis HelloAsso
- Rafraîchir les tokens d'accès à l'API HelloAsso

## 📄 Licence

Ce projet est sous licence Hippocrate.

## 📞 Contact

- Email: objethequecornouaille@gmail.com
- [Facebook](https://www.facebook.com/ObjethequeCornouaille)

---

Développé avec ♻️ pour un monde plus durable - L'Objethèque de Cornouaille 2025