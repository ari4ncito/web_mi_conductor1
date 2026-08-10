import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/about";
import Solutions from "../components/Solutions";
import Features from "../components/Features";
import Cta from "../components/Cta";
import Footer from "../components/Footer";
import BackToTop from "../components/backToTop";

export default function PrincipalPage() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <About />
      <Solutions />
      <Features />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}