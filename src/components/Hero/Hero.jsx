import { FiArrowRight, FiMail, FiGithub, FiLinkedin, FiTwitter, FiFacebook } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Particles from "./Particles";
import TypeWriter from "./TypeWriter";
import { useSettings } from "../../hooks/useContent";
import { normalizeUrl, buildWhatsAppUrl, buildFacebookUrl, buildTwitterUrl, isExternalHref } from "../../lib/socialLinks";

export default function Hero() {
  const { t } = useTranslation();
  const roles = t("hero.roles", { returnObjects: true });
  const { data: settings } = useSettings();

  const fullName = settings?.site_name || "Jean Michel Bazire";
  const nameWords = fullName.trim().split(/\s+/);
  const lastWord = nameWords.pop();
  const firstWords = nameWords.join(" ");

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
    buildTwitterUrl(settings?.twitter_url) && {
      Icon: FiTwitter,
      href: buildTwitterUrl(settings.twitter_url),
      label: "Twitter / X",
    },
    buildFacebookUrl(settings?.facebook_url) && {
      Icon: FiFacebook,
      href: buildFacebookUrl(settings.facebook_url),
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

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center overflow-hidden bg-grid-glow pt-28 pb-16"
    >
      <Particles />
      <div className="section-pad !py-0 w-full grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 sm:px-4 py-1.5 text-xs sm:text-sm mb-5 sm:mb-6 animate-float-slow">
            {t("hero.greeting")}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4">
            {firstWords && `${firstWords} `}
            <span className="bg-gradient-brand bg-clip-text text-transparent">{lastWord}</span>
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl text-ink-muted font-medium mb-6 h-8">
            <TypeWriter words={roles} />
          </h2>
          <p className="text-sm sm:text-base text-ink-muted max-w-lg mb-8 leading-relaxed">{t("hero.tagline")}</p>
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
            <a href="#projects" className="btn-primary !px-5 !py-2.5 sm:!px-6 sm:!py-3 text-sm sm:text-base">
              {t("hero.seeProjects")} <FiArrowRight />
            </a>
            <a href="#contact" className="btn-secondary !px-5 !py-2.5 sm:!px-6 sm:!py-3 text-sm sm:text-base">
              {t("hero.contactMe")} <FiMail />
            </a>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={isExternalHref(href) ? "_blank" : undefined}
                rel={isExternalHref(href) ? "noreferrer" : undefined}
                aria-label={label}
                className="grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-violet/60 hover:shadow-glow"
              >
                <Icon size={15} className="sm:hidden" />
                <Icon size={17} className="hidden sm:block" />
              </a>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative h-48 w-48 sm:h-64 sm:w-64 md:h-96 md:w-96">
            <div className="absolute inset-0 rounded-full bg-gradient-brand blur-3xl opacity-20 animate-pulseGlow" />
            <div className="absolute inset-0 rounded-full border border-accent-violet/40 animate-[spin_18s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-accent-blue/30" />
            <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-white/10 shadow-glow bg-bg-soft grid place-items-center">
              {settings?.avatar_url ? (
                <img
                  src={settings.avatar_url}
                  alt={fullName}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-display text-4xl sm:text-5xl md:text-6xl text-ink-muted/40">
                  {nameWords[0]?.[0] || fullName[0]}
                  {lastWord?.[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
