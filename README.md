# Portfolio React — JeanMichel

Portfolio personnel moderne, responsive et animé, construit avec React + Vite + Tailwind CSS,
avec un **contenu piloté par Supabase** et un **espace d'administration** pour tout modifier
sans toucher au code.

## ✨ Fonctionnalités

- Thème sombre par défaut avec bascule clair/sombre
- **Bilingue FR / EN** (react-i18next) avec sélecteur 🇫🇷 / 🇬🇧 dans la navbar
- Animations au scroll, effet machine à écrire, particules flottantes, barres de compétences animées
- **Contenu dynamique via Supabase** (projets, compétences, expériences, services, réglages) —
  éditable depuis `/admin`, avec repli automatique sur `src/data/*.js` si Supabase n'est pas configuré
- **Espace admin (`/admin`)** protégé par Supabase Auth : Dashboard, Projets, Compétences,
  Expériences, Services, Messages, CV, Paramètres
- **Formulaire de contact** : notification e-mail (via `api/contact.js` + Resend) **et**
  enregistrement en base (consultable dans `/admin/messages`)
- **Statistiques GitHub en direct** (dépôts, followers, étoiles, langages) via l'API publique GitHub
- **SEO** : balises Open Graph / Twitter Card par page, `sitemap.xml` généré automatiquement au
  build, `robots.txt`, titres dynamiques par page projet
- **Performance** : sections sous la ligne de flottaison chargées en lazy (code-splitting),
  polices préchargées (`preconnect` + `preload`)
- 100% responsive (mobile / tablette / desktop)

## 🚀 Démarrage

```bash
npm install
cp .env.example .env   # puis renseigne tes identifiants Supabase (optionnel, voir ci-dessous)
npm run dev
```

Build de production :

```bash
npm run build   # génère aussi public/sitemap.xml automatiquement
npm run preview
```

> ℹ️ En développement local avec `npm run dev`, le formulaire de contact affichera une erreur
> pour la partie e-mail car `/api/contact` (fonction serverless Vercel) n'est pas servi par Vite.
> Pour tester l'API en local, utilise `vercel dev` ou déploie directement sur Vercel.
> L'enregistrement en base (Supabase) fonctionne, lui, dès que `.env` est renseigné.

## 🗄️ Configurer Supabase (contenu dynamique + admin)

Le site fonctionne **sans Supabase** (il utilise alors les données statiques de `src/data/`),
mais l'espace `/admin` nécessite un projet Supabase.

