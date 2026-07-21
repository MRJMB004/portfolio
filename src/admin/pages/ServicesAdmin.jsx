import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import Modal from "../components/Modal";
import { supabase } from "../../lib/supabaseClient";

const ICONS = ["code", "phone", "database", "tool"];

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [svcModal, setSvcModal] = useState(null);
  const [svcForm, setSvcForm] = useState({ title: "", description: "", icon: "code" });

  const [statModal, setStatModal] = useState(null);
  const [statForm, setStatForm] = useState({ value: "", label: "" });

  async function load() {
    setLoading(true);
    const [{ data: svc }, { data: st }] = await Promise.all([
      supabase.from("services").select("*").order("position"),
      supabase.from("stats").select("*").order("position"),
    ]);
    setServices(svc || []);
    setStats(st || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // --- Services ---
  const openCreateSvc = () => {
    setSvcForm({ title: "", description: "", icon: "code" });
    setSvcModal({});
  };
  const openEditSvc = (item) => {
    setSvcForm(item);
    setSvcModal(item);
  };
  const submitSvc = async (e) => {
    e.preventDefault();
    const payload = { title: svcForm.title, description: svcForm.description, icon: svcForm.icon };
    if (svcModal.id) {
      await supabase.from("services").update(payload).eq("id", svcModal.id);
    } else {
      await supabase.from("services").insert({ ...payload, position: services.length });
    }
    setSvcModal(null);
    load();
  };
  const deleteSvc = async (item) => {
    if (!confirm(`Supprimer le service "${item.title}" ?`)) return;
    await supabase.from("services").delete().eq("id", item.id);
    load();
  };

  // --- Stats ---
  const openCreateStat = () => {
    setStatForm({ value: "", label: "" });
    setStatModal({});
  };
  const openEditStat = (item) => {
    setStatForm(item);
    setStatModal(item);
  };
  const submitStat = async (e) => {
    e.preventDefault();
    const payload = { value: statForm.value, label: statForm.label };
    if (statModal.id) {
      await supabase.from("stats").update(payload).eq("id", statModal.id);
    } else {
      await supabase.from("stats").insert({ ...payload, position: stats.length });
    }
    setStatModal(null);
    load();
  };
  const deleteStat = async (item) => {
    if (!confirm(`Supprimer la statistique "${item.label}" ?`)) return;
    await supabase.from("stats").delete().eq("id", item.id);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Services</h1>
      <p className="text-ink-muted text-sm mb-8">Services proposés et chiffres clés (section "À propos").</p>

      {loading ? (
        <p className="text-ink-muted text-sm">Chargement…</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Services</h2>
              <button onClick={openCreateSvc} className="btn-secondary !px-3 !py-1.5 text-xs">
                <FiPlus size={12} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.id} className="card p-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-ink-muted text-sm mt-1">{s.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEditSvc(s)} className="text-ink-muted hover:text-white transition-colors">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => deleteSvc(s)} className="text-ink-muted hover:text-red-400 transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {services.length === 0 && <p className="text-ink-muted text-sm">Aucun service.</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Chiffres clés</h2>
              <button onClick={openCreateStat} className="btn-secondary !px-3 !py-1.5 text-xs">
                <FiPlus size={12} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {stats.map((s) => (
                <div key={s.id} className="card p-4 flex items-center justify-between gap-3">
                  <p className="text-sm">
                    <span className="font-display font-bold text-accent-violet">{s.value}</span> — {s.label}
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEditStat(s)} className="text-ink-muted hover:text-white transition-colors">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => deleteStat(s)} className="text-ink-muted hover:text-red-400 transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {stats.length === 0 && <p className="text-ink-muted text-sm">Aucune statistique.</p>}
            </div>
          </div>
        </div>
      )}

      {svcModal !== null && (
        <Modal title={svcModal.id ? "Modifier le service" : "Nouveau service"} onClose={() => setSvcModal(null)}>
          <form onSubmit={submitSvc} className="space-y-4">
            <div>
              <label className="admin-label">Titre</label>
              <input required value={svcForm.title} onChange={(e) => setSvcForm({ ...svcForm, title: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Description</label>
              <textarea rows={3} value={svcForm.description} onChange={(e) => setSvcForm({ ...svcForm, description: e.target.value })} className="admin-input resize-none" />
            </div>
            <div>
              <label className="admin-label">Icône</label>
              <select value={svcForm.icon} onChange={(e) => setSvcForm({ ...svcForm, icon: e.target.value })} className="admin-input">
                {ICONS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setSvcModal(null)} className="btn-secondary">Annuler</button>
              <button type="submit" className="btn-primary">Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}

      {statModal !== null && (
        <Modal title={statModal.id ? "Modifier la statistique" : "Nouvelle statistique"} onClose={() => setStatModal(null)}>
          <form onSubmit={submitStat} className="space-y-4">
            <div>
              <label className="admin-label">Valeur</label>
              <input required value={statForm.value} onChange={(e) => setStatForm({ ...statForm, value: e.target.value })} className="admin-input" placeholder="4+" />
            </div>
            <div>
              <label className="admin-label">Libellé</label>
              <input required value={statForm.label} onChange={(e) => setStatForm({ ...statForm, label: e.target.value })} className="admin-input" placeholder="Projets réalisés" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setStatModal(null)} className="btn-secondary">Annuler</button>
              <button type="submit" className="btn-primary">Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
