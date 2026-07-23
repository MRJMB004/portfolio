import { useEffect, useState } from "react";
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
  FiMenu,
  FiX,
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
  const [open, setOpen] = useState(false);

  // Ferme le menu mobile à chaque fois qu'on revient sur un écran large,
  // pour éviter qu'il reste ouvert en arrière-plan après un resize.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const sidebarContent = (
    <>
      <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-sm">
            S
          </span>
          Admin
        </Link>
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-ink-muted hover:text-white"
          aria-label="Fermer le menu"
        >
          <FiX size={22} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
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
    </>
  );

  return (
    <div className="min-h-screen bg-bg text-white md:flex">
      {/* Barre du haut, visible uniquement sur mobile/tablette */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-bg-soft/70 backdrop-blur-sm">
        <Link to="/admin" className="flex items-center gap-2 font-display font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-sm">
            S
          </span>
          Admin
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="text-white p-1"
          aria-label="Ouvrir le menu"
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* Overlay mobile derrière le menu déroulant */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar : fixe en overlay sur mobile, statique en colonne sur desktop */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 max-w-[85vw] md:w-64 md:max-w-none shrink-0 border-r border-white/10 bg-bg-soft flex flex-col transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
