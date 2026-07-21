-- ============================================================================
-- Schéma Supabase pour le portfolio
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================================

-- Extension utile pour générer des UUID
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1) PROJECTS
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  description text,
  full_description text,
  tech text[] default '{}',
  architecture text,
  highlights text[] default '{}',
  screenshots int default 0,
  github text,
  demo text,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 2) SKILL CATEGORIES + SKILLS
-- ----------------------------------------------------------------------------
create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  position int default 0
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.skill_categories (id) on delete cascade,
  name text not null,
  level int check (level >= 0 and level <= 100) default 50,
  icon text,
  position int default 0
);

-- ----------------------------------------------------------------------------
-- 3) EXPERIENCE + EDUCATION
-- ----------------------------------------------------------------------------
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  description text,
  position int default 0
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  position int default 0
);

-- ----------------------------------------------------------------------------
-- 4) SERVICES + STATS
-- ----------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  position int default 0
);

create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  position int default 0
);

-- ----------------------------------------------------------------------------
-- 5) MESSAGES (formulaire de contact)
-- ----------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 6) SETTINGS (ligne unique — infos globales du site)
-- ----------------------------------------------------------------------------
create table if not exists public.settings (
  id int primary key default 1,
  site_name text default 'Setra',
  tagline text default 'Développeur Full-Stack',
  contact_email text,
  contact_phone text,
  location text,
  github_url text,
  linkedin_url text,
  cv_url text,
  avatar_url text,
  updated_at timestamptz default now(),
  constraint singleton check (id = 1)
);

insert into public.settings (id) values (1)
  on conflict (id) do nothing;

-- ============================================================================
-- ROW LEVEL SECURITY
-- Règle générale : lecture publique sur le contenu du site, écriture réservée
-- aux utilisateurs authentifiés (= toi, connecté sur /admin).
-- Les messages sont l'inverse : n'importe qui peut en CRÉER un (formulaire de
-- contact) mais seul un compte authentifié peut les lire / modifier / supprimer.
-- ============================================================================

alter table public.projects enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.experience enable row level security;
alter table public.education enable row level security;
alter table public.services enable row level security;
alter table public.stats enable row level security;
alter table public.messages enable row level security;
alter table public.settings enable row level security;

-- Lecture publique (site vitrine)
create policy "public read projects" on public.projects for select using (true);
create policy "public read skill_categories" on public.skill_categories for select using (true);
create policy "public read skills" on public.skills for select using (true);
create policy "public read experience" on public.experience for select using (true);
create policy "public read education" on public.education for select using (true);
create policy "public read services" on public.services for select using (true);
create policy "public read stats" on public.stats for select using (true);
create policy "public read settings" on public.settings for select using (true);

-- Écriture réservée aux utilisateurs connectés (admin)
create policy "auth write projects" on public.projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write skill_categories" on public.skill_categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write skills" on public.skills for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write experience" on public.experience for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write education" on public.education for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write services" on public.services for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write stats" on public.stats for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write settings" on public.settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Messages : tout le monde peut insérer (formulaire public), seul un compte
-- connecté peut lire / mettre à jour (marquer lu) / supprimer.
create policy "public insert messages" on public.messages for insert with check (true);
create policy "auth read messages" on public.messages for select
  using (auth.role() = 'authenticated');
