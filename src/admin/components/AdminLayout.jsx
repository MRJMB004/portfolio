import { NavLink, Link } from "react-router-dom";
import {
  FiGrid,
  FiFolder,
  FiBarChart2,
  FiClock,
  FiTool,
  FiMail,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiExternalLink,
} from "react-icons/fi";
import { useAuth } from "../AuthContext";

const nav = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/projects", label: "Projets", icon: FiFolder },
  { to: "/admin/skills", label: "Compétences", icon: FiBarChart2 },
  { to: "/admin/experience", label: "Expériences", icon: FiClock },
  { to: "/admin/services", label: "Services", icon: FiTool },
  { to: "/admin/messages", label: "Messages", icon: FiMail },
  { to: "/admin/cv", label: "CV", icon: FiFileText },
  { to: "/admin/settings", label: "Paramètres", icon: FiSettings },
];

export default function AdminLayout({ children }) {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-bg text-white flex">
      <aside className="w-64 shrink-0 border-r border-white/10 bg-bg-soft/40 flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-sm">
              S
            </span>
            Admin
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-gradient-brand text-white"
                    : "text-ink-muted hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-ink-muted hover:bg-white/5 hover:text-white transition-colors"
          >
            <FiExternalLink size={16} /> Voir le site
          </a>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-ink-muted hover:bg-white/5 hover:text-red-400 transition-colors"
          >
            <FiLogOut size={16} /> Déconnexion
          </button>
          {user?.email && (
            <p className="px-4 pt-2 text-xs text-ink-muted/60 truncate">{user.email}</p>
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