1. Crée un projet sur [supabase.com](https://supabase.com) (gratuit)
2. Va dans **SQL Editor → New query**, colle le contenu de `supabase/schema.sql`, puis **Run**.
   Cela crée toutes les tables, les policies de sécurité (RLS), le bucket de stockage pour le
   CV, et pré-remplit le contenu avec tes données actuelles (reprises de `src/data/`).
3. Récupère tes clés dans **Project Settings → API** et remplis ton `.env` :
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
4. Crée ton compte admin dans **Authentication → Users → Add user** (email + mot de passe).
   C'est ce compte qui te permettra de te connecter sur `/admin/login`.
5. Redémarre `npm run dev` (ou redéploie) — le site lit maintenant Supabase, et `/admin` est actif.

**Important** : `/admin` n'a *pas* de lien d'inscription — seul un compte créé manuellement
dans Supabase (étape 4) peut s'y connecter.

## 🛠 Espace admin (`/admin`)

| Page | Ce que tu peux faire |
|---|---|
| Dashboard | Vue d'ensemble (nombre de projets, compétences, messages non lus) |
| Projets | Créer / modifier / supprimer les projets affichés sur le site |
| Compétences | Gérer les catégories et le niveau (%) de chaque compétence |
| Expériences | Parcours professionnel + lignes de formation |
| Services | Services proposés + chiffres clés de la section "À propos" |
| Messages | Consulter les messages du formulaire de contact, marquer lu/non lu, supprimer |
| CV | Remplacer le PDF affiché/téléchargeable sur le site (stocké dans Supabase Storage) |
| Paramètres | Email/téléphone/localisation affichés en section Contact, liens sociaux |

Toute modification est **immédiatement visible sur le site public**, sans rebuild ni redéploiement.

## 🌍 Internationalisation

Les textes d'interface (navigation, titres de sections, formulaire, footer) sont traduits en
français et anglais via `react-i18next` (`src/i18n/locales/fr.json` et `en.json`). Le contenu
saisi depuis l'admin (titres de projets, descriptions, etc.) reste en une seule langue à la
fois — si tu veux du contenu bilingue projet par projet, il faudrait ajouter des colonnes
`title_en`, `description_en`, etc. dans Supabase ; dis-le-moi si tu veux que je l'ajoute.

## 🛠 Stack

- React 19 + Vite + React Router
- Tailwind CSS
- react-icons
- Supabase (PostgreSQL + Auth + Storage) pour le contenu et l'admin
- react-i18next pour le FR/EN
- Fonction serverless Vercel pour la notification e-mail du contact (Node.js)

## 📁 Structure

- `src/components/` — un dossier par composant du site public
- `src/admin/` — espace d'administration (auth, layout, pages CRUD)
- `src/hooks/useContent.js` — hooks de lecture Supabase avec repli sur `src/data/*.js`
- `src/data/` — contenu statique de secours (utilisé si Supabase n'est pas configuré)
- `src/i18n/` — configuration et traductions FR/EN
- `src/pages/` — `Home`, `ProjectDetail`, `NotFound`
- `src/components/Seo.jsx` — balises meta/OG par page
- `supabase/schema.sql` — schéma complet à exécuter dans Supabase
- `scripts/generate-sitemap.mjs` — génère `public/sitemap.xml` au build
- `api/contact.js` — endpoint serverless pour la notification e-mail du formulaire de contact

## ✏️ Personnalisation

- Contenu par défaut (utilisé sans Supabase) : `src/data/*.js`
- Contenu réel une fois Supabase configuré : directement depuis `/admin`
- Couleurs et thème : `tailwind.config.js`
- Nom d'utilisateur GitHub pour les statistiques : `src/components/GithubStats/GithubStats.jsx`
  (constante `GITHUB_USERNAME`)
- Domaine du site (pour le SEO et le sitemap) : `src/components/Seo.jsx` (constante `SITE_URL`)
  et `public/robots.txt`
- Photo de profil : remplacer le bloc initiales dans `Hero.jsx` / `About.jsx` par une balise
  `<img loading="lazy">` pointant vers `public/images/profile.png`

## 📬 Configurer les notifications e-mail du formulaire de contact

Le formulaire envoie chaque message à deux endroits : Supabase (table `messages`, visible dans
`/admin/messages`) et `api/contact.js` (notification e-mail). Sans configuration, l'e-mail est
simplement journalisé dans les logs Vercel.

Pour recevoir une vraie notification par e-mail :

1. Crée un compte gratuit sur [resend.com](https://resend.com) et récupère une clé API
2. Dans **Vercel → Project Settings → Environment Variables**, ajoute :
   - `RESEND_API_KEY` — ta clé API Resend
   - `CONTACT_TO_EMAIL` — l'adresse qui doit recevoir les messages (la tienne)
   - `CONTACT_FROM` *(optionnel)* — adresse d'expédition vérifiée dans Resend
3. Redéploie

## ☁️ Déploiement sur Vercel

```bash
npm install -g vercel
vercel        # premier déploiement
vercel --prod # mises à jour
```

N'oublie pas d'ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans les variables
d'environnement Vercel (en plus de `RESEND_API_KEY` / `CONTACT_TO_EMAIL` si utilisées) pour que
le contenu dynamique et l'admin fonctionnent en production.

`vercel.json` est déjà configuré pour que les routes React Router (`/project/...`, `/admin/...`)
fonctionnent correctement en production, et pour laisser passer `/api/*` vers la fonction
serverless.