create policy "auth update messages" on public.messages for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth delete messages" on public.messages for delete
  using (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE — bucket public pour le CV (PDF)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('cv', 'cv', true)
on conflict (id) do nothing;

create policy "public read cv bucket" on storage.objects for select
  using (bucket_id = 'cv');
create policy "auth write cv bucket" on storage.objects for insert
  with check (bucket_id = 'cv' and auth.role() = 'authenticated');
create policy "auth update cv bucket" on storage.objects for update
  using (bucket_id = 'cv' and auth.role() = 'authenticated');
create policy "auth delete cv bucket" on storage.objects for delete
  using (bucket_id = 'cv' and auth.role() = 'authenticated');

-- Bucket public pour la photo de profil et d'éventuelles images de projet
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media bucket" on storage.objects for select
  using (bucket_id = 'media');
create policy "auth write media bucket" on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "auth update media bucket" on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "auth delete media bucket" on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

-- ============================================================================
-- DONNÉES DE DÉPART (reprises de src/data/*.js) — à adapter/éditer ensuite
-- directement depuis /admin.
-- ============================================================================

insert into public.projects (slug, title, category, description, full_description, tech, architecture, highlights, screenshots, github, demo, position) values
('gestion-chanteur', 'GestionChanteur', 'Application Android',
 'Application Android de gestion des chanteurs, albums et évènements, avec opérations CRUD complètes sur SQLite.',
 'GestionChanteur est une application Android native pensée pour aider un label ou un organisateur d''évènements à centraliser les informations sur des chanteurs, leurs albums et leurs évènements. L''application couvre l''intégralité du cycle CRUD (création, lecture, mise à jour, suppression) avec une base de données SQLite embarquée, et une interface conforme aux directives Material Design 3.',
 array['Java','Android SDK','SQLite','Material Design 3'],
 'Architecture Android classique en couches : Activities/Fragments pour l''UI, une couche DAO pour l''accès à SQLite (SQLiteOpenHelper), et des modèles POJO pour représenter chanteurs, albums et évènements. La navigation utilise des Intents et le pattern Adapter pour les listes (RecyclerView).',
 array['CRUD complet sur chanteurs, albums et évènements','Gestion des transitions et setup émulateur/appareil physique','Interface Material Design 3, thème cohérent'],
 3, 'https://github.com/', null, 0),
('etat-civil', 'État Civil', 'Système Web',
 'Système de registre d''état civil pour Madagascar (actes de naissance et de décès), avec API REST complète et données géographiques malgaches.',
 'Système de gestion de l''état civil conçu pour le contexte malgache : enregistrement des actes de naissance et de décès, avec des seeders reprenant la découpe géographique réelle de Madagascar (régions, districts, communes). Le backend Laravel expose une API REST complète consommée par un frontend React. Ce projet a fait l''objet d''un rapport de stage détaillé.',
 array['Laravel 10','React','REST API','MySQL'],
 'Backend Laravel 10 organisé en Controllers / Models / Requests avec migrations et seeders dédiés aux données géographiques malgaches. Le frontend React consomme l''API REST via des services HTTP dédiés, avec une séparation claire entre les vues de saisie (actes de naissance / décès) et les vues de consultation.',
 array['API REST complète pour les actes de naissance et de décès','Seeders avec la géographie administrative de Madagascar','Rapport de stage rédigé sur ce système'],
 3, 'https://github.com/', null, 1),
('coop-transport', 'CoopTransport', 'Application Web',
 'Application de réservation pour coopérative de transport : gestion des sièges, reçus de réservation, mode sombre/clair et notifications toast.',
 'Application web Java pour la gestion des réservations au sein d''une coopérative de transport. Elle permet la gestion des sièges par véhicule (avec transactions SQL pour éviter les doubles réservations), la génération de reçus consolidés, et propose une expérience utilisateur soignée avec bascule thème sombre/clair et notifications toast.',
 array['Java','JSP / Servlet','SQL'],
 'Architecture Java EE classique : Servlets pour la logique de contrôle, JSP pour le rendu des vues, et accès aux données via JDBC avec des transactions SQL pour garantir la cohérence de la gestion des sièges. Un module antérieur (''Reservation'') gérait déjà la génération de reçus PDF via iText.',
 array['Gestion des sièges par transactions SQL','Reçus de réservation consolidés','Mode sombre/clair et notifications toast'],
 3, 'https://github.com/', null, 2),
('gestion-salaire', 'Gestion Salaire', 'Application Full-Stack',
 'Application multi-rôles de gestion de salaires pour un contexte d''entreprise malgache (Ariary), avec portail employé et accès par rôle.',
 'Application full-stack de gestion des salaires, développée en deux versions (Node.js/Express + React, puis Python Django + DRF), pensée pour un contexte d''entreprise malgache avec la devise Ariary. Elle propose un accès par rôle (admin, RH, comptable, directeur), un portail libre-service pour les employés, un mode sombre/clair et un changement de langue français/anglais.',
 array['React','Node.js','Express','Django REST Framework'],
 'Deux implémentations backend interchangeables partageant le même frontend React : une API Node.js/Express et une API Django REST Framework. Authentification par rôle avec middleware de contrôle d''accès, et logique de liaison de compte avec validation RH.',
 array['Deux backends interchangeables (Express / Django REST)','Accès par rôle : admin, RH, comptable, directeur','Portail libre-service employé, FR/EN, mode sombre/clair'],
 3, 'https://github.com/', null, 3)
on conflict (slug) do nothing;

-- Compétences
with cat as (
  insert into public.skill_categories (label, position) values ('Front-end', 0) returning id
)
insert into public.skills (category_id, name, level, icon, position)
select id, name, level, icon, position from cat, (values
  ('HTML / CSS', 90, 'html', 0),
  ('JavaScript', 88, 'js', 1),
  ('React', 85, 'react', 2),
  ('Tailwind CSS', 82, 'tailwind', 3)
) as s(name, level, icon, position);

with cat as (
  insert into public.skill_categories (label, position) values ('Back-end', 1) returning id
)
insert into public.skills (category_id, name, level, icon, position)
select id, name, level, icon, position from cat, (values
  ('Node.js / Express', 80, 'node', 0),
  ('Java', 85, 'java', 1),
  ('Python / Django', 75, 'python', 2),
  ('Laravel (PHP)', 78, 'laravel', 3)
) as s(name, level, icon, position);

with cat as (
  insert into public.skill_categories (label, position) values ('Mobile', 2) returning id
)
insert into public.skills (category_id, name, level, icon, position)
select id, name, level, icon, position from cat, (values
  ('Java Android', 83, 'android', 0),
  ('React Native / Expo', 72, 'react', 1)
) as s(name, level, icon, position);

with cat as (
  insert into public.skill_categories (label, position) values ('Base de données', 3) returning id
)
insert into public.skills (category_id, name, level, icon, position)
select id, name, level, icon, position from cat, (values
  ('MySQL', 80, 'mysql', 0),
  ('SQLite', 82, 'sqlite', 1),
  ('PostgreSQL', 65, 'postgres', 2)
) as s(name, level, icon, position);

with cat as (
  insert into public.skill_categories (label, position) values ('Outils', 4) returning id
)
insert into public.skills (category_id, name, level, icon, position)
select id, name, level, icon, position from cat, (values
  ('Git & GitHub', 85, 'git', 0),
  ('VS Code', 90, 'vscode', 1),
  ('Android Studio', 80, 'androidstudio', 2),
  ('WAMP / phpMyAdmin', 78, 'wamp', 3)
) as s(name, level, icon, position);

-- Expérience + Éducation
insert into public.experience (year, title, description, position) values
('2024 — Présent', 'Développeur Full-Stack', 'Conception d''applications web et mobiles : Laravel + React, Node.js + Express, et applications Android en Java.', 0),
('2023 — 2024', 'Projets Académiques', 'Développement de solutions logicielles dans le cadre de projets universitaires (systèmes de gestion, applications métier).', 1),
('2022 — 2023', 'Apprentissage & Bases', 'Apprentissage du développement web, mobile et des bases de données via des projets pratiques.', 2);

insert into public.education (label, position) values
('Étudiant en développement informatique', 0),
('Auto-formation continue en développement web et mobile', 1),
('Projets pratiques en environnement académique', 2);

-- Services + Stats
insert into public.services (title, description, icon, position) values
('Développement Web', 'Sites et applications web sur mesure avec React, Laravel ou Node.js/Express.', 'code', 0),
('Développement Android', 'Applications mobiles natives en Java, avec bases de données SQLite intégrées.', 'phone', 1),
('Bases de données', 'Conception et intégration de bases de données MySQL, SQLite et PostgreSQL.', 'database', 2),
('Maintenance & Support', 'Corrections de bugs, améliorations UI et évolutions de fonctionnalités existantes.', 'tool', 3);

insert into public.stats (value, label, position) values
('4+', 'Projets réalisés', 0),
('2+', 'Ans d''apprentissage', 1),
('5+', 'Technologies maîtrisées', 2),
('100%', 'Motivation', 3);
