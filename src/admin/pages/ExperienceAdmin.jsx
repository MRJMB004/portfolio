import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import Modal from "../components/Modal";
import { supabase } from "../../lib/supabaseClient";

export default function ExperienceAdmin() {
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expModal, setExpModal] = useState(null);
  const [expForm, setExpForm] = useState({ year: "", title: "", description: "" });

  const [eduModal, setEduModal] = useState(null);
  const [eduLabel, setEduLabel] = useState("");

  async function load() {
    setLoading(true);
    const [{ data: exp }, { data: edu }] = await Promise.all([
      supabase.from("experience").select("*").order("position"),
      supabase.from("education").select("*").order("position"),
    ]);
    setExperience(exp || []);
    setEducation(edu || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // --- Expérience ---
  const openCreateExp = () => {
    setExpForm({ year: "", title: "", description: "" });
    setExpModal({});
  };
  const openEditExp = (item) => {
    setExpForm(item);
    setExpModal(item);
  };
  const submitExp = async (e) => {
    e.preventDefault();
    const payload = { year: expForm.year, title: expForm.title, description: expForm.description };
    if (expModal.id) {
      await supabase.from("experience").update(payload).eq("id", expModal.id);
    } else {
      await supabase.from("experience").insert({ ...payload, position: experience.length });
    }
    setExpModal(null);
    load();
  };
  const deleteExp = async (item) => {
    if (!confirm(`Supprimer "${item.title}" ?`)) return;
    await supabase.from("experience").delete().eq("id", item.id);
    load();
  };

  // --- Éducation ---
  const openCreateEdu = () => {
    setEduLabel("");
    setEduModal({});
  };
  const openEditEdu = (item) => {
    setEduLabel(item.label);
    setEduModal(item);
  };
  const submitEdu = async (e) => {
    e.preventDefault();
    if (eduModal.id) {
      await supabase.from("education").update({ label: eduLabel }).eq("id", eduModal.id);
    } else {
      await supabase.from("education").insert({ label: eduLabel, position: education.length });
    }
    setEduModal(null);
    load();
  };
  const deleteEdu = async (item) => {
    if (!confirm("Supprimer cette ligne de formation ?")) return;
    await supabase.from("education").delete().eq("id", item.id);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Expériences</h1>
      <p className="text-ink-muted text-sm mb-8">Parcours professionnel et formation.</p>

      {loading ? (
        <p className="text-ink-muted text-sm">Chargement…</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Parcours</h2>
              <button onClick={openCreateExp} className="btn-secondary !px-3 !py-1.5 text-xs">
                <FiPlus size={12} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {experience.map((item) => (
                <div key={item.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-accent-violet mb-1">{item.year}</p>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-ink-muted text-sm mt-1">{item.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEditExp(item)} className="text-ink-muted hover:text-white transition-colors">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => deleteExp(item)} className="text-ink-muted hover:text-red-400 transition-colors">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {experience.length === 0 && <p className="text-ink-muted text-sm">Aucune entrée.</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Formation</h2>
              <button onClick={openCreateEdu} className="btn-secondary !px-3 !py-1.5 text-xs">
                <FiPlus size={12} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {education.map((item) => (
                <div key={item.id} className="card p-4 flex items-center justify-between gap-3">
                  <p className="text-sm">{item.label}</p>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEditEdu(item)} className="text-ink-muted hover:text-white transition-colors">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => deleteEdu(item)} className="text-ink-muted hover:text-red-400 transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {education.length === 0 && <p className="text-ink-muted text-sm">Aucune entrée.</p>}
            </div>
          </div>
        </div>
      )}

      {expModal !== null && (
        <Modal title={expModal.id ? "Modifier l'expérience" : "Nouvelle expérience"} onClose={() => setExpModal(null)}>
          <form onSubmit={submitExp} className="space-y-4">
            <div>
              <label className="admin-label">Période</label>
              <input required value={expForm.year} onChange={(e) => setExpForm({ ...expForm, year: e.target.value })} className="admin-input" placeholder="2024 — Présent" />
            </div>
            <div>
              <label className="admin-label">Titre</label>
              <input required value={expForm.title} onChange={(e) => setExpForm({ ...expForm, title: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Description</label>
              <textarea rows={3} value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} className="admin-input resize-none" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setExpModal(null)} className="btn-secondary">Annuler</button>
              <button type="submit" className="btn-primary">Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}

      {eduModal !== null && (
        <Modal title={eduModal.id ? "Modifier" : "Nouvelle ligne de formation"} onClose={() => setEduModal(null)}>
          <form onSubmit={submitEdu} className="space-y-4">
            <div>
              <label className="admin-label">Texte</label>
              <input required value={eduLabel} onChange={(e) => setEduLabel(e.target.value)} className="admin-input" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEduModal(null)} className="btn-secondary">Annuler</button>
              <button type="submit" className="btn-primary">Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
