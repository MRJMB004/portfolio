import { useEffect, useState } from "react";
import { FiUpload, FiFileText, FiExternalLink, FiAlertCircle, FiCheck } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function CVAdmin() {
  const [settings, setSettings] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // null | "ok" | "error"
  const [error, setError] = useState("");

  async function load() {
    const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
    setSettings(data);
  }

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setStatus(null);
    setError("");

    try {
      const path = `cv-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("cv")
        .upload(path, file, { contentType: "application/pdf", upsert: true });

      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage.from("cv").getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("settings")
        .update({ cv_url: pub.publicUrl })
        .eq("id", 1);

      if (updateError) throw updateError;

      setStatus("ok");
      setFile(null);
      load();
    } catch (err) {
      setStatus("error");
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const currentUrl = settings?.cv_url || "/cv.pdf";

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold mb-1">CV</h1>
      <p className="text-ink-muted text-sm mb-8">
        Remplace le PDF affiché et téléchargeable sur le site public.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <FiFileText className="text-accent-violet" /> CV actuel
          </h2>
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            Ouvrir le PDF <FiExternalLink />
          </a>
          <p className="text-ink-muted text-xs mt-4 break-all">{currentUrl}</p>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <FiUpload className="text-accent-violet" /> Remplacer le CV
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="admin-input"
            />
            <button
              type="submit"
              disabled={!file || uploading}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {uploading ? "Envoi en cours…" : "Envoyer et publier"}
            </button>

            {status === "ok" && (
              <p className="flex items-center gap-2 text-sm text-emerald-400">
                <FiCheck /> CV mis à jour — visible immédiatement sur le site.
              </p>
            )}
            {status === "error" && (
              <p className="flex items-center gap-2 text-sm text-red-400">
                <FiAlertCircle /> {error}
              </p>
            )}
          </form>
          <p className="text-ink-muted text-xs mt-4 leading-relaxed">
            Le fichier est stocké dans le bucket Supabase Storage <code>cv</code> (public en
            lecture). Assure-toi d'avoir exécuté <code>supabase/schema.sql</code>, qui crée ce
            bucket automatiquement.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
