import { useState, useEffect } from 'react';
import { MdArrowUpward } from 'react-icons/md';
import { scrollToTop } from '../utils/landingScroll';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-accent text-primary-dark border-none flex items-center justify-center cursor-pointer shadow-[0_15px_40px_-10px_rgba(251,152,51,0.7)] transition-all duration-500 hover:-translate-y-1 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <MdArrowUpward className="w-5 h-5" aria-hidden />
    </button>
  );
}
