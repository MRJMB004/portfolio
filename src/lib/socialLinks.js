// ----------------------------------------------------------------------------
// Normalise les liens sociaux saisis dans l'admin.
//
// Bug corrigé : si un lien est enregistré sans "http(s)://" (ex: "github.com/x"
// ou "linkedin.com/in/x"), le navigateur le traite comme une URL RELATIVE au
// site. Un clic ouvre alors "https://tondomaine.com/github.com/x", une route
// qui n'existe pas dans React Router → page 404 du site (au lieu d'ouvrir
// GitHub/LinkedIn dans un nouvel onglet).
//
// normalizeUrl() force un préfixe "https://" sur tout lien externe qui n'en a
// pas déjà un (http://, https://, mailto:, tel:), afin que ces liens quittent
// toujours le site au lieu d'être interprétés comme une route interne.
// ----------------------------------------------------------------------------
export function normalizeUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

// Construit un lien wa.me à partir d'un numéro de téléphone (ou accepte déjà
// une URL complète de type "https://wa.me/..." si l'utilisateur la colle
// directement dans le champ).
export function buildWhatsAppUrl(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/[^0-9]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export function isExternalHref(href) {
  return !!href && !href.startsWith("mailto:") && !href.startsWith("tel:");
}
