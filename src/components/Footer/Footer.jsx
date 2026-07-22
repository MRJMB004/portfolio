import { FiGithub, FiLinkedin, FiTwitter, FiFacebook, FiMail, FiHeart } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../hooks/useContent";
import { normalizeUrl, buildWhatsAppUrl, isExternalHref } from "../../lib/socialLinks";

export default function Footer() {
  const { t } = useTranslation();
  const { data: settings } = useSettings();
  const fullName = settings?.site_name || "Jean Michel Bazire";
  const firstName = fullName.trim().split(/\s+/)[0];

  const socialLinks = [
    normalizeUrl(settings?.github_url) && {
      Icon: FiGithub,
      href: normalizeUrl(settings.github_url),
      label: "GitHub",
    },
    normalizeUrl(settings?.linkedin_url) && {
      Icon: FiLinkedin,
      href: normalizeUrl(settings.linkedin_url),
      label: "LinkedIn",
    },
    normalizeUrl(settings?.twitter_url) && {
      Icon: FiTwitter,
      href: normalizeUrl(settings.twitter_url),
      label: "Twitter / X",
    },
    normalizeUrl(settings?.facebook_url) && {
      Icon: FiFacebook,
      href: normalizeUrl(settings.facebook_url),
      label: "Facebook",
    },
    buildWhatsAppUrl(settings?.whatsapp_url) && {
      Icon: FaWhatsapp,
      href: buildWhatsAppUrl(settings.whatsapp_url),
      label: "WhatsApp",
    },
    settings?.contact_email && {
      Icon: FiMail,
      href: `mailto:${settings.contact_email}`,
      label: "Email",
    },
  ].filter(Boolean);

  const links = [
    { href: "/#accueil", label: t("nav.accueil") },
    { href: "/#skills", label: t("nav.skills") },
    { href: "/#projects", label: t("nav.projects") },
    { href: "/#cv", label: "CV" },
    { href: "/#contact", label: t("nav.contact") },
  ];

  return (
    <footer className="border-t border-white/5 px-6 md:px-10 lg:px-20 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="/" className="flex items-center gap-2 font-display font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-sm">
            {firstName[0]}
          </span>
          {firstName}
        </a>

        <ul className="flex flex-wrap items-center gap-6 text-sm text-ink-muted">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {socialLinks.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={isExternalHref(href) ? "_blank" : undefined}
              rel={isExternalHref(href) ? "noreferrer" : undefined}
              aria-label={label}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 transition-all hover:-translate-y-0.5 hover:border-accent-violet/60"
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-ink-muted mt-8">
        © {new Date().getFullYear()} {firstName}. {t("footer.rights")} {t("footer.madeWith")}{" "}
        <FiHeart className="inline text-accent-violet" /> React
      </p>
    </footer>
  );
}
