import { Suspense, lazy } from "react";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Skills from "../components/Skills/Skills";
import Seo from "../components/Seo";
import { useSettings } from "../hooks/useContent";

// Sections sous la ligne de flottaison : chargées à la demande (code-splitting)
// pour réduire le bundle initial et améliorer le score Lighthouse.
const Projects = lazy(() => import("../components/Projects/Projects"));
const Experience = lazy(() => import("../components/Experience/Experience"));
const GithubStats = lazy(() => import("../components/GithubStats/GithubStats"));
const CVSection = lazy(() => import("../components/CV/CVSection"));
const Services = lazy(() => import("../components/Services/Services"));
const Contact = lazy(() => import("../components/Contact/Contact"));

const SectionFallback = () => <div className="section-pad" aria-hidden="true" />;

export default function Home() {
  const { data: settings } = useSettings();
  const name = settings?.site_name || "Setra";
  const tagline = settings?.tagline || "Développeur Full-Stack";

  return (
    <>
      <Seo
        title={`${name} — ${tagline}`}
        description={`Portfolio de ${name} — ${tagline}${settings?.location ? ` basé à ${settings.location}` : ""}.`}
        url="/"
      />
      <Hero />
      <About />
      <Skills />
      <Suspense fallback={<SectionFallback />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <GithubStats />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CVSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Services />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Contact />
      </Suspense>
    </>
  );
}
