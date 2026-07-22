-- ============================================================================
-- Migration : ajoute les liens Facebook et WhatsApp aux paramètres du site.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Sans danger à ré-exécuter (IF NOT EXISTS) et ne touche à aucune donnée
-- existante.
-- ============================================================================

alter table public.settings
  add column if not exists facebook_url text,
  add column if not exists whatsapp_url text;
