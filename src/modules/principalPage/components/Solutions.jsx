import { useNavigate } from 'react-router-dom';
import { MdPerson, MdDirectionsCar, MdAdminPanelSettings } from 'react-icons/md';

export default function Solutions() {
  const navigate = useNavigate();

  const handleCta = (e, cta) => {
    e.preventDefault();
    if (cta === 'Ver funciones') {
      document.getElementById('funciones')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/login');
    }
  };

  const cards = [
    {
      icon: <MdPerson className="w-8 h-8 text-primary" />,
      title: "Para el Cliente (App Móvil)",
      description:
        "Solicita el traslado seguro de tu automóvil, registra tus vehículos con SOAT y tecnomecánica, y visualiza la ruta de tu viaje.",
      features: ["Visualización de Ruta", "Calificación y Comentarios"],
      cta: "Ver funciones",
      theme: "light-primary",
    },
    {
      icon: <MdDirectionsCar className="w-8 h-8 text-accent" />,
      title: "Para el Conductor (App Móvil)",
      description:
        "Acepta servicios asignados, realiza registro fotográfico del estado del vehículo y reporta novedades con fotos en el trayecto.",
      features: ["Inspección Fotográfica", "Reporte de Novedades"],
      cta: "Ver funciones",
      theme: "light-accent",
    },
    {
      icon: <MdAdminPanelSettings className="w-8 h-8 text-amber-400" />,
      title: "Para el Administrador (Web)",
      description:
        "Gestión integral de usuarios, asignación ágil de conductores, control de vigencias y métricas operativas centralizadas.",
      features: ["Asignación y Despacho", "Monitoreo y Métricas"],
      cta: "Panel Administrativo",
      theme: "dark",
    },
  ];

  const themeStyles = {
    "light-primary": {
      bg: "bg-primary/5",
      iconBg: "bg-primary/10",
      title: "text-primary-dark",
      text: "text-slate-600",
      link: "text-primary-dark",
    },
    "light-accent": {
      bg: "bg-accent/5",
      iconBg: "bg-accent/10",
      title: "text-primary-dark",
      text: "text-slate-600",
      link: "text-primary-dark",
    },
    dark: {
      bg: "bg-primary-dark",
      iconBg: "bg-white/10",
      title: "text-white",
      text: "text-slate-300",
      link: "text-accent",
    },
  };

  return (
    <section id="usuarios" className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2 sm:mb-3">
            Soluciones a la medida de tu rol
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Diseñamos una experiencia específica para cada integrante del
            ecosistema de conducción segura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {cards.map((card) => {
            const t = themeStyles[card.theme];
            return (
              <div key={card.title} className={`${t.bg} rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-black/5`}>
                <div>
                  <div
                    className={`w-11 h-11 rounded-xl ${t.iconBg} flex items-center justify-center text-lg mb-4 sm:mb-6`}
                  >
                    {card.icon}
                  </div>

                  <h3 className={`text-base sm:text-lg font-semibold mb-2 ${t.title}`}>
                    {card.title}
                  </h3>
                  <p className={`text-xs sm:text-sm mb-6 ${t.text} leading-relaxed`}>{card.description}</p>

                  <ul className="space-y-2 mb-6 sm:mb-8">
                    {card.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-center gap-2 text-xs sm:text-sm ${t.text}`}
                      >
                        <span className="text-emerald-500 font-bold">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <a
                    href={card.cta === 'Ver funciones' ? '#funciones' : '/login'}
                    onClick={(e) => handleCta(e, card.cta)}
                    className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${t.link} hover:underline`}
                  >
                    <span>{card.cta}</span>
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
