import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

import { projects as staticProjects } from "../data/projects";
import { skillCategories as staticSkillCategories } from "../data/skills";
import { experience as staticExperience, education as staticEducation } from "../data/experience";
import { services as staticServices, stats as staticStats } from "../data/services";

// ----------------------------------------------------------------------------
// Petit hook générique : tente Supabase, retombe sur la donnée statique si
// Supabase n'est pas configuré ou si la requête échoue (offline, RLS, etc).
// ----------------------------------------------------------------------------
function useSupabaseTable({ table, select = "*", order, mapRows, fallback }) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      let query = supabase.from(table).select(select);
      if (order) query = query.order(order.column, { ascending: order.ascending ?? true });

      const { data: rows, error: err } = await query;

      if (cancelled) return;

      if (err || !rows) {
        setError(err);
        setData(fallback);
      } else {
        setData(mapRows ? mapRows(rows) : rows);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  return { data, loading, error };
}

export function useProjects() {
  return useSupabaseTable({
    table: "projects",
    order: { column: "position" },
    fallback: staticProjects,
  });
}

export function useSkillCategories() {
  return useSupabaseTable({
    table: "skill_categories",
    select: "*, skills(*)",
    order: { column: "position" },
    fallback: staticSkillCategories,
    mapRows: (rows) =>
      rows.map((cat) => ({
        label: cat.label,
        id: cat.id,
        skills: (cat.skills || [])
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((s) => ({ name: s.name, level: s.level, icon: s.icon, id: s.id })),
      })),
  });
}

export function useExperience() {
  return useSupabaseTable({
    table: "experience",
    order: { column: "position" },
    fallback: staticExperience,
  });
}

export function useEducation() {
  return useSupabaseTable({
    table: "education",
    order: { column: "position" },
    fallback: staticEducation,
    mapRows: (rows) => rows.map((r) => r.label),
  });
}

export function useServices() {
  return useSupabaseTable({
    table: "services",
    order: { column: "position" },
    fallback: staticServices,
  });
}

export function useStats() {
  return useSupabaseTable({
    table: "stats",
    order: { column: "position" },
    fallback: staticStats,
  });
}

export function useSettings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data: row, error }) => {
        if (cancelled) return;
        if (!error) setData(row);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}
