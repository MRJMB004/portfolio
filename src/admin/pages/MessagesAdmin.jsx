import { useEffect, useState } from "react";
import { FiMail, FiCheck, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | unread

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (m) => {
    await supabase.from("messages").update({ read: !m.read }).eq("id", m.id);
    load();
  };

  const remove = async (m) => {
    if (!confirm(`Supprimer le message de "${m.name}" ?`)) return;
    await supabase.from("messages").delete().eq("id", m.id);
    load();
  };

  const visible = filter === "unread" ? messages.filter((m) => !m.read) : messages;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Messages</h1>
          <p className="text-ink-muted text-sm">Messages reçus via le formulaire de contact.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`btn-secondary !px-4 !py-2 text-xs ${filter === "all" ? "border-accent-violet/60" : ""}`}
          >
            Tous ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`btn-secondary !px-4 !py-2 text-xs ${filter === "unread" ? "border-accent-violet/60" : ""}`}
          >
            Non lus ({messages.filter((m) => !m.read).length})
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-ink-muted text-sm">Chargement…</p>
      ) : (
        <div className="space-y-3">
          {visible.map((m) => (
            <div key={m.id} className={`card p-5 ${!m.read ? "border-accent-violet/30" : ""}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{m.name}</p>
                    {!m.read && (
                      <span className="text-[10px] uppercase tracking-wider bg-gradient-brand px-2 py-0.5 rounded-full">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <a href={`mailto:${m.email}`} className="text-accent-blue text-sm hover:underline">
                    {m.email}
                  </a>
                  <p className="text-sm font-medium mt-2">{m.subject}</p>
                  <p className="text-ink-muted text-sm mt-1 whitespace-pre-wrap">{m.message}</p>
                  <p className="text-ink-muted/60 text-xs mt-3 font-mono">
                    {new Date(m.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggleRead(m)} className="btn-secondary !px-3 !py-1.5" title={m.read ? "Marquer non lu" : "Marquer lu"}>
                    {m.read ? <FiMail size={14} /> : <FiCheck size={14} />}
                  </button>
                  <button onClick={() => remove(m)} className="btn-danger !px-3 !py-1.5">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <p className="text-ink-muted text-sm text-center py-10">Aucun message pour l'instant.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
