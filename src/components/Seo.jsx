import { useEffect } from "react";

const SITE_NAME = "JeanMichel — Développeur Full-Stack";
const SITE_URL = "https://portfolio-jeanmichel.vercel.app"; // 🔧 remplace par ton vrai domaine
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

function setMeta(attr, key, value) {
  if (!value) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Petit composant SEO "maison" (pas de dépendance externe — react-helmet-async
 * ne supporte pas encore React 19). Met à jour <title>, la meta description et
 * les balises Open Graph / Twitter Card à chaque changement de page.
 */
export default function Seo({ title, description, url = "/", image = DEFAULT_IMAGE }) {
  useEffect(() => {
    const fullTitle = title || SITE_NAME;
    const fullUrl = `${SITE_URL}${url}`;

    document.title = fullTitle;

    setMeta("name", "description", description);
    setCanonical(fullUrl);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", fullUrl);
    setMeta("property", "og:image", image);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "JeanMichel");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
  }, [title, description, url, image]);

  return null;
}
