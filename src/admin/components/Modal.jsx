import { FiX } from "react-icons/fi";

export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <div className={`card w-full ${wide ? "max-w-2xl" : "max-w-md"} p-6 my-8`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-ink-muted hover:text-white transition-colors" aria-label="Fermer">
            <FiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
