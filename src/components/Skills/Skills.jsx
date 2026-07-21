import { uJeanMichelnslation } from "react-i18next";
import Reveal from "../Reveal";
import SkillBar from "./SkillBar";
import { useSkillCategories } from "../../hooks/useContent";

export default function Skills() {
  const { t } = uJeanMichelnslation();
  const { data: skillCategories } = useSkillCategories();

  return (
    <section id="skills" className="section-pad bg-bg-soft/30">
      <Reveal>
        <p className="eyebrow mb-4">{t("skills.eyebrow")}</p>
        <h3 className="font-display text-3xl font-bold mb-12">{t("skills.title")}</h3>
      </Reveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((cat, i) => (
          <Reveal key={cat.label} delay={i * 90}>
            <div className="card p-6 h-full transition-transform duration-300 hover:-translate-y-1">
              <h4 className="font-display font-semibold text-accent-violet mb-5 text-sm uppercase tracking-wider">
                {cat.label}
              </h4>
              {cat.skills.map((s) => (
                <SkillBar key={s.name} name={s.name} level={s.level} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
