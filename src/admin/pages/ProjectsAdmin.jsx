import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import Modal from "../components/Modal";
import { supabase } from "../../lib/supabaseClient";

const emptyForm = {
  slug: "",
  title: "",
  category: "",
  description: "",
  full_description: "",
  tech: "",
  architecture: "",
  highlights: "",
  screenshots: 3,
  github: "",
  demo: "",
  position: 0,
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = create, {...row} = edit
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("projects").select("*").order("position");
    setProjects(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm({ ...emptyForm, position: projects.length });
    setEditing({});
  };

  const openEdit = (p) => {
    setForm({
      ...p,
      tech: (p.tech || []).join(", "),
      highlights: (p.highlights || []).join("\n"),
    });
    setEditing(p);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      category: form.category,
      description: form.description,
      full_description: form.full_description,
      tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
      architecture: form.architecture,
      highlights: form.highlights.split("\n").map((h) => h.trim()).filter(Boolean),
      screenshots: Number(form.screenshots) || 0,
      github: form.github,
      demo: form.demo || null,
      position: Number(form.position) || 0,
    };

    const query = editing?.id
      ? supabase.from("projects").update(payload).eq("id", editing.id)
      : supabase.from("projects").insert(payload);

    const { error: err } = await query;
    setSaving(false);

    if (err) {
      setError(err.message);
      return;
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (p) => {
    if (!confirm(`Supprimer le projet "${p.title}" ?`)) return;
    await supabase.from("projects").delete().eq("id", p.id);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Projets</h1>
          <p className="text-ink-muted text-sm">Gère les projets affichés sur le portfolio.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <FiPlus /> Nouveau projet
        </button>
      </div>

      {loading ? (
        <p className="text-ink-muted text-sm">Chargement…</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-muted border-b border-white/10">
                <th className="px-5 py-3 font-medium">Titre</th>
                <th className="px-5 py-3 font-medium">Catégorie</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-medium">{p.title}</td>
                  <td className="px-5 py-3 text-ink-muted">{p.category}</td>
                  <td className="px-5 py-3 text-ink-muted font-mono text-xs">{p.slug}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="btn-secondary !px-3 !py-1.5">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p)} className="btn-danger !px-3 !py-1.5">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-ink-muted">
                    Aucun projet pour l'instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing !== null && (
        <Modal title={editing?.id ? "Modifier le projet" : "Nouveau projet"} onClose={() => setEditing(null)} wide>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Titre</label>
                <input required name="title" value={form.title} onChange={handleChange} className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Slug (URL)</label>
                <input required name="slug" value={form.slug} onChange={handleChange} className="admin-input" placeholder="mon-projet" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Catégorie</label>
                <input name="category" value={form.category} onChange={handleChange} className="admin-input" placeholder="Application Web" />
              </div>
              <div>
                <label className="admin-label">Nombre de captures</label>
                <input type="number" min="0" name="screenshots" value={form.screenshots} onChange={handleChange} className="admin-input" />
              </div>
            </div>

            <div>
              <label className="admin-label">Description courte (carte projet)</label>
              <textarea rows={2} name="description" value={form.description} onChange={handleChange} className="admin-input resize-none" />
            </div>

            <div>
              <label className="admin-label">Description complète (page projet)</label>
              <textarea rows={4} name="full_description" value={form.full_description} onChange={handleChange} className="admin-input resize-none" />
            </div>

            <div>
              <label className="admin-label">Technologies (séparées par des virgules)</label>
              <input name="tech" value={form.tech} onChange={handleChange} className="admin-input" placeholder="React, Node.js, PostgreSQL" />
            </div>

            <div>
              <label className="admin-label">Architecture</label>
              <textarea rows={3} name="architecture" value={form.architecture} onChange={handleChange} className="admin-input resize-none" />
            </div>

            <div>
              <label className="admin-label">Points clés (un par ligne)</label>
              <textarea rows={3} name="highlights" value={form.highlights} onChange={handleChange} className="admin-input resize-none" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Lien GitHub</label>
                <input name="github" value={form.github} onChange={handleChange} className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Lien démo (optionnel)</label>
                <input name="demo" value={form.demo || ""} onChange={handleChange} className="admin-input" />
              </div>
            </div>

            <div>
              <label className="admin-label">Position d'affichage (0 = premier)</label>
              <input type="number" name="position" value={form.position} onChange={handleChange} className="admin-input w-32" />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
