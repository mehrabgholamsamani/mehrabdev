import { useCallback, useEffect } from "react";
import "./style.css";
import { initPortfolio } from "./legacy/initPortfolio";

import { SeoHead } from "./components/SeoHead";
import { GalaxyBackground } from "./components/GalaxyBackground";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero/Hero";
import { Experience } from "./components/Experience";
import { CodeEditor } from "./components/CodeEditor";
import { Projects } from "./components/Projects";
import { Testimonials } from "./components/Testimonials";
import { Skills } from "./components/Skills";
import { TechOrbit } from "./components/TechOrbit";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { QuickContactModal } from "./components/QuickContactModal";
import { ScrollTopButton } from "./components/ScrollTopButton";

export default function App() {
  useEffect(() => {
    const cleanup = initPortfolio();
    return () => cleanup();
  }, []);

  const openModal = useCallback(() => {
    const modal = document.getElementById("hcqModal");
    if (!modal) return;
    modal.classList.remove("hcq-closing");
    modal.classList.add("hcq-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      (document.getElementById("hcqMessage") as HTMLTextAreaElement | null)?.focus();
    }, 50);
  }, []);

  const email = "mehrab@mehrabdev.com";
  return (
    <>
      <SeoHead />
      <GalaxyBackground />

      <Header onQuickContact={openModal} />
      <Hero onQuickContact={openModal} />

      <Experience />
      <CodeEditor />
      <Projects />
      <Testimonials />
      <Skills />
      <TechOrbit />
      <Contact email={email} onQuickContact={openModal} />
      <Footer />

      <QuickContactModal email={email} />
      <ScrollTopButton />
    </>
  );
}
