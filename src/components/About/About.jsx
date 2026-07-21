import { FiMapPin, FiBookOpen, FiCheckCircle } from "react-icons/fi";
import { uJeanMichelnslation } from "react-i18next";
import Reveal from "../Reveal";
import { useStats, useSettings } from "../../hooks/useContent";

export default function About() {
  const { t } = uJeanMichelnslation();
  const { data: stats } = useStats();
  const { data: settings } = useSettings();
  const cvUrl = settings?.cv_url || "/cv.pdf";

  return (
    <section id="about" className="section-pad">
      <Reveal>
        <p className="eyebrow mb-4">{t("about.eyebrow")}</p>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-14 items-center">
        <Reveal>
          <div className="relative max-w-sm">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-brand opacity-20 blur-xl" />
            <div className="relative aspect-[4/5] rounded-2xl border border-white/10 bg-bg-soft grid place-items-center overflow-hidden">
              {settings?.avatar_url ? (
                <img
                  src={settings.avatar_url}
                  alt={settings?.site_name || "Photo de profil"}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-display text-7xl text-ink-muted/30">SR</span>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <h3 className="font-display text-3xl font-bold mb-4">{t("about.subtitle")}</h3>
          <p className="text-ink-muted leading-relaxed mb-6">{t("about.body")}</p>

          <div className="space-y-3 mb-8 text-sm">
            <div className="flex items-center gap-3 text-ink-muted">
              <FiMapPin className="text-accent-violet" /> {t("about.location")}
            </div>
            <div className="flex items-center gap-3 text-ink-muted">
              <FiBookOpen className="text-accent-violet" /> {t("about.role")}
            </div>
            <div className="flex items-center gap-3 text-ink-muted">
              <FiCheckCircle className="text-accent-violet" /> {t("about.available")}
            </div>
          </div>

          <a href={cvUrl} download className="btn-secondary">
            {t("about.downloadCv")} ↓
          </a>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80}>
            <div className="card px-5 py-7 text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow">
              <div className="font-display text-3xl font-bold bg-gradient-brand bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-ink-muted text-sm mt-1">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
