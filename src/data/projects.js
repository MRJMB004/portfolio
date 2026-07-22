export const projects = [
  {
    slug: "gestion-chanteur",
    title: "GestionChanteur",
    category: "Application Android",
    description:
      "Application Android de gestion des chanteurs, albums et évènements, avec opérations CRUD complètes sur SQLite.",
    fullDescription:
      "GestionChanteur est une application Android native pensée pour aider un label ou un organisateur d'évènements à centraliser les informations sur des chanteurs, leurs albums et leurs évènements. L'application couvre l'intégralité du cycle CRUD (création, lecture, mise à jour, suppression) avec une base de données SQLite embarquée, et une interface conforme aux directives Material Design 3.",
    tech: ["Java", "Android SDK", "SQLite", "Material Design 3"],
    architecture:
      "Architecture Android classique en couches : Activities/Fragments pour l'UI, une couche DAO pour l'accès à SQLite (SQLiteOpenHelper), et des modèles POJO pour représenter chanteurs, albums et évènements. La navigation utilise des Intents et le pattern Adapter pour les listes (RecyclerView).",
    highlights: [
      "CRUD complet sur chanteurs, albums et évènements",
      "Gestion des transitions et setup émulateur/appareil physique",
      "Interface Material Design 3, thème cohérent",
    ],
    image_url: null,
    screenshot_urls: [],
    github: "https://github.com/",
    demo: null,
  },
  {
    slug: "etat-civil",
    title: "État Civil",
    category: "Système Web",
    description:
      "Système de registre d'état civil pour Madagascar (actes de naissance et de décès), avec API REST complète et données géographiques malgaches.",
    fullDescription:
      "Système de gestion de l'état civil conçu pour le contexte malgache : enregistrement des actes de naissance et de décès, avec des seeders reprenant la découpe géographique réelle de Madagascar (régions, districts, communes). Le backend Laravel expose une API REST complète consommée par un frontend React. Ce projet a fait l'objet d'un rapport de stage détaillé.",
    tech: ["Laravel 10", "React", "REST API", "MySQL"],
    architecture:
      "Backend Laravel 10 organisé en Controllers / Models / Requests avec migrations et seeders dédiés aux données géographiques malgaches. Le frontend React consomme l'API REST via des services HTTP dédiés, avec une séparation claire entre les vues de saisie (actes de naissance / décès) et les vues de consultation.",
    highlights: [
      "API REST complète pour les actes de naissance et de décès",
      "Seeders avec la géographie administrative de Madagascar",
      "Rapport de stage rédigé sur ce système",
    ],
    image_url: null,
    screenshot_urls: [],
    github: "https://github.com/",
    demo: null,
  },
  {
    slug: "coop-transport",
    title: "CoopTransport",
    category: "Application Web",
    description:
      "Application de réservation pour coopérative de transport : gestion des sièges, reçus de réservation, mode sombre/clair et notifications toast.",
    fullDescription:
      "Application web Java pour la gestion des réservations au sein d'une coopérative de transport. Elle permet la gestion des sièges par véhicule (avec transactions SQL pour éviter les doubles réservations), la génération de reçus consolidés, et propose une expérience utilisateur soignée avec bascule thème sombre/clair et notifications toast.",
    tech: ["Java", "JSP / Servlet", "SQL"],
    architecture:
      "Architecture Java EE classique : Servlets pour la logique de contrôle, JSP pour le rendu des vues, et accès aux données via JDBC avec des transactions SQL pour garantir la cohérence de la gestion des sièges. Un module antérieur ('Reservation') gérait déjà la génération de reçus PDF via iText.",
    highlights: [
      "Gestion des sièges par transactions SQL",
      "Reçus de réservation consolidés",
      "Mode sombre/clair et notifications toast",
    ],
    image_url: null,
    screenshot_urls: [],
    github: "https://github.com/",
    demo: null,
  },
  {
    slug: "gestion-salaire",
    title: "Gestion Salaire",
    category: "Application Full-Stack",
    description:
      "Application multi-rôles de gestion de salaires pour un contexte d'entreprise malgache (Ariary), avec portail employé et accès par rôle.",
    fullDescription:
      "Application full-stack de gestion des salaires, développée en deux versions (Node.js/Express + React, puis Python Django + DRF), pensée pour un contexte d'entreprise malgache avec la devise Ariary. Elle propose un accès par rôle (admin, RH, comptable, directeur), un portail libre-service pour les employés, un mode sombre/clair et un changement de langue français/anglais.",
    tech: ["React", "Node.js", "Express", "Django REST Framework"],
    architecture:
      "Deux implémentations backend interchangeables partageant le même frontend React : une API Node.js/Express et une API Django REST Framework. Authentification par rôle avec middleware de contrôle d'accès, et logique de liaison de compte avec validation RH.",
    highlights: [
      "Deux backends interchangeables (Express / Django REST)",
      "Accès par rôle : admin, RH, comptable, directeur",
      "Portail libre-service employé, FR/EN, mode sombre/clair",
    ],
    image_url: null,
    screenshot_urls: [],
    github: "https://github.com/",
    demo: null,
  },
];

export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug);
