import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import About from "../components/about";
import Scenarios from "../components/Scenarios";
import Statement from "../components/Statement";
import HowItWorks from "../components/HowItWorks";
import Solutions from "../components/Solutions";
import Features from "../components/Features";
import Faq from "../components/Faq";
import Cta from "../components/Cta";
import Footer from "../components/Footer";
import BackToTop from "../components/backToTop";

import useLandingAnimations, { readShouldShowPreloader } from "../hooks/useLandingAnimations";
import { scrollToId } from "../utils/landingScroll";
import "lenis/dist/lenis.css";
import "../landing.css";

export default function PrincipalPage() {
  const scopeRef = useRef(null);
  const location = useLocation();
  const [showPreloader] = useState(readShouldShowPreloader);

  useLandingAnimations(scopeRef, { showPreloader });

  // Llegada desde otra página con /#seccion (p. ej. desde las páginas legales)
  useEffect(() => {
    const id = location.hash.replace("#", "");
    if (!id) return undefined;
    const timer = setTimeout(() => scrollToId(id), showPreloader ? 2600 : 300);
    return () => clearTimeout(timer);
  }, [location.hash, showPreloader]);

  return (
    <div ref={scopeRef} className="min-h-screen bg-white font-sans text-slate-900">
      {showPreloader && <Preloader />}
      <Navbar variant="landing" />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Scenarios />
        <Statement />
        <HowItWorks />
        <Solutions />
        <Features />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
