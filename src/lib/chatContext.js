// Construit le contexte texte envoyé à l'API du chatbot (api/chat.js), à partir
// des données déjà chargées sur la page (Supabase si configuré, sinon les
// fichiers statiques de src/data/). Le chatbot ne connaît QUE ce texte : pas
// besoin de le "réentraîner", il suffit de garder le portfolio à jour.

function truncate(text, max = 220) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

export function buildPortfolioContext({
  settings,
  projects = [],
  skillCategories = [],
  experience = [],
  services = [],
}) {
  const name = settings?.site_name || "Jean Michel Bazire";
  const location = settings?.location || "Madagascar";
  const tagline = settings?.tagline || "";
  const email = settings?.contact_email || "";
  const phone = settings?.contact_phone || "";
  const cvUrl = settings?.cv_url || "/cv.pdf";
  const links = [
    settings?.github_url && `GitHub: ${settings.github_url}`,
    settings?.linkedin_url && `LinkedIn: ${settings.linkedin_url}`,
    settings?.twitter_url && `Twitter/X: ${settings.twitter_url}`,
    settings?.facebook_url && `Facebook: ${settings.facebook_url}`,
    settings?.whatsapp_url && `WhatsApp: ${settings.whatsapp_url}`,
  ]
    .filter(Boolean)
    .join(" | ");

  const projectsText = projects
    .slice(0, 10)
    .map((p) => `- ${p.title} (${p.category}) : ${truncate(p.description)} [Technos: ${(p.tech || []).join(", ")}]`)
    .join("\n");

  const skillsText = skillCategories
    .map((cat) => `${cat.label}: ${(cat.skills || []).map((s) => s.name).join(", ")}`)
    .join("\n");

  const experienceText = experience.map((e) => `- ${e.year} : ${e.title} — ${truncate(e.description, 160)}`).join("\n");

  const servicesText = services.map((s) => `- ${s.title} : ${truncate(s.description, 140)}`).join("\n");

  return [
    `Nom complet : ${name}`,
    `Localisation : ${location}`,
    tagline && `Présentation : ${tagline}`,
    email && `Email de contact : ${email}`,
    phone && `Téléphone : ${phone}`,
    `Lien de téléchargement du CV (PDF) : ${cvUrl}`,
    links && `Réseaux/Contacts : ${links}`,
    skillsText && `\nCompétences :\n${skillsText}`,
    projectsText && `\nProjets récents :\n${projectsText}`,
    experienceText && `\nExpérience / Parcours :\n${experienceText}`,
    servicesText && `\nServices proposés :\n${servicesText}`,
  ]
    .filter(Boolean)
    .join("\n");
}
