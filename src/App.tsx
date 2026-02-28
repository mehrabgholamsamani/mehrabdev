import { useCallback, useEffect } from "react";
import "./style.css";
import { initPortfolio } from "./legacy/initPortfolio";

import { SeoHead } from "./components/SeoHead";
import { GalaxyBackground } from "./components/GalaxyBackground";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero/Hero";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Testimonials } from "./components/Testimonials";
import { Skills } from "./components/Skills";
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
    document.getElementById("hcqModal")?.classList.add("open");
  }, []);

  const email = "mehrabgholamsamani@gmail.com";
  return (
    <>
      <SeoHead />
      <GalaxyBackground />

      <Header onQuickContact={openModal} />
      <Hero onQuickContact={openModal} />

      <Experience />
      <Projects />
      <Testimonials />
      <Skills />
      <Contact email={email} onQuickContact={openModal} />
      <Footer />

      <QuickContactModal email={email} />
      <ScrollTopButton />
    </>
  );
}
