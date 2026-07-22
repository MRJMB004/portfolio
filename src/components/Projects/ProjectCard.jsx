import { Link } from "react-router-dom";
import { FiGithub, FiExternalLink, FiArrowUpRight } from "react-icons/fi";

export default function ProjectCard({ project }) {
  return (
    <div className="card group overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-glow hover:border-accent-violet/40">
      <Link to={`/project/${project.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-accent-blue/20 to-accent-violet/20">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-lg text-white/50">{project.title}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/40 transition-colors duration-500" />
          <span className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-bg/70 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <FiArrowUpRight size={15} />
          </span>
        </div>
      </Link>
      <div className="p-6">
        <p className="text-xs uppercase tracking-wider text-accent-blue font-mono mb-1">
          {project.category}
        </p>
        <Link to={`/project/${project.slug}`}>
          <h4 className="font-display font-semibold text-lg mb-2 hover:text-accent-violet transition-colors">
            {project.title}
          </h4>
        </Link>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-ink-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-ink-muted hover:text-white transition-colors"
          >
            <FiGithub size={15} /> GitHub
          </a>
          <Link
            to={`/project/${project.slug}`}
            className="flex items-center gap-1.5 text-accent-violet hover:text-white transition-colors"
          >
            Détails <FiExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
