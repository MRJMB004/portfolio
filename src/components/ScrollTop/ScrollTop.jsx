import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
      className={`fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full bg-gradient-brand shadow-glow transition-all duration-300 hover:scale-110 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <FiArrowUp size={18} />
    </button>
  );
}
