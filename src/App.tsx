import { useEffect } from "react";
import "./style.css";
import { initPortfolio } from "./legacy/initPortfolio";

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

  const email = "mehrabgholamsamani@gmail.com"; 
  return (
    <>
      <GalaxyBackground />

      <Header onQuickContact={() => document.getElementById("hcqModal")?.classList.add("open")} />
      <Hero onQuickContact={() => document.getElementById("hcqModal")?.classList.add("open")} />

      <Experience />
      <Projects />
      <Testimonials />
      <Skills />
      <Contact email={email} onQuickContact={() => document.getElementById("hcqModal")?.classList.add("open")} />
      <Footer />

      <QuickContactModal email={email} />
      <ScrollTopButton />
    </>
  );
}
