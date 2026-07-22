import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiGithub, FiExternalLink, FiLayers } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { getProjectBySlug, projects as staticProjects } from "../data/projects";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

export default function ProjectDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [project, setProject] = useState(() => getProjectBySlug(slug));
  const [allProjects, setAllProjects] = useState(staticProjects);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [{ data: one }, { data: all }] = await Promise.all([
        supabase.from("projects").select("*").eq("slug", slug).maybeSingle(),
        supabase.from("projects").select("*").order("position"),
      ]);
      if (cancelled) return;
      if (one) setProject(mapRow(one));
      if (all) setAllProjects(all.map(mapRow));
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!project && !loading) {
    return (
      <section className="section-pad text-center">
        <p className="text-2xl font-display font-bold mb-4">{t("projectDetail.notFound")}</p>
        <Link to="/#projects" className="btn-secondary inline-flex">
          <FiArrowLeft /> {t("projectDetail.back")}
        </Link>
      </section>
    );
  }

  if (!project) return null;

  const otherProjects = allProjects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className="section-pad pt-32">
      <Seo
        title={`${project.title} — JeanMichel`}
        description={project.description}
        url={`/project/${project.slug}`}
      />
      <Reveal>
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-white transition-colors mb-8"
        >
          <FiArrowLeft /> {t("projectDetail.back")}
        </Link>

        <p className="text-xs uppercase tracking-wider text-accent-blue font-mono mb-2">
          {project.category}
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">{project.title}</h1>
        <p className="text-ink-muted max-w-2xl leading-relaxed mb-6">
          {project.full_description || project.fullDescription}
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-ink-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <a href={project.github} target="_blank" rel="noreferrer" className="btn-secondary">
            <FiGithub /> {t("projectDetail.sourceCode")}
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" className="btn-primary">
              <FiExternalLink /> {t("projectDetail.liveDemo")}
            </a>
          )}
        </div>
      </Reveal>

      {project.screenshot_urls?.length > 0 && (
        <Reveal delay={100}>
          <div className="grid sm:grid-cols-3 gap-4 mt-14">
            {project.screenshot_urls.map((url, i) => (
              <div
                key={url}
                className="aspect-video rounded-2xl border border-white/10 bg-gradient-to-br from-accent-blue/15 to-accent-violet/15 overflow-hidden"
              >
                <img
                  src={url}
                  alt={`${project.title} — capture ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>
      )}

      <div className="grid md:grid-cols-2 gap-10 mt-16">
        <Reveal>
          <div className="card p-6 md:p-8 h-full">
            <h3 className="flex items-center gap-2 font-display font-semibold text-lg mb-4">
              <FiLayers className="text-accent-violet" /> {t("projectDetail.architecture")}
            </h3>
            <p className="text-ink-muted leading-relaxed text-sm">{project.architecture}</p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card p-6 md:p-8 h-full">
            <h3 className="font-display font-semibold text-lg mb-4">{t("projectDetail.highlights")}</h3>
            <ul className="space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-ink-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gradient-brand shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {otherProjects.length > 0 && (
        <div className="mt-20">
          <Reveal>
            <h3 className="font-display text-2xl font-bold mb-8">{t("projectDetail.otherProjects")}</h3>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6">
            {otherProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link
                  to={`/project/${p.slug}`}
                  className="card block p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-violet/40"
                >
                  <p className="text-xs uppercase tracking-wider text-accent-blue font-mono mb-1">
                    {p.category}
                  </p>
                  <p className="font-display font-semibold">{p.title}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function mapRow(row) {
  return { ...row, fullDescription: row.full_description };
}
