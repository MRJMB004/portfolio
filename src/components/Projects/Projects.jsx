import { useTranslation } from "react-i18next";
import Reveal from "../Reveal";
import ProjectCard from "./ProjectCard";
import { useProjects } from "../../hooks/useContent";

export default function Projects() {
  const { t } = useTranslation();
  const { data: projects } = useProjects();

  return (
    <section id="projects" className="section-pad">
      <Reveal>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="eyebrow mb-4">{t("projects.eyebrow")}</p>
            <h3 className="font-display text-3xl font-bold">{t("projects.title")}</h3>
          </div>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
