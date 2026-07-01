export default function Solutions() {
  const cards = [
    {
      icon: "🧑",
      title: "Para el Cliente",
      description:
        "Pide tu conductor en segundos, entras en tiempo real y viaja con total tranquilidad.",
      features: ["Tracking GPS Real-time", "Pagos Automatizados"],
      cta: "Ver funciones",
      theme: "light-rose",
    },
    {
      icon: "🚗",
      title: "Para el Conductor",
      description:
        "Gestiona tus servicios, visualiza tus ganancias y recibe asignaciones inteligentes.",
      features: ["Agenda de Servicios", "Historial de Ganancias"],
      cta: "Unirse al equipo",
      theme: "light-blue",
    },
    {
      icon: "🛡️",
      title: "Para la Empresa",
      description:
        "Control total sobre la flota, auditorías de servicios y analítica de rendimiento en tiempo real.",
      features: ["Panel de Analítica", "Gestión de Usuarios"],
      cta: "Enterprise Portal",
      theme: "dark",
    },
  ];

  const themeStyles = {
    "light-rose": {
      bg: "bg-rose-50",
      iconBg: "bg-rose-100",
      title: "text-slate-900",
      text: "text-slate-600",
      link: "text-slate-900",
    },
    "light-blue": {
      bg: "bg-sky-50",
      iconBg: "bg-sky-100",
      title: "text-slate-900",
      text: "text-slate-600",
      link: "text-slate-900",
    },
    dark: {
      bg: "bg-slate-900",
      iconBg: "bg-slate-800",
      title: "text-white",
      text: "text-slate-300",
      link: "text-amber-400",
    },
  };

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Soluciones a la medida de tu rol
          </h2>
          <p className="text-slate-500">
            Diseñamos una experiencia específica para cada integrante del
            ecosistema de conducción segura.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const t = themeStyles[card.theme];
            return (
              <div key={card.title} className={`${t.bg} rounded-2xl p-8`}>
                <div
                  className={`w-11 h-11 rounded-xl ${t.iconBg} flex items-center justify-center text-lg mb-6`}
                >
                  {card.icon}
                </div>

                <h3 className={`text-lg font-semibold mb-2 ${t.title}`}>
                  {card.title}
                </h3>
                <p className={`text-sm mb-6 ${t.text}`}>{card.description}</p>

                <ul className="space-y-2 mb-8">
                  {card.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-center gap-2 text-sm ${t.text}`}
                    >
                      <span className="text-emerald-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#"
                  className={`inline-flex items-center gap-1 text-sm font-medium ${t.link}`}
                >
                  {card.cta} <span aria-hidden>→</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}