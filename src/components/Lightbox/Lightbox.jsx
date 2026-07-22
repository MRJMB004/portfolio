import { useEffect, useRef, useState } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Visionneuse plein écran pour parcourir une liste d'images une par une.
 * Corrige le problème des captures d'écran trop petites pour être lues sur
 * mobile : on clique/tape sur une vignette et l'image s'ouvre en grand,
 * avec navigation précédent/suivant (boutons, clavier, ou glissement au doigt).
 *
 * Props :
 * - images: string[] — liste des URLs d'images
 * - index: number|null — index actuellement ouvert (null = fermé)
 * - onClose: () => void
 * - onIndexChange: (nextIndex: number) => void
 * - alt: (index: number) => string — texte alternatif par image
 */
export default function Lightbox({ images, index, onClose, onIndexChange, alt }) {
  const open = index !== null && index !== undefined;
  const touchStartX = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);

  const goTo = (next) => {
    const total = images.length;
    const wrapped = (next + total) % total;
    onIndexChange(wrapped);
  };

  const goPrev = () => goTo(index - 1);
  const goNext = () => goTo(index + 1);

  // Empêche le scroll de la page derrière la visionneuse + navigation clavier.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  if (!open) return null;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    setDragOffset(e.touches[0].clientX - touchStartX.current);
  };

  const handleTouchEnd = () => {
    const threshold = 50;
    if (dragOffset > threshold) goPrev();
    else if (dragOffset < -threshold) goNext();
    touchStartX.current = null;
    setDragOffset(0);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-sm flex flex-col items-center justify-center animate-[fadeIn_0.15s_ease-out]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Bouton fermer */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Fermer"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:border-accent-violet/60 hover:-translate-y-0.5 z-10"
      >
        <FiX size={20} />
      </button>

      {/* Compteur */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-sm text-ink-muted font-mono px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
        {index + 1} / {images.length}
      </div>

      {/* Flèche précédente */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Image précédente"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:border-accent-violet/60 hover:-translate-x-0.5 z-10"
        >
          <FiChevronLeft size={22} />
        </button>
      )}

      {/* Image courante */}
      <div
        className="relative w-full h-full flex items-center justify-center px-4 sm:px-20 py-16"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={images[index]}
          src={images[index]}
          alt={alt ? alt(index) : `Capture ${index + 1}`}
          className="max-h-full max-w-full object-contain rounded-xl shadow-glow select-none"
          draggable={false}
        />
      </div>

      {/* Flèche suivante */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Image suivante"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:border-accent-violet/60 hover:translate-x-0.5 z-10"
        >
          <FiChevronRight size={22} />
        </button>
      )}

      {/* Vignettes de navigation rapide (desktop) */}
      {images.length > 1 && (
        <div
          className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 gap-2 max-w-[80vw] overflow-x-auto px-2"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => onIndexChange(i)}
              className={`h-12 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                i === index
                  ? "border-accent-violet opacity-100"
                  : "border-white/10 opacity-50 hover:opacity-80"
              }`}
              aria-label={`Aller à l'image ${i + 1}`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
