import {
  MdDirectionsCar,
  MdRoute,
  MdSecurity,
  MdSettings,
  MdBolt,
  MdVerifiedUser,
} from "react-icons/md";

export default function About() {
  const whenToUse = [
    "Has consumido alcohol y requieres llevar tu automóvil seguro a casa.",
    "Cansancio físico, estrés o indisposición para manejar.",
    "Imposibilidad temporal de desplazarte o motivos de salud.",
    "Traslado seguro de tu vehículo a una ubicación o taller específico.",
    "Deseas que un conductor calificado y confiable maneje por ti.",
  ];

  const steps = [
    { num: "1", title: "Solicita el servicio", text: "Registra origen, destino y los datos de tu vehículo desde la aplicación móvil." },
    { num: "2", title: "Asignación ágil", text: "El administrador asigna de inmediato un conductor calificado disponible." },
    { num: "3", title: "Recepción e inspección", text: "El conductor recibe el automóvil y toma el registro fotográfico de verificación." },
    { num: "4", title: "Visualización de ruta", text: "Visualiza la ruta del recorrido hasta el destino y confirma la entrega del vehículo." },
  ];

  const whyUs = [
    { icon: <MdDirectionsCar className="w-5 h-5 text-accent" />, title: "Conductores profesionales", text: "Personal capacitado para brindar un servicio seguro y confiable." },
    { icon: <MdRoute className="w-5 h-5 text-accent" />, title: "Visualización de ruta", text: "Visualiza el trazado del trayecto desde el origen hasta el punto final." },
    { icon: <MdSecurity className="w-5 h-5 text-accent" />, title: "Seguridad y control", text: "Inspección fotográfica previa y gestión de novedades en el camino." },
    { icon: <MdSettings className="w-5 h-5 text-accent" />, title: "Plataforma inteligente", text: "Gestión eficiente de clientes, conductores y asignaciones." },
    { icon: <MdBolt className="w-5 h-5 text-accent" />, title: "Atención rápida", text: "Asignación ágil para reducir tiempos de espera." },
    { icon: <MdVerifiedUser className="w-5 h-5 text-accent" />, title: "Documentación al día", text: "Control de vigencia de SOAT, tecnomecánica y licencias." },
  ];

  const serviceIncludes = [
    "Asignación de conductor",
    "Visualización de la ruta",
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
        "Visualización de la ruta.",
        "Mayor tranquilidad y seguridad.",
        "Información organizada de vehículos.",
        "Confirmación de entrega en destino.",
        "Calificación del servicio recibido.",
      ],
    },
    {
      title: "Para conductores",
      items: [
        "Recepción de servicios asignados.",
        "Visualización de la ruta hacia el destino.",
        "Registro fotográfico del vehículo.",
        "Reporte de novedades con evidencia.",
        "Gestión desde la aplicación móvil.",
      ],
    },
    {
      title: "Para administradores",
      items: [
        "Gestión de cuentas y usuarios.",
        "Administración de conductores y vehículos.",
        "Control de vigencia SOAT y tecnomecánica.",
        "Asignación ágil de solicitudes.",
        "Visualización de rutas y novedades.",
        "Métricas y estadísticas de desempeño.",
      ],
    },
  ];

  const characteristics = [
    "Plataforma Web Administrativa",
    "Aplicación Móvil para Clientes y Conductores",
    "Visualización de Ruta de Servicios",
    "Control de Vigencia de Documentos (SOAT y Tecnomecánica)",
    "Registro Fotográfico de Verificación del Vehículo",
    "Gestión de Novedades con Evidencias en Ruta",
    "Gestión de Roles y Permisos",
    "Calificación y Comentarios de Clientes",
    "Métricas Operativas y Dashboard",
    "Control de Licencias de Conducción",
  ];

  const faqs = [
    { q: "¿Qué es la plataforma Mi Conductor de GoDriver?", a: "Es una solución web y móvil creada para gestionar y prestar servicios de conductor capacitado que traslada tu automóvil de forma segura." },
    { q: "¿Cómo puedo ver el recorrido del servicio?", a: "El sistema permite la visualización completa de la ruta del servicio desde el punto de origen hasta el destino para clientes, conductores y administradores." },
    { q: "¿Cómo se asegura el estado de mi vehículo al recibirlo?", a: "El conductor asignado realiza una inspección física y un registro fotográfico de verificación antes de iniciar el trayecto." },
    { q: "¿Se puede reportar alguna novedad o incidente en el camino?", a: "Sí, el conductor puede reportar novedades (tráfico, dificultades con el vehículo) adjuntando fotos para que el administrador gestione la solución oportuna." },
    { q: "¿Puedo calificar al conductor al finalizar?", a: "Sí, los clientes pueden valorar la experiencia de 1 a 5 estrellas y agregar sus comentarios desde la aplicación móvil." },
  ];

  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20 space-y-16 sm:space-y-24">

        {/* ¿Qué es? */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center" id="sobre-mi-conductor">
          <div>
            <p className="text-accent text-xs sm:text-sm font-semibold tracking-wide mb-2">
              ¿QUÉ ES MI CONDUCTOR?
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-4 leading-tight">
              Tu vehículo en las mejores manos.
            </h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              La empresa <strong>GoDriver</strong> ofrece servicios de conducción segura y profesional
              a través de la plataforma <strong>“Mi Conductor”</strong>. Diseñada para personas que,
              por situaciones como consumo de alcohol, cansancio o indisposición para manejar, necesitan que un
              conductor capacitado traslade su automóvil a su destino con total tranquilidad.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Olvídate de las asignaciones lentas e inconsistentes: nuestro sistema conecta clientes y conductores
              en tiempo récord con visualización clara de la ruta, verificación de estado del vehículo y
              soporte continuo ante cualquier novedad en el camino.
            </p>
          </div>

          {/* ¿Cuándo usarlo? */}
          <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/10">
            <h3 className="text-base sm:text-lg font-semibold text-primary-dark mb-4">
              ¿Cuándo puedes solicitar Mi Conductor?
            </h3>
            <ul className="space-y-3">
              {whenToUse.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-normal">
                  <span className="text-accent mt-0.5 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cómo funciona */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2 sm:mb-3">¿Cómo funciona?</h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              El proceso completo, desde la solicitud hasta la entrega segura de tu vehículo.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((step) => (
              <div key={step.title} className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary-dark font-bold flex items-center justify-center text-base mb-4">
                  {step.num}
                </div>
                <h3 className="text-sm font-semibold text-primary-dark mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Por qué elegirnos */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2 sm:mb-3">¿Por qué elegir Mi Conductor?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {whyUs.map((item) => (
              <div key={item.title} className="rounded-2xl p-5 sm:p-6 bg-primary/5 border border-primary/10">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg mb-4 shadow-xs">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-primary-dark mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nuestros servicios */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-primary-dark rounded-3xl p-6 sm:p-10 md:p-14" id="servicios">
          <div>
            <p className="text-accent text-xs sm:text-sm font-semibold tracking-wide mb-2">NUESTROS SERVICIOS</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Servicio de conductor elegido</h2>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Ideal cuando no puedes conducir tu automóvil o vehículo.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {serviceIncludes.map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs sm:text-sm text-white bg-white/10 rounded-lg px-3 py-2.5">
                <span className="text-accent font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        

        {/* Beneficios */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2 sm:mb-3">Beneficios</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((group) => (
              <div key={group.title} className="border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs bg-white">
                <h3 className="text-sm sm:text-base font-semibold text-primary-dark mb-3 sm:mb-4">{group.title}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                      <span className="text-primary mt-0.5 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Características principales */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2 sm:mb-3">Características principales</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {characteristics.map((item) => (
              <span
                key={item}
                className="text-xs font-medium text-primary-dark bg-primary/10 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary/20"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Misión y visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/10">
            <h3 className="text-base sm:text-lg font-semibold text-primary-dark mb-2 sm:mb-3">Nuestra misión</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Brindar una solución tecnológica que facilite la gestión de servicios de
              conductor elegido, garantizando seguridad, eficiencia y confianza mediante
              la visualización de ruta y una administración inteligente de los servicios.
            </p>
          </div>
          <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/10">
            <h3 className="text-base sm:text-lg font-semibold text-primary-dark mb-2 sm:mb-3">Nuestra visión</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ser una plataforma líder en servicios de conductor elegido, reconocida por
              ofrecer innovación, seguridad y una experiencia confiable para clientes,
              conductores y empresas.
            </p>
          </div>
        </div>

        {/* Preguntas frecuentes */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2 sm:mb-3">Preguntas frecuentes</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="group border border-slate-200/80 rounded-xl p-4 sm:p-5 open:bg-primary/5 transition-colors">
                <summary className="text-xs sm:text-sm font-medium text-primary-dark cursor-pointer list-none flex items-center justify-between gap-3">
                  <span>{item.q}</span>
                  <span className="text-accent text-base sm:text-lg group-open:rotate-45 transition-transform shrink-0">＋</span>
                </summary>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
