import { MARQUEE_ITEMS } from '../data/landingContent';

export default function Marquee() {
  // Contenido duplicado: la animación desplaza -50% y vuelve a empezar sin corte
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="mc-marquee bg-accent text-primary-dark py-4 sm:py-5 overflow-hidden select-none" aria-label="Mi Conductor en pocas palabras">
      <div className="mc-marquee__inner">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center font-display italic text-xl sm:text-2xl whitespace-nowrap" aria-hidden={i >= MARQUEE_ITEMS.length}>
            <span className="px-6 sm:px-10">{item}</span>
            <span className="text-primary-dark/40 not-italic text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
