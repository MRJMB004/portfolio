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

// ----------------------------------------------------------------------------
// Bug corrigé : quand on saisissait juste un identifiant dans le champ
// Facebook ou Twitter/X (ex: "mrjmb004", sans "facebook.com/" ni "https://"),
// normalizeUrl() le transformait en "https://mrjmb004" — un nom de domaine qui
// n'existe pas. Résultat : le lien n'affichait rien (Facebook) ou ne s'ouvrait
// plus du tout (Twitter/X).
//
// buildFacebookUrl() et buildTwitterUrl() acceptent maintenant, comme pour
// WhatsApp :
//   - une URL complète ("https://facebook.com/mrjmb004") → inchangée
//   - un lien sans protocole ("facebook.com/mrjmb004" ou "x.com/mrjmb004")
//     → "https://" est ajouté devant
//   - un simple identifiant ("mrjmb004" ou "@mrjmb004") → reconstruit en
//     "https://facebook.com/mrjmb004" ou "https://x.com/mrjmb004"
// ----------------------------------------------------------------------------
function extractHandle(value) {
  return value
    .trim()
    .replace(/^@/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

export function buildFacebookUrl(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(www\.)?(facebook|fb)\.(com|me)\//i.test(trimmed)) return `https://${trimmed}`;
  const handle = extractHandle(trimmed);
  if (!handle) return null;
  return `https://facebook.com/${handle}`;
}

export function buildTwitterUrl(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(www\.)?(twitter|x)\.com\//i.test(trimmed)) return `https://${trimmed}`;
  const handle = extractHandle(trimmed);
  if (!handle) return null;
  return `https://x.com/${handle}`;
}
