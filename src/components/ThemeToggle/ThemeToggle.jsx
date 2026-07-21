import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", isLight);
  }, [isLight]);

  return (
    <button
      onClick={() => setIsLight((v) => !v)}
      aria-label="Basculer le thème clair/sombre"
      className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-accent-violet/60 hover:rotate-12"
    >
      {isLight ? <FiMoon size={16} /> : <FiSun size={16} />}
    </button>
  );
}
