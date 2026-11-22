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
              La empresa <strong>GoDriver</strong> ofrece servicios de conducción segura y profesional
              a través de la plataforma <strong>“Mi Conductor”</strong>. Diseñada para personas que,
              por situaciones como consumo de alcohol, cansancio o indisposición para manejar, necesitan que un
              conductor capacitado traslade su automóvil a su destino con total tranquilidad.
            </p>
            <p className="text-slate-600 text-sm">
              Olvídate de las asignaciones lentas e inconsistentes: nuestro sistema conecta clientes y conductores
              en tiempo récord con visualización clara de la ruta, verificación de estado del vehículo y
              soporte continuo ante cualquier novedad en el camino.
            </p>
          </div>

          {/* ¿Cuándo usarlo? */}
          <div className="bg-primary/5 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-primary-dark mb-4">
              ¿Cuándo puedes solicitar Mi Conductor?
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
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary-dark font-bold flex items-center justify-center text-base mb-4">
                  {step.num}
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
