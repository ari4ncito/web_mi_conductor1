import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Solutions from "../components/Solutions";
import Features from "../components/Features";
import Cta from "../components/Cta";
import Footer from "../components/Footer";

export default function PrincipalPage() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <Solutions />
      <Features />
      <Cta />
      <Footer />
    </div>
  );
}