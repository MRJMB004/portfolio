import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { session, loading, isSupabaseConfigured } = useAuth();
  const location = useLocation();

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen grid place-items-center bg-bg text-white px-6">
        <div className="card max-w-md p-8 text-center">
          <h1 className="font-display text-xl font-bold mb-3">Supabase non configuré</h1>
          <p className="text-ink-muted text-sm">
            Ajoute <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans un
            fichier <code>.env</code> à la racine du projet (voir <code>.env.example</code>) pour
            activer l'espace d'administration.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-bg text-ink-muted">Chargement…</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
