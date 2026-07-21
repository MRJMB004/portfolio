import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { FiLock, FiMail, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { signIn, session, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Navigate to={location.state?.from?.pathname || "/admin"} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-bg text-white grid place-items-center px-6">
      <div className="card w-full max-w-sm p-8">
        <div className="flex items-center gap-2 font-display font-bold text-lg mb-8">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-sm">
            S
          </span>
          Espace admin
        </div>

        {!isSupabaseConfigured && (
          <p className="flex items-start gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-4">
            <FiAlertCircle className="shrink-0 mt-0.5" />
            Supabase n'est pas configuré (voir <code>.env.example</code>).
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="admin-label">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={15} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input pl-9"
                placeholder="toi@exemple.com"
                autoComplete="username"
              />
            </div>
          </div>
          <div>
            <label className="admin-label">Mot de passe</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={15} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input pl-9"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <FiAlertCircle /> {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="text-xs text-ink-muted mt-6 leading-relaxed">
          Compte créé depuis Supabase → Authentication → Users. Aucune inscription publique
          n'est proposée ici.
        </p>
      </div>
    </div>
  );
}
