import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import Modal from "../components/Modal";
import { supabase } from "../../lib/supabaseClient";

export default function SkillsAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [catModal, setCatModal] = useState(null); // {} create | {id,label} edit
  const [catLabel, setCatLabel] = useState("");

  const [skillModal, setSkillModal] = useState(null); // {categoryId, skill?}
  const [skillForm, setSkillForm] = useState({ name: "", level: 50, icon: "" });

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("skill_categories")
      .select("*, skills(*)")
      .order("position");
    setCategories(
      (data || []).map((c) => ({ ...c, skills: (c.skills || []).sort((a, b) => a.position - b.position) }))
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // --- Catégories ---
  const openCreateCat = () => {
    setCatLabel("");
    setCatModal({});
  };
  const openEditCat = (c) => {
    setCatLabel(c.label);
    setCatModal(c);
  };
  const submitCat = async (e) => {
    e.preventDefault();
    if (catModal?.id) {
      await supabase.from("skill_categories").update({ label: catLabel }).eq("id", catModal.id);
    } else {
      await supabase
        .from("skill_categories")
        .insert({ label: catLabel, position: categories.length });
    }
    setCatModal(null);
    load();
  };
  const deleteCat = async (c) => {
    if (!confirm(`Supprimer la catégorie "${c.label}" et toutes ses compétences ?`)) return;
    await supabase.from("skill_categories").delete().eq("id", c.id);
    load();
  };

  // --- Compétences ---
  const openCreateSkill = (categoryId) => {
    setSkillForm({ name: "", level: 50, icon: "" });
    setSkillModal({ categoryId });
  };
  const openEditSkill = (categoryId, skill) => {
    setSkillForm(skill);
    setSkillModal({ categoryId, skill });
  };
  const submitSkill = async (e) => {
    e.preventDefault();
    const payload = {
      name: skillForm.name,
      level: Number(skillForm.level),
      icon: skillForm.icon,
    };
    if (skillModal.skill?.id) {
      await supabase.from("skills").update(payload).eq("id", skillModal.skill.id);
    } else {
      const cat = categories.find((c) => c.id === skillModal.categoryId);
      await supabase
        .from("skills")
        .insert({ ...payload, category_id: skillModal.categoryId, position: cat?.skills.length || 0 });
    }
    setSkillModal(null);
    load();
  };
  const deleteSkill = async (skill) => {
    if (!confirm(`Supprimer la compétence "${skill.name}" ?`)) return;
    await supabase.from("skills").delete().eq("id", skill.id);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Compétences</h1>
          <p className="text-ink-muted text-sm">Catégories et niveaux affichés sur le portfolio.</p>
        </div>
        <button onClick={openCreateCat} className="btn-primary">
          <FiPlus /> Nouvelle catégorie
        </button>
      </div>

      {loading ? (
        <p className="text-ink-muted text-sm">Chargement…</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-accent-violet">{cat.label}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEditCat(cat)} className="text-ink-muted hover:text-white transition-colors">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => deleteCat(cat)} className="text-ink-muted hover:text-red-400 transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {cat.skills.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
                    <span>
                      {s.name} <span className="text-ink-muted font-mono">· {s.level}%</span>
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEditSkill(cat.id, s)} className="text-ink-muted hover:text-white transition-colors">
                        <FiEdit2 size={12} />
                      </button>
                      <button onClick={() => deleteSkill(s)} className="text-ink-muted hover:text-red-400 transition-colors">
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {cat.skills.length === 0 && <p className="text-ink-muted text-xs">Aucune compétence.</p>}
              </div>

              <button
                onClick={() => openCreateSkill(cat.id)}
                className="mt-4 text-xs text-accent-violet hover:text-white transition-colors flex items-center gap-1"
              >
                <FiPlus size={12} /> Ajouter une compétence
              </button>
            </div>
          ))}
        </div>
      )}

      {catModal !== null && (
        <Modal title={catModal.id ? "Modifier la catégorie" : "Nouvelle catégorie"} onClose={() => setCatModal(null)}>
          <form onSubmit={submitCat} className="space-y-4">
            <div>
              <label className="admin-label">Nom de la catégorie</label>
              <input required value={catLabel} onChange={(e) => setCatLabel(e.target.value)} className="admin-input" placeholder="Front-end" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setCatModal(null)} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                Enregistrer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {skillModal !== null && (
        <Modal title={skillModal.skill ? "Modifier la compétence" : "Nouvelle compétence"} onClose={() => setSkillModal(null)}>
          <form onSubmit={submitSkill} className="space-y-4">
            <div>
              <label className="admin-label">Nom</label>
              <input
                required
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                className="admin-input"
                placeholder="React"
              />
            </div>
            <div>
              <label className="admin-label">Niveau ({skillForm.level}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={skillForm.level}
                onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="admin-label">Icône (identifiant libre, ex: react, node, java…)</label>
              <input
                value={skillForm.icon || ""}
                onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                className="admin-input"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setSkillModal(null)} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                Enregistrer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
