export default function Preloader() {
  return (
    <div className="mc-preloader" aria-hidden>
      <div className="flex flex-col items-center gap-6 text-white overflow-hidden">
        <p className="mc-preloader__brand font-display text-4xl sm:text-5xl tracking-tight">
          Mi Conductor<span className="text-accent">.</span>
        </p>
        <div className="flex items-baseline gap-1 text-white/60">
          <span className="mc-preloader__count font-display text-6xl sm:text-7xl text-accent tabular-nums">0</span>
          <span className="text-lg">%</span>
        </div>
      </div>
    </div>
  );
}
