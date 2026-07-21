import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage?.startsWith("en") ? "en" : "fr";
  const next = current === "fr" ? "en" : "fr";

  return (
    <button
      onClick={() => i18n.changeLanguage(next)}
      aria-label={`Switch to ${next === "fr" ? "Français" : "English"}`}
      title={next === "fr" ? "Passer en Français" : "Switch to English"}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-base transition-all duration-300 hover:border-accent-violet/60 hover:-translate-y-0.5"
    >
      {current === "fr" ? "🇬🇧" : "🇫🇷"}
    </button>
  );
}
