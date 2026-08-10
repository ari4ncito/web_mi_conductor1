export default function About() {
  const whenToUse = [
    "Has consumido alcohol.",
    "Te encuentras cansado o indispuesto.",
    "No puedes conducir por motivos de salud.",
    "Necesitas transportar tu vehículo de forma segura.",
    "Deseas que un profesional conduzca por ti.",
  ];

  const steps = [
    { icon: "1️⃣", title: "Solicita un conductor", text: "Realiza la solicitud desde la aplicación en pocos pasos." },
    { icon: "2️⃣", title: "Se asigna un conductor", text: "El administrador asigna rápidamente un conductor disponible." },
    { icon: "3️⃣", title: "Seguimiento en tiempo real", text: "Puedes visualizar la ubicación del conductor y el recorrido del servicio." },
    { icon: "4️⃣", title: "Llega seguro a tu destino", text: "El conductor entrega tu vehículo en el destino indicado." },
  ];

  const whyUs = [
    { icon: "🧑‍✈️", title: "Conductores profesionales", text: "Personal capacitado para brindar un servicio seguro." },
    { icon: "📍", title: "Seguimiento en tiempo real", text: "Conoce en todo momento la ubicación del conductor y del vehículo." },
    { icon: "🛡️", title: "Seguridad", text: "Mayor control y trazabilidad durante el recorrido." },
    { icon: "⚙️", title: "Plataforma inteligente", text: "Gestión eficiente de clientes, conductores y servicios." },
    { icon: "⚡", title: "Atención rápida", text: "Asignación eficiente para reducir tiempos de espera." },
    { icon: "🔒", title: "Información protegida", text: "Gestión segura de usuarios y servicios." },
  ];

  const serviceIncludes = [
    "Asignación de conductor",
    "Seguimiento GPS",
    "Registro del servicio",
    "Confirmación de llegada",
    "Reporte de novedades",
    "Control administrativo",
  ];

  const benefits = [
    {
      title: "Para clientes",
      items: [
        "Solicitud rápida del servicio.",
        "Seguimiento en tiempo real.",
        "Mayor tranquilidad.",
        "Información organizada.",
        "Confirmación del recorrido.",
        "Historial de servicios.",
      ],
    },
    {
      title: "Para conductores",
      items: [
        "Recepción de servicios asignados.",
        "Visualización de rutas.",
        "Registro fotográfico del vehículo.",
        "Reporte de novedades.",
        "Gestión desde la aplicación móvil.",
      ],
    },
    {
      title: "Para administradores",
      items: [
        "Gestión de usuarios.",
        "Administración de conductores.",
        "Administración de vehículos.",
        "Gestión de solicitudes.",
        "Seguimiento en tiempo real.",
        "Reportes y métricas.",
      ],
    },
  ];

  const characteristics = [
    "Plataforma Web",
    "Aplicación móvil",
    "Conductores verificados",
    "Seguimiento GPS",
    "Gestión de vehículos",
    "Gestión de usuarios",
    "Reportes de desempeño",
    "Calificaciones",
    "Control administrativo",
    "Reporte de incidentes",
    "Gestión de roles",
    "Seguridad de la información",
  ];

  const faqs = [
    { q: "¿Qué hace Mi Conductor?", a: "Permite solicitar un conductor profesional para transportar tu vehículo cuando no puedas conducir." },
    { q: "¿Puedo ver dónde está el conductor?", a: "Sí. La plataforma permite realizar seguimiento en tiempo real." },
    { q: "¿Mi información está protegida?", a: "Sí. La plataforma gestiona usuarios bajo políticas de seguridad y privacidad." },
    { q: "¿Puedo registrar varios vehículos?", a: "Sí." },
    { q: "¿Los conductores son profesionales?", a: "Sí. La plataforma administra la información y documentación de los conductores." },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 space-y-24">

        {/* ¿Qué es? */}
        <div className="grid md:grid-cols-2 gap-12 items-center" id="sobre-mi-conductor">
          <div>
            <p className="text-accent text-sm font-semibold tracking-wide mb-2">
              ¿QUÉ ES MI CONDUCTOR?
            </p>
            <h2 className="text-3xl font-bold text-primary-dark mb-4">
              Tu vehículo en las mejores manos.
            </h2>
            <p className="text-slate-600 text-sm mb-4">
              Mi Conductor es una plataforma web y móvil desarrollada para conectar
              clientes con conductores profesionales cuando, por cualquier motivo,
              no pueden conducir su propio vehículo.
            </p>
            <p className="text-slate-600 text-sm">
              Nuestro objetivo es brindar una experiencia segura, eficiente y
              transparente mediante herramientas tecnológicas que permiten gestionar,
              monitorear y dar seguimiento a cada servicio en tiempo real.
            </p>
          </div>

          {/* ¿Cuándo usarlo? */}
          <div className="bg-primary/5 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-primary-dark mb-4">
              ¿Cuándo puedes usar Mi Conductor?
            </h3>
            <ul className="space-y-3">
              {whenToUse.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-accent mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cómo funciona */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-primary-dark mb-3">¿Cómo funciona?</h2>
            <p className="text-slate-500 text-sm">
              El proceso completo, desde la solicitud hasta la entrega segura de tu vehículo.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.title} className="bg-white border border-slate-100 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg mb-4">
                  {step.icon}
                </div>
                <h3 className="text-sm font-semibold text-primary-dark mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Por qué elegirnos */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-primary-dark mb-3">¿Por qué elegir Mi Conductor?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {whyUs.map((item) => (
              <div key={item.title} className="rounded-2xl p-6 bg-primary/5">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg mb-4 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-primary-dark mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nuestros servicios */}
        <div className="grid md:grid-cols-2 gap-12 items-center bg-primary-dark rounded-3xl p-10 md:p-14" id="servicios">
          <div>
            <p className="text-accent text-sm font-semibold tracking-wide mb-2">NUESTROS SERVICIOS</p>
            <h2 className="text-2xl font-bold text-white mb-3">Servicio de conductor elegido</h2>
            <p className="text-slate-200 text-sm">
              Ideal cuando no puedes conducir tu vehículo.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {serviceIncludes.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-white bg-white/10 rounded-lg px-3 py-2">
                <span className="text-accent">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        

        {/* Beneficios */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-primary-dark mb-3">Beneficios</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((group) => (
              <div key={group.title} className="border border-slate-100 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-primary-dark mb-4">{group.title}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-500">
                      <span className="text-primary mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Características principales */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-primary-dark mb-3">Características principales</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {characteristics.map((item) => (
              <span
                key={item}
                className="text-xs font-medium text-primary-dark bg-primary/10 px-4 py-2 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Misión y visión */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-primary/5 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-primary-dark mb-3">Nuestra misión</h3>
            <p className="text-sm text-slate-600">
              Brindar una solución tecnológica que facilite la gestión de servicios de
              conductor elegido, garantizando seguridad, eficiencia y confianza mediante
              el seguimiento en tiempo real y una administración inteligente de los servicios.
            </p>
          </div>
          <div className="bg-primary/5 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-primary-dark mb-3">Nuestra visión</h3>
            <p className="text-sm text-slate-600">
              Ser una plataforma líder en servicios de conductor elegido, reconocida por
              ofrecer innovación, seguridad y una experiencia confiable para clientes,
              conductores y empresas.
            </p>
          </div>
        </div>

        {/* Preguntas frecuentes */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-primary-dark mb-3">Preguntas frecuentes</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="group border border-slate-100 rounded-xl p-5 open:bg-primary/5">
                <summary className="text-sm font-medium text-primary-dark cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-accent group-open:rotate-45 transition-transform">＋</span>
                </summary>
                <p className="text-xs text-slate-500 mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}