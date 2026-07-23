import { FiDownload, FiFileText, FiExternalLink } from "react-icons/fi";
import Reveal from "../Reveal";
import { useSettings } from "../../hooks/useContent";

export default function CVSection() {
  const { data: settings } = useSettings();
  const cvUrl = settings?.cv_url || "/cv.pdf";

  return (
    <section id="cv" className="section-pad">
      <Reveal>
        <p className="eyebrow mb-4">Mon CV</p>
        <h3 className="font-display text-2xl sm:text-3xl font-bold mb-4">Curriculum Vitae</h3>
        <p className="text-ink-muted mb-10 max-w-lg">
          Un aperçu rapide de mon parcours, ou téléchargez directement le PDF complet.
        </p>
      </Reveal>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
        <Reveal>
          <div className="card p-2 md:p-3">
            <div className="rounded-xl overflow-hidden border border-white/5 bg-bg-soft aspect-[3/4] max-h-[560px]">
              <object data={cvUrl} type="application/pdf" className="w-full h-full">
                <div className="h-full w-full grid place-items-center text-center p-8">
                  <div>
                    <FiFileText size={40} className="mx-auto mb-4 text-ink-muted" />
                    <p className="text-ink-muted text-sm mb-4">
                      L'aperçu n'est pas disponible dans ce navigateur.
                    </p>
                    <a href={cvUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                      Ouvrir le PDF <FiExternalLink />
                    </a>
                  </div>
                </div>
              </object>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="card p-6 md:p-8 h-full flex flex-col">
            <h4 className="font-display font-semibold text-lg mb-5">Résumé</h4>
            <ul className="space-y-4 text-sm text-ink-muted mb-8">
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span>Formation</span>
                <span className="text-white">Développement informatique</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span>Spécialités</span>
                <span className="text-white text-right">Web · Android · Full-Stack</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span>Langues</span>
                <span className="text-white">Français · Anglais</span>
              </li>
              <li className="flex justify-between">
                <span>Localisation</span>
                <span className="text-white">{settings?.location || "Madagascar"}</span>
              </li>
            </ul>
            <a href={cvUrl} download className="btn-primary justify-center mt-auto">
              Télécharger le CV <FiDownload />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
