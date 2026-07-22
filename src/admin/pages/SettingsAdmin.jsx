import { useEffect, useRef, useState } from "react";
import { FiCheck, FiAlertCircle, FiUpload, FiUser } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

const empty = {
  site_name: "",
  tagline: "",
  contact_email: "",
  contact_phone: "",
  location: "",
  github_url: "",
  linkedin_url: "",
  twitter_url: "",
  facebook_url: "",
  whatsapp_url: "",
  avatar_url: "",
};

export default function SettingsAdmin() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);

  const load = () =>
    supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setForm({ ...empty, ...data });
        setLoading(false);
      });

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const { error } = await supabase
      .from("settings")
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq("id", 1);
    setSaving(false);
    setStatus(error ? "error" : "ok");
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPhotoError("");

    try {
      const ext = file.name.split(".").pop();
      const path = `avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("settings")
        .update({ avatar_url: pub.publicUrl, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (updateError) throw updateError;

      setForm((f) => ({ ...f, avatar_url: pub.publicUrl }));
    } catch (err) {
      setPhotoError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-ink-muted text-sm">Chargement…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Paramètres</h1>
      <p className="text-ink-muted text-sm mb-8">
        Informations globales utilisées sur le site (section Contact, footer, méta SEO).
      </p>

      {/* Photo de profil */}
      <div className="card p-6 md:p-8 max-w-xl mb-6">
        <h2 className="font-display font-semibold mb-4">Photo de profil</h2>
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full overflow-hidden border border-white/10 bg-bg-soft grid place-items-center shrink-0">
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="Photo de profil" className="h-full w-full object-cover" />
            ) : (
              <FiUser className="text-ink-muted" size={24} />
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handlePhotoChange}
              className="hidden"
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className="btn-secondary cursor-pointer inline-flex">
              <FiUpload /> {uploading ? "Envoi en cours…" : "Changer la photo"}
            </label>
            <p className="text-ink-muted text-xs mt-2">JPG, PNG ou WebP. Affichée sur l'accueil et la section À propos.</p>
            {photoError && (
              <p className="flex items-center gap-2 text-sm text-red-400 mt-2">
                <FiAlertCircle /> {photoError}
              </p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 md:p-8 max-w-xl space-y-4">
        <div>
          <label className="admin-label">Nom affiché</label>
          <input name="site_name" value={form.site_name || ""} onChange={handleChange} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">Accroche (tagline)</label>
          <input name="tagline" value={form.tagline || ""} onChange={handleChange} className="admin-input" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Email de contact</label>
            <input
              type="email"
              name="contact_email"
              value={form.contact_email || ""}
              onChange={handleChange}
              className="admin-input"
              placeholder="contact@JeanMichel.dev"
            />
          </div>
          <div>
            <label className="admin-label">Téléphone</label>
            <input
              name="contact_phone"
              value={form.contact_phone || ""}
              onChange={handleChange}
              className="admin-input"
              placeholder="+261 34 00 000 00"
            />
          </div>
        </div>
        <div>
          <label className="admin-label">Localisation</label>
          <input name="location" value={form.location || ""} onChange={handleChange} className="admin-input" placeholder="Madagascar" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Lien GitHub</label>
            <input name="github_url" value={form.github_url || ""} onChange={handleChange} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Lien LinkedIn</label>
            <input name="linkedin_url" value={form.linkedin_url || ""} onChange={handleChange} className="admin-input" />
          </div>
        </div>
        <div>
          <label className="admin-label">Lien Twitter / X (optionnel)</label>
          <input
            name="twitter_url"
            value={form.twitter_url || ""}
            onChange={handleChange}
            className="admin-input"
            placeholder="https://x.com/... ou juste ton identifiant, ex: mrjmb004"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Lien Facebook (optionnel)</label>
            <input
              name="facebook_url"
              value={form.facebook_url || ""}
              onChange={handleChange}
              className="admin-input"
              placeholder="https://facebook.com/... ou juste ton identifiant, ex: mrjmb004"
            />
          </div>
          <div>
            <label className="admin-label">WhatsApp (optionnel)</label>
            <input
              name="whatsapp_url"
              value={form.whatsapp_url || ""}
              onChange={handleChange}
              className="admin-input"
              placeholder="+261 34 00 000 00 ou https://wa.me/..."
            />
          </div>
        </div>
        <p className="text-ink-muted text-xs">
          Laisse un champ vide pour masquer son icône sur le site. Tu peux coller un lien avec ou
          sans "https://" devant (ex: "linkedin.com/in/toi" fonctionne aussi bien que
          "https://linkedin.com/in/toi") : le site ajoute automatiquement le protocole manquant, ce
          qui évite l'erreur 404 qui se produisait quand un lien était enregistré sans "https://".
          Pour Facebook et Twitter/X, tu peux aussi taper juste ton identifiant (ex: "mrjmb004")
          sans coller le lien complet — le site reconstruit automatiquement
          "facebook.com/mrjmb004" ou "x.com/mrjmb004". Pour WhatsApp, indique juste ton numéro
          avec l'indicatif pays (ex: "+261340000000").
        </p>

        {status === "ok" && (
          <p className="flex items-center gap-2 text-sm text-emerald-400">
            <FiCheck /> Paramètres enregistrés — visibles immédiatement sur le site.
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-2 text-sm text-red-400">
            <FiAlertCircle /> Une erreur est survenue.
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </AdminLayout>
  );
}
