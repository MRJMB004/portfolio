import { uJeanMichelnslation } from "react-i18next";
import Reveal from "../Reveal";
import { useExperience, useEducation } from "../../hooks/useContent";

export default function Experience() {
  const { t } = uJeanMichelnslation();
  const { data: experience } = useExperience();
  const { data: education } = useEducation();

  return (
    <section id="experience" className="section-pad bg-bg-soft/30">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <Reveal>
            <p className="eyebrow mb-4">{t("experience.eyebrow")}</p>
            <h3 className="font-display text-3xl font-bold mb-10">{t("experience.title")}</h3>
          </Reveal>

          <div className="relative pl-8">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent-violet via-accent-blue to-transparent" />
            {experience.map((item, i) => (
              <Reveal key={item.year} delay={i * 120}>
                <div className="relative mb-10 last:mb-0">
                  <span className="absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full bg-gradient-brand shadow-glow" />
                  <p className="font-mono text-xs text-accent-violet mb-1">{item.year}</p>
                  <h4 className="font-display font-semibold text-lg mb-1">{item.title}</h4>
                  <p className="text-ink-muted text-sm leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <Reveal delay={100}>
            <p className="eyebrow mb-4">{t("experience.educationEyebrow")}</p>
            <h3 className="font-display text-3xl font-bold mb-10">{t("experience.educationTitle")}</h3>
          </Reveal>
          <div className="space-y-4">
            {education.map((e, i) => (
              <Reveal key={e} delay={150 + i * 100}>
                <div className="card px-6 py-4 transition-all duration-300 hover:border-accent-blue/40 hover:translate-x-1">
                  {e}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
