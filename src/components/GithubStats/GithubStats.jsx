import { useEffect, useState } from "react";
import { FiGithub, FiStar, FiGitBranch, FiUsers, FiCode } from "react-icons/fi";
import Reveal from "../Reveal";

const GITHUB_USERNAME = "JeanMichel-dev"; // 🔧 remplace par ton vrai username GitHub

export default function GithubStats() {
  const [data, setData] = useState(null);
  const [langs, setLangs] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!userRes.ok) throw new Error("user fetch failed");
        const user = await userRes.json();

        const reposRes = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`
        );
        const repos = reposRes.ok ? await reposRes.json() : [];

        const langCount = {};
        let stars = 0;
        (Array.isArray(repos) ? repos : []).forEach((r) => {
          if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
          stars += r.stargazers_count || 0;
        });
        const topLangs = Object.entries(langCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        if (!cancelled) {
          setData({
            repos: user.public_repos ?? repos.length,
            followers: user.followers ?? 0,
            stars,
          });
          setLangs(topLangs);
          setStatus("ok");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    { icon: FiCode, label: "Dépôts publics", value: data?.repos },
    { icon: FiUsers, label: "Contributeurs suivis", value: data?.followers },
    { icon: FiStar, label: "Étoiles reçues", value: data?.stars },
  ];

  return (
    <section id="github" className="section-pad bg-bg-soft/30">
      <Reveal>
        <p className="eyebrow mb-4">GitHub</p>
        <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
          <FiGithub /> Activité open-source
        </h3>
        <p className="text-ink-muted mb-10 max-w-lg">
          Statistiques récupérées en direct depuis l'API publique GitHub.
        </p>
      </Reveal>

      {status === "error" && (
        <Reveal>
          <div className="card p-6 text-ink-muted text-sm">
            Impossible de charger les statistiques GitHub pour le moment. Vérifie que le nom
            d'utilisateur configuré dans <code>GithubStats.jsx</code> est correct.
          </div>
        </Reveal>
      )}

      {status !== "error" && (
        <div className="grid md:grid-cols-[1fr_1fr] gap-6">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="card px-4 py-6 text-center h-full flex flex-col items-center justify-center gap-2">
                  <s.icon className="text-accent-violet" size={20} />
                  <div className="font-display text-2xl font-bold">
                    {status === "loading" ? "—" : s.value}
                  </div>
                  <div className="text-ink-muted text-xs">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="card p-6 h-full">
              <p className="flex items-center gap-2 text-sm font-medium mb-4">
                <FiGitBranch className="text-accent-blue" /> Langages les plus utilisés
              </p>
              {status === "loading" && <p className="text-ink-muted text-sm">Chargement…</p>}
              {status === "ok" && langs.length === 0 && (
                <p className="text-ink-muted text-sm">Aucune donnée de langage disponible.</p>
              )}
              <div className="space-y-3">
                {langs.map((l) => (
                  <div key={l.name} className="flex items-center gap-3">
                    <span className="text-xs w-24 shrink-0 text-ink-muted">{l.name}</span>
                    <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-brand rounded-full"
                        style={{ width: `${(l.count / langs[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      )}
    </section>
  );
}
