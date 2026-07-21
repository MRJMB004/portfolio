import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <section className="section-pad min-h-[70vh] flex flex-col items-center justify-center text-center pt-32">
      <p className="font-display text-7xl font-bold bg-gradient-brand bg-clip-text text-transparent mb-4">
        404
      </p>
      <p className="text-ink-muted mb-8">Cette page n'existe pas.</p>
      <Link to="/" className="btn-secondary">
        <FiArrowLeft /> Retour à l'accueil
      </Link>
    </section>
  );
}
