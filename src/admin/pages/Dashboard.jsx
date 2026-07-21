import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiFolder, FiMail, FiBarChart2, FiClock } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
  const [counts, setCounts] = useState({ projects: null, messages: null, unread: null, skills: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [projects, skills, messages, unread] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
      ]);
      if (cancelled) return;
      setCounts({
        projects: projects.count ?? 0,
        skills: skills.count ?? 0,
        messages: messages.count ?? 0,
        unread: unread.count ?? 0,
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { label: "Projets", value: counts.projects, icon: FiFolder, to: "/admin/projects" },
    { label: "Compétences", value: counts.skills, icon: FiBarChart2, to: "/admin/skills" },
    { label: "Messages non lus", value: counts.unread, icon: FiMail, to: "/admin/messages" },
    { label: "Messages au total", value: counts.messages, icon: FiClock, to: "/admin/messages" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-ink-muted text-sm mb-8">
        Vue d'ensemble du contenu de ton portfolio, connecté à Supabase.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card p-5 hover:border-accent-violet/40 transition-colors">
            <c.icon className="text-accent-violet mb-3" size={20} />
            <div className="font-display text-3xl font-bold">{c.value ?? "—"}</div>
            <div className="text-ink-muted text-sm mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="card p-6 mt-8">
        <h2 className="font-display font-semibold mb-3">Comment ça marche</h2>
        <p className="text-ink-muted text-sm leading-relaxed">
          Chaque section du menu (Projets, Compétences, Expériences, Services, Messages, CV,
          Paramètres) modifie directement les tables Supabase utilisées par le site public.
          Toute modification est visible immédiatement sur le site, sans rebuild ni déploiement.
        </p>
      </div>
    </AdminLayout>
  );
}
