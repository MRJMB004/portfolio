import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { uJeanMichelnslation } from "react-i18next";
import { FiGithub, FiLinkedin, FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useSettings } from "../../hooks/useContent";

export default function Navbar() {
  const { t } = uJeanMichelnslation();
  const { data: settings } = useSettings();
  const firstName = (settings?.site_name || "Jean Michel Bazire").trim().split(/\s+/)[0];
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const links = [
    { id: "accueil", label: t("nav.accueil") },
    { id: "about", label: t("nav.about") },
    { id: "skills", label: t("nav.skills") },
    { id: "projects", label: t("nav.projects") },
    { id: "experience", label: t("nav.experience") },
    { id: "contact", label: t("nav.contact") },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("accueil");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy : met en surbrillance le lien de la section actuellement visible.
  // On ne l'active que sur la page d'accueil, où les sections existent réellement.
  useEffect(() => {
    if (!isHome) return;

    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        // Se déclenche quand une section traverse la bande juste sous la navbar
        rootMargin: "-96px 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  const linkHref = (id) => (isHome ? `#${id}` : `/#${id}`);
  const isActive = (id) => isHome && active === id;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "navbar-scrolled bg-bg/80 backdrop-blur-md border-b border-white/5 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 md:px-10 lg:px-20 py-4">
        <a href="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-sm">
            {firstName[0]}
          </span>
          {firstName}
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm text-ink-muted">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={linkHref(l.id)}
                onClick={() => setActive(l.id)}
                aria-current={isActive(l.id) ? "true" : undefined}
                className={`relative py-1 transition-colors hover:text-white ${
                  isActive(l.id) ? "text-white" : ""
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-brand rounded-full transition-all duration-300 origin-left ${
                    isActive(l.id) ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-accent-blue/60 hover:-translate-y-0.5"
            aria-label="GitHub"
          >
            <FiGithub size={16} />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-accent-blue/60 hover:-translate-y-0.5"
            aria-label="LinkedIn"
          >
            <FiLinkedin size={16} />
          </a>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-bg-soft border-t border-white/5 px-6 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.id}
              href={linkHref(l.id)}
              onClick={() => {
                setActive(l.id);
                setOpen(false);
              }}
              className={`transition-colors flex items-center gap-2 ${
                isActive(l.id) ? "text-white" : "text-ink-muted hover:text-white"
              }`}
            >
              {isActive(l.id) && (
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
              )}
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
