import { useEffect, useRef, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiImage, FiX, FiAlertCircle } from "react-icons/fi";
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
  image_url: "",
  screenshot_urls: [],
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
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingShots, setUploadingShots] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const thumbInputRef = useRef(null);
  const shotsInputRef = useRef(null);

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
      image_url: p.image_url || "",
      screenshot_urls: p.screenshot_urls || [],
    });
    setUploadError("");
    setEditing(p);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const uploadToMedia = async (file) => {
    const ext = file.name.split(".").pop();
    const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("media").upload(path, file);
    if (uploadErr) throw uploadErr;
    const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
    return pub.publicUrl;
  };

  const handleThumbChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    setUploadError("");
    try {
      const url = await uploadToMedia(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploadingThumb(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    }
  };

  const handleShotsChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingShots(true);
    setUploadError("");
    try {
      const urls = await Promise.all(files.map(uploadToMedia));
      setForm((f) => ({ ...f, screenshot_urls: [...(f.screenshot_urls || []), ...urls] }));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploadingShots(false);
      if (shotsInputRef.current) shotsInputRef.current.value = "";
    }
  };

  const removeScreenshot = (url) =>
    setForm((f) => ({ ...f, screenshot_urls: f.screenshot_urls.filter((u) => u !== url) }));

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
      image_url: form.image_url || null,
      screenshot_urls: form.screenshot_urls || [],
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
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
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
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-ink-muted border-b border-white/10">
                <th className="px-5 py-3 font-medium"></th>
                <th className="px-5 py-3 font-medium">Titre</th>
                <th className="px-5 py-3 font-medium">Catégorie</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3">
                    <div className="h-10 w-14 rounded-lg overflow-hidden bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 grid place-items-center shrink-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <FiImage className="text-ink-muted/50" size={14} />
                      )}
                    </div>
                  </td>
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
                  <td colSpan={5} className="px-5 py-8 text-center text-ink-muted">
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

            <div>
              <label className="admin-label">Catégorie</label>
              <input name="category" value={form.category} onChange={handleChange} className="admin-input" placeholder="Application Web" />
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

            <div>
              <label className="admin-label">Miniature (carte projet)</label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-24 rounded-lg overflow-hidden border border-white/10 bg-bg-soft grid place-items-center shrink-0">
                  {form.image_url ? (
                    <img src={form.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <FiImage className="text-ink-muted" size={18} />
                  )}
                </div>
                <div>
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleThumbChange}
                    className="hidden"
                    id="thumb-upload"
                  />
                  <label htmlFor="thumb-upload" className="btn-secondary cursor-pointer inline-flex !px-3 !py-1.5 text-sm">
                    <FiUpload size={14} /> {uploadingThumb ? "Envoi…" : "Choisir une image"}
                  </label>
                  {form.image_url && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                      className="ml-2 text-xs text-ink-muted hover:text-red-400 transition-colors"
                    >
                      Retirer
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="admin-label">Captures d'écran (page projet)</label>
              {form.screenshot_urls?.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                  {form.screenshot_urls.map((url) => (
                    <div key={url} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeScreenshot(url)}
                        className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-bg/80 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Retirer cette capture"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                ref={shotsInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                onChange={handleShotsChange}
                className="hidden"
                id="shots-upload"
              />
              <label htmlFor="shots-upload" className="btn-secondary cursor-pointer inline-flex !px-3 !py-1.5 text-sm">
                <FiUpload size={14} /> {uploadingShots ? "Envoi…" : "Ajouter des captures"}
              </label>
              <p className="text-ink-muted text-xs mt-1.5">
                Plusieurs images à la fois possible. Elles s'affichent dans l'ordre d'ajout sur la
                page détail du projet.
              </p>
              {uploadError && (
                <p className="flex items-center gap-2 text-sm text-red-400 mt-2">
                  <FiAlertCircle /> {uploadError}
                </p>
              )}
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
