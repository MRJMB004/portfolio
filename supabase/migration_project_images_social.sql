-- ============================================================================
-- Migration : images de projets (miniature + captures) + lien Twitter/X
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Sans danger à ré-exécuter (IF NOT EXISTS partout) et ne touche à aucune
-- donnée existante.
-- ============================================================================

-- Colonnes projets : une miniature (carte projet) + une liste de captures
-- d'écran (page détail projet).
alter table public.projects
  add column if not exists image_url text,
  add column if not exists screenshot_urls text[] default '{}';

-- Lien Twitter / X pour la section Accueil et le footer.
alter table public.settings
  add column if not exists twitter_url text;

-- Le bucket "media" existe déjà (photo de profil) et est déjà public en
-- lecture avec écriture réservée aux comptes authentifiés : il sert aussi
-- pour les images de projets, aucune policy supplémentaire n'est nécessaire.
