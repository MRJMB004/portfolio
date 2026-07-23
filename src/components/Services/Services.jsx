import { FiCode, FiSmartphone, FiDatabase, FiTool } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Reveal from "../Reveal";
import { useServices } from "../../hooks/useContent";

const icons = { code: FiCode, phone: FiSmartphone, database: FiDatabase, tool: FiTool };

export default function Services() {
  const { t } = useTranslation();
  const { data: services } = useServices();

  return (
    <section id="services" className="section-pad">
      <Reveal>
        <p className="eyebrow mb-4">{t("services.eyebrow")}</p>
        <h3 className="font-display text-2xl sm:text-3xl font-bold mb-12">{t("services.title")}</h3>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => {
          const Icon = icons[s.icon];
          return (
            <Reveal key={s.title} delay={i * 100}>
              <div className="card p-6 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-glow-blue group">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon size={20} />
                </div>
                <h4 className="font-display font-semibold mb-2">{s.title}</h4>
                <p className="text-ink-muted text-sm leading-relaxed">{s.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
